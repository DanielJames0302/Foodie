package controllers

import (
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
	user := []models.Users{}

	if param_name == "" {
		return context.Status(http.StatusOK).JSON([]models.Users{})
	}

	query := db.Raw("SELECT username, id, name, profile_pic FROM users WHERE name LIKE ? LIMIT 20",param_name + "%").Scan(&user)
	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}

	return  context.Status(http.StatusOK).JSON(user)

}