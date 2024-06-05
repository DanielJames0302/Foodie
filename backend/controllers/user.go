package controllers

import (
	"fmt"
	"net/http"
	"strconv"

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
	currentUserId, ok := context.Locals("userId").(string); 
	if !ok {
		return context.JSON("Problem with user id")
	}

	currentUserID, err := strconv.Atoi(currentUserId)
	if err != nil {
		return context.JSON("Problem with user id")
	}

	userId := context.Params("userId")
	if (userId != "") {
		err = db.Where("id = ?", userId).First(&userModel).Error
	} else {
		err = db.Where("id = ?", currentUserID).First(&userModel).Error
	}
	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "Unable to fetch user"})
	}
	return context.Status(http.StatusOK).JSON(userModel)
}


func UpdateUser(context *fiber.Ctx, db *gorm.DB) error {
	UserPayload := models.Users{}
	var currentUserID = 0

	err := context.BodyParser(&UserPayload)
	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Uanble to parse request body"})
	}

	if userId, ok := context.Locals("userId").(string); ok {
		currentUserID, err = strconv.Atoi(userId)
		if err != nil {
			return context.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Problem with your user id"})
		}
	}

	err = db.Model(models.Users{}).Where("id = ?", currentUserID).Updates(UserPayload).Error

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
	query := db.Raw("SELECT username FROM users WHERE username != ? AND username LIKE ? LIMIT 20", username, payload.Username + "%").Scan(&user)
	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}
	return  context.Status(http.StatusOK).JSON(user)
}