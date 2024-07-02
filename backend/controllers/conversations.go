package controllers

import (
	"net/http"
	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"github.com/pusher/pusher-http-go/v5"
	"gorm.io/gorm"
)
type ConversationRequest struct {
	UserId uint `json:"userId"`;
}

func GetConversations(context *fiber.Ctx, db *gorm.DB) error {
	userId := context.Locals("userId")
	result := []models.Conversation{}

	err := db.Model(&models.Conversation{}).Joins("INNER JOIN conversation_user ON conversation_user.conversation_id = conversations.id").Where("conversation_user.users_id = ?", userId).Preload("Users").Preload("Messages", func(db *gorm.DB) *gorm.DB {
		return db.Preload("SeenIds")
	}).Find(&result).Error

	if err != nil {
		panic(err)
	}

	return context.Status(http.StatusOK).JSON(result)

}

func CreateConversation(context *fiber.Ctx, db *gorm.DB, pusherClient *pusher.Client) error {
	ConversationRequest := ConversationRequest{};
	userId := context.Locals("userId").(uint);

	err := context.BodyParser(&ConversationRequest);
	if err != nil {
		return context.Status(http.StatusBadRequest).SendString("Problems with body request");
	}
	

	user := models.Users{};
	err = db.First(&user, userId).Error; 
	if err != nil {
		return context.Status(fiber.StatusNotFound).SendString("User not found")
	}

	existingConversations := []models.Conversation{};

	err = db.Joins("INNER JOIN conversation_user cu1 ON cu1.conversation_id = conversations.id").
	Joins("INNER JOIN conversation_user cu2 ON cu2.conversation_id = conversations.id").
	Where("cu1.users_id = ? AND cu2.users_id = ?", userId, ConversationRequest.UserId).
	Or("cu1.users_id = ? AND cu2.users_id = ?", ConversationRequest.UserId, userId).
	Find(&existingConversations).Error
	
	if err != nil {
		return context.JSON(err)
	}


	if len(existingConversations) > 0 {
		return context.Status(http.StatusOK).JSON(existingConversations[0]);
	} else {
		  otherUser := models.Users{};
			err = db.First(&otherUser, ConversationRequest.UserId).Error; 
			if err != nil {
				return context.Status(fiber.StatusNotFound).SendString("Other user not found")
			}

			newConversation := models.Conversation{
				Name: "",
				IsGroup: false,
			}
			newConversation.Users = append(newConversation.Users, &user);
			newConversation.Users = append(newConversation.Users, &otherUser);

			err = db.Create(&newConversation).Error;

			if err != nil {

				return context.Status(http.StatusInternalServerError).SendString("Cannot create conversation");
			}
			for _, user := range newConversation.Users {
				pusherClient.Trigger(user.Username, "conversation:new", newConversation);
			}

			return context.Status(http.StatusOK).JSON(newConversation);
	}

}

func GetConversationById(context *fiber.Ctx, db *gorm.DB) error {
	conversationId := context.Params("id")
	result := models.Conversation{}

	err := db.Model(&models.Conversation{}).Where("conversations.id = ?", conversationId).Preload("Users").Find(&result).Error

	if err != nil {
		panic(err)
	}

	return context.Status(http.StatusOK).JSON(result)
}

func ConversationSeen(context *fiber.Ctx, db *gorm.DB, pusherClient *pusher.Client) error {
	userId := context.Locals("userId").(uint)
	conversationId := context.Params("id")

	conversation := models.Conversation{}

	err := db.Model(&models.Conversation{}).Preload("Users").Preload("Messages", func(db *gorm.DB) *gorm.DB {
		return db.Order("created_at ASC").Preload("SeenIds").Preload("Sender")}).First(&conversation, conversationId).Error

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Cannot find messaage"})
	}

	user := models.Users{}
	err = db.First(&user, userId).Error
	if err != nil {
		return context.Status(fiber.StatusNotFound).SendString("User not found")
	}

	if !(len(conversation.Messages) > 0) {
		return context.Status(http.StatusOK).JSON(conversation)
	}

	lastMessage := conversation.Messages[len(conversation.Messages)-1]
	err = db.Preload("Sender").Preload("SeenIds").First(&lastMessage, lastMessage.ID).Error
	if err != nil {
		return context.Status(http.StatusInternalServerError).SendString("Failed to reload message: " + err.Error())
	}

	for _, user := range lastMessage.SeenIds {
		if user.ID == userId {
			return context.JSON(conversation)
		}
	}
	lastMessage.SeenIds = append(lastMessage.SeenIds, &user)
	if err := db.Save(&lastMessage).Error; err != nil {
		return context.Status(fiber.StatusInternalServerError).SendString("Failed to update message")
	}

	

	// Update all connections with new seen
	err = pusherClient.Trigger(user.Username, "conversation:update", map[string]interface{}{
		"ID": conversationId,
		"Messages": lastMessage,
	})
	if err != nil {
		return context.Status(http.StatusInternalServerError).SendString("Failed to trigger pusher event: " + err.Error())
	}

	


	err = pusherClient.Trigger(conversationId, "message:update", lastMessage)
	if err != nil {
		return context.Status(http.StatusInternalServerError).SendString("Failed to trigger pusher event: " + err.Error())
	}
	return context.Status(http.StatusOK).SendString("Success")
}


func DeleteConversation(context *fiber.Ctx, db *gorm.DB, pusherClient *pusher.Client) error {
	conversationId := context.Params("id");
	userId := context.Locals("userId").(uint);

	user := models.Users{};
	err := db.First(&user, userId).Error; 
	if err != nil {
		return context.Status(fiber.StatusNotFound).SendString("User not found")
	}

	existingConversations := models.Conversation{};

	err = db.Model(&models.Conversation{}).Preload("Users").Find(&existingConversations, conversationId).Error;
	if err != nil {
		return context.Status(http.StatusInternalServerError).SendString("Unable to load conversation");
	}

	userInConversation := false
	for _, user := range existingConversations.Users {
			if user.ID == userId {
				userInConversation = true
				break
			}
	}

	if !userInConversation {
			return context.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "You are not part of this conversation"})
	}

	err = db.Where("id = ?", conversationId).Delete(&models.Conversation{}).Error;
	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Unable to delete conversation"});
	}


	return context.Status(http.StatusOK).SendString("Success");


}