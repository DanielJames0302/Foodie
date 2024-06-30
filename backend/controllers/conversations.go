package controllers

import (
	"net/http"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

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

	lastMessage := conversation.Messages[len(conversation.Messages)-1]

	if !(len(conversation.Messages) > 0) {
		return context.JSON(conversation)
	}

	lastMessage.SeenIds = append(lastMessage.SeenIds, &user)
	if err := db.Save(&lastMessage).Error; err != nil {
		return context.Status(fiber.StatusInternalServerError).SendString("Failed to update message")
	}

	return context.Status(http.StatusOK).SendString("Success")

}
