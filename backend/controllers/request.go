package controllers

import (
	"errors"
	"fmt"
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
	
	query = db.Where("id = ?", receiverProfileId).Find(&models.Users{})

	if query.RowsAffected == 0 {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "User not found"})
	}

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}
	followRequest := models.FollowRequests{}
	followRequest.ReceiverProfileId = receiverProfileId
	followRequest.SenderProfileId = userId

	err = db.Create(&followRequest).Error

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Cannot save request"})
	}
	return context.Status(http.StatusOK).JSON(fiber.Map{"message": "Save request successfully"})

}

func AcceptFollowRequest(context *fiber.Ctx, db *gorm.DB) error {

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


	senderProfileId, err := strconv.Atoi(string(context.Params("senderProfileId")))

	if (err != nil) {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problem with sender profile id"})
	}

	query := db.Where("sender_profile_id = ? AND receiver_profile_id = ?", senderProfileId, userId).Find(&models.FollowRequests{})


	if query.RowsAffected == 0 {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Request not found"})
	}

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}


	query = db.Exec("DELETE FROM follow_requests as fr WHERE fr.sender_profile_id=? AND fr.receiver_profile_id=?", senderProfileId, userId)
	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}
	query = db.Exec("INSERT INTO relationships(followed_user_id, follower_user_id) VALUES (?,?)", userId, senderProfileId)
	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}
	return context.Status(http.StatusOK).JSON(fiber.Map{"message": fmt.Sprintf("You have accepted the follow request from %d", senderProfileId)})

}


func CancelFollowRequest(context *fiber.Ctx, db *gorm.DB) error {
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


	receiverProfileId, err := strconv.Atoi(string(context.Params("receiverProfileId")))

	if (err != nil) {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problem with sender receiver id"})
	}

	query := db.Exec("DELETE FROM follow_requests WHERE receiver_profile_id = ? AND sender_profile_id = ?", receiverProfileId, userId)

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}

	return context.Status(http.StatusOK).JSON(fiber.Map{"message": "Delete follow request successfully"})
}


func GetFollowRequests (context *fiber.Ctx, db *gorm.DB) error {
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

	results := []models.FollowRequests{}

	query := db.Raw("SELECT id, sender_profile_id FROM follow_requests WHERE receiver_profile_id = ?", userId).Scan(&results)

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}

	return context.Status(http.StatusOK).JSON(results)

}


func GetSendedFollowRequests (context *fiber.Ctx, db *gorm.DB) error {
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

	results := []models.FollowRequests{}

	query := db.Raw("SELECT id, receiver_profile_id FROM follow_requests WHERE sender_profile_id = ?", userId).Scan(&results)

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}

	return context.Status(http.StatusOK).JSON(results)
}