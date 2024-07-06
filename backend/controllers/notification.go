package controllers

import (
	"net/http"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetNotifications(context *fiber.Ctx, db *gorm.DB)  error {
	userId := context.Locals("userId").(uint);
	notifications := []models.Notification{};
	query := db.Where("profile_id = ?", userId).Find(&notifications);
	if query.RowsAffected == 0 {
		return context.Status(http.StatusOK).JSON(notifications);
	}
	if (query.Error != nil) {
		return context.Status(http.StatusInternalServerError).SendString("Internal Server Error");
	}

	return context.Status(http.StatusOK).JSON(notifications);
}

func GetUnSeenNotifications(context *fiber.Ctx, db *gorm.DB) error {
	userId := context.Locals("userId").(uint);
	seenNotifications := []models.Notification{};
	query := db.Where("profile_id = ? AND seen = ?", userId, false).Find(&seenNotifications);
	if query.RowsAffected == 0 {
		return context.Status(http.StatusOK).JSON(seenNotifications);
	}
	if (query.Error != nil) {
		return context.Status(http.StatusInternalServerError).SendString("Internal Server Error");
	}

	return context.Status(http.StatusOK).JSON(seenNotifications);
}

func NotificationSeen(context *fiber.Ctx, db *gorm.DB) error {
	userId := context.Locals("userId").(uint);
	query := db.Model(&models.Notification{}).Where("profile_id = ?", userId).Update("seen", true);
	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).SendString("Unable to update notifications");
	}
	return context.Status(http.StatusOK).SendString("Update seen notifications successfully");
}