package controllers

import (
	"net/http"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetConversations(context *fiber.Ctx, db *gorm.DB) error {
  userId := context.Locals("userId")
	result := []models.Conversation{};

	err := db.Model(&models.Conversation{}).Joins("INNER JOIN conversation_user ON conversation_user.conversation_id = conversations.id").Where("conversation_user.users_id = ?", userId).Preload("Users").Find(&result).Error;

	if (err != nil) {
		panic(err);
	}

	return context.Status(http.StatusOK).JSON(result);

}

func GetConversationById(context *fiber.Ctx, db *gorm.DB) error {
	conversationId := context.Params("id");
	result := models.Conversation{};

	err := db.Model(&models.Conversation{}).Where("conversations.id = ?", conversationId).Preload("Users").Find(&result).Error;

	if err != nil {
		panic(err)
	}

	return context.Status(http.StatusOK).JSON(result);
}