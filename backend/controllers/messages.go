package controllers

import (
	"net/http"
	"time"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetMessages(context *fiber.Ctx, db *gorm.DB) error {
	results := []models.Message{};
	conversationId := context.Params("conversationId");

	err := db.Model(&models.Message{}).
    Joins("INNER JOIN conversation_message cm ON cm.message_id = messages.id AND cm.conversation_id = ?", conversationId).
    Preload("Sender").
    Preload("SeenIds").
    Find(&results).Error;

	if err != nil {
		panic(err);
	}

	return context.Status(http.StatusOK).JSON(results);
}	

func CreateMessage(context *fiber.Ctx, db *gorm.DB) error {
	requestBody := models.Message{};
	userId := context.Locals("userId").(uint)
	err := context.BodyParser(&requestBody);
	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problems with message body"})
	}

	user := models.Users{};
	err = db.First(&user, userId).Error; 
	if err != nil {
		return context.Status(fiber.StatusNotFound).SendString("User not found")
	}
	newMessage := models.Message{
		Body:          requestBody.Body,
		Image:         requestBody.Image,
		ConversationId: requestBody.ConversationId,
		SenderId:      userId,
	}
	newMessage.SeenIds = append(newMessage.SeenIds, &user)
	err = db.Create(&newMessage).Error;

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to save message"});
	}

	var updatedConversation models.Conversation
	if err := db.Preload("Users").Preload("Messages.SeenIds").First(&updatedConversation, requestBody.ConversationId).Error; err != nil {
		return context.Status(fiber.StatusInternalServerError).SendString("Failed to find conversation")
	}

	updatedConversation.LastMessageAt = time.Now()
	updatedConversation.Messages = append(updatedConversation.Messages, &newMessage)

	if err := db.Save(&updatedConversation).Error; err != nil {
		return context.Status(fiber.StatusInternalServerError).SendString("Failed to update conversation")
	}
	return context.Status(http.StatusOK).JSON(fiber.Map{"message": "Save message successfully"});
}