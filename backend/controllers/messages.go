package controllers

import (
	"net/http"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetMessages(context *fiber.Ctx, db *gorm.DB) error {
	results := []models.Message{};
	conversationId := context.Params("conversationId");

	err := db.Model(models.Message{}).Joins("INNER JOIN conversation_message cm ON cm.conversation_id = ?", conversationId).Preload("SeenIds").Find(&results).Error;

	if err != nil {
		panic(err);
	}

	return context.Status(http.StatusOK).JSON(results);
}	