package controllers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"gorm.io/gorm"
)

func SendFollowRequest (context *fiber.Ctx, db *gorm.DB) error {
	
	token := context.Cookies("accessToken")
	t, err := jwt.ParseWithClaims(token, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("JWT_KEY"), nil
	})

	if err != nil {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "token is not valid"})
	}

	if !(len(token) > 0) {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "Not logged in"})
	}

	claims := t.Claims.(*jwt.StandardClaims)

	userId, err := strconv.Atoi(string(claims.Issuer))

	if (err != nil) {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Issuer not found"})
	}

	result := models.FollowRequests{}
	
	receiverProfileId, err := strconv.Atoi(string(context.Params("receiverProfileId")))

	if (err != nil ) {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problem with receiverProfileId"})
	}

	query := db.Model(&models.FollowRequests{}).Select("follow_requests.*").Where("sender_profile_id = ? AND receiver_profile_id = ?", userId, receiverProfileId).First(&result)

	if query.RowsAffected > 0 {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Request already sent"})
	}
	if !errors.Is(query.Error, gorm.ErrRecordNotFound) {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Problem with api endpoint"})
	} 
	
	query = db.Model(&models.Users{}).Where("id = ?", receiverProfileId)

	if query.RowsAffected == 0 {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "User not found"})
	}

	if !errors.Is(query.Error, gorm.ErrRecordNotFound) {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}
	followRequest := models.FollowRequests{}
	followRequest.ReceiverProfileId = receiverProfileId
	followRequest.SenderProfileId = userId

	db.Create(&followRequest)




}