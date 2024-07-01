package controllers

import (

	"net/http"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
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

func CreateConversation(context *fiber.Ctx, db *gorm.DB) error {
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

func ConversationSeen(context *fiber.Ctx, db *gorm.DB) error {
	userId := context.Locals("userId").(uint)
	conversationId := context.Params("id")

	conversation := models.Conversation{}

	err := db.Model(&models.Conversation{}).Where("id = ?", conversationId).Preload("Users").Preload("Messages").First(&conversation).Error

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



	lastMessage.SeenIds = append(lastMessage.SeenIds, &user)
	if err := db.Save(&lastMessage).Error; err != nil {
		return context.Status(fiber.StatusInternalServerError).SendString("Failed to update message")
	}

	return context.Status(http.StatusOK).SendString("Success")

}
