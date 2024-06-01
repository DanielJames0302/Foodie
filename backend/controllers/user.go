package controllers

import (
	"net/http"
	"strconv"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"gorm.io/gorm"
)

func GetUser(context *fiber.Ctx, db *gorm.DB) error {
	token := context.Cookies("accessToken")
	t, err := jwt.ParseWithClaims(token, &jwt.StandardClaims{}, func (token *jwt.Token) (interface{}, error ) {
		return []byte("JWT_KEY"), nil
	})

	if err != nil {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "Token is not valid"})
	}

	if !(len(token) > 0) {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "Not logged in"})
	}
	
	claims := t.Claims.(*jwt.StandardClaims)

	currentUserID, err := strconv.Atoi(string(claims.Issuer))

	if (err != nil) {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Issuer error"})
	}
	userId := context.Params("userId")
	userModel := models.Users{}

	if (userId != "") {
		err = db.Where("id = ?", userId).First(&userModel).Error
	} else {
		err = db.Where("id = ?", currentUserID).First(&userModel).Error
	}

	

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "Cannot fetch user"})
	}

	return context.Status(http.StatusOK).JSON(userModel)
}


func UpdateUser(context *fiber.Ctx, db *gorm.DB) error {
	token := context.Cookies("accessToken")
	t, err := jwt.ParseWithClaims(token, &jwt.StandardClaims{}, func (token *jwt.Token) (interface{}, error ) {
		return []byte("JWT_KEY"), nil
	})

	if err != nil {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "Token is not valid"})
	}

	if !(len(token) > 0) {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "Not logged in"})
	}
	
	claims := t.Claims.(*jwt.StandardClaims)

	UserPayload := models.Users{}
	err = context.BodyParser(&UserPayload)
	
	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Could not get user payload"})
	}
	currentUserID, err := strconv.Atoi(string(claims.Issuer))

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Problem with issuer"})
	}


	err = db.Model(models.Users{}).Where("id = ?", currentUserID).Updates(UserPayload).Error

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Could not update user"})
	}
	return context.Status(http.StatusOK).JSON(fiber.Map{"message": "Update user successfully"})
}