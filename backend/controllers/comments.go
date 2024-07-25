package controllers

import (
	"net/http"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)



type CommentPayload struct {
	PostID string `json:"postID"`
}

func GetComments(context *fiber.Ctx, db *gorm.DB) error {
	
	results := []models.Comments{}
	postID := context.Query("postId")
	err := db.Model(&models.Comments{}).
		Joins("INNER JOIN users ON comments.user_id = users.id").
		Where("comments.post_id = ?", postID).
		Order("comments.created_at").Preload("Users").
		Find(&results).Error

	if err != nil {
		context.Status(http.StatusNotFound).JSON(&fiber.Map{"message": "Cannot found comments"})
		return err;
	}

	return context.Status(http.StatusOK).JSON(results)
}


func AddComment(context *fiber.Ctx, db *gorm.DB) error {

	commentModel := models.Comments{}

	err := context.BodyParser(&commentModel)

	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Request failed"})
	}

	userInfoId := context.Locals("userId").(uint)

	commentModel.UserID = userInfoId

	result := db.Create(&commentModel)

	if result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable create comment"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"messge": "Comment has been created succesfully"})
}