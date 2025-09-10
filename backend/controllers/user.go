package controllers

import (
	"fmt"
	"net/http"

	"github.com/DanielJames0302/Foodie/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type SearchUserPayLoad struct {
	Username string `json:"username" validate:"required"`
}

func GetUser(context *fiber.Ctx, db *gorm.DB) error {
	userModel := models.Users{}
	userInfoId := context.Locals("userId")

	paramUserId := context.Params("userId")
	if (paramUserId != "") {
		if err := db.Where("id = ?", paramUserId).First(&userModel).Error; err != nil {
			return context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "Unable to fetch user"})
		}
	} else {
		if err := db.Where("id = ?", userInfoId).First(&userModel).Error; err != nil {
			return context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "Unable to fetch user"})
		}
	}

	return context.Status(http.StatusOK).JSON(userModel)
}


func UpdateUser(context *fiber.Ctx, db *gorm.DB) error {
	UserPayload := models.Users{}

	err := context.BodyParser(&UserPayload)
	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Uanble to parse request body"})
	}

	userInfoId := context.Locals("userId"); 


	err = db.Model(models.Users{}).Where("id = ?", userInfoId).Updates(UserPayload).Error

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to update your profile"})
	}

	return context.Status(http.StatusOK).JSON(fiber.Map{"message": "Update profile successfully"})
}


func SearchUser(context *fiber.Ctx, db *gorm.DB) error {
	param_name := context.Query("name")
	users := []models.Users{}

	// Debug logging
	fmt.Printf("Search query received: '%s'\n", param_name)

	if param_name == "" {
		return context.Status(http.StatusOK).JSON([]models.Users{})
	}

	// Search both name and username with case-insensitive matching
	searchPattern := "%" + param_name + "%"
	query := db.Where("name ILIKE ? OR username ILIKE ?", searchPattern, searchPattern).
		Select("id, username, name, profile_pic, email, city").
		Limit(20).
		Find(&users)
	
	if query.Error != nil {
		fmt.Printf("Database error: %v\n", query.Error)
		return context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "Unable to search users", "error": query.Error.Error()})
	}

	fmt.Printf("Found %d users\n", len(users))
	return context.Status(http.StatusOK).JSON(users)
}