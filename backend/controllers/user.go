package controllers

import (
	"fmt"
	"net/http"


	"github.com/DanielJames0302/Foodie/models"
	"github.com/go-playground/validator/v10"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"gorm.io/gorm"
)
var validate = validator.New()
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

	if err != nil {
		return context.JSON("Problem with user id")
	}

	err = db.Model(models.Users{}).Where("id = ?", userInfoId).Updates(UserPayload).Error

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to update your profile"})
	}

	return context.Status(http.StatusOK).JSON(fiber.Map{"message": "Update profile successfully"})
}


func SearchUser(context *fiber.Ctx, db *gorm.DB) error {
	sess := context.Locals("session").(*session.Session)
	payload := SearchUserPayLoad{}
	user := []models.Users{}
	err := context.BodyParser(&payload)

	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Unable to parse request body"})
	}
	errs := validate.Struct(payload)
	if errs != nil {
		validationErrors := make([]string, 0)
		for _, err := range errs.(validator.ValidationErrors) {
				validationErrors = append(validationErrors, fmt.Sprintf("Field '%s' failed validation '%s' (actual value: '%v')", err.Field(), err.Tag(), err.Value()))
		}
		return context.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"errors": validationErrors,
		})
	}
	username := sess.Get("username")
	query := db.Raw("SELECT username FROM users WHERE username != ? AND username LIKE ? LIMIT 20",username, "t%").Scan(&user)
	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}

	return  context.Status(http.StatusOK).JSON(user)

}