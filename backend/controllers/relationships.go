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

type RelationshipResponse struct {
	FollowerUserID 	int `json:"userID"`
}

type RelationshipPayload struct {
	UserID int `json:"userID"`
}

func GetRelationships(context *fiber.Ctx, db *gorm.DB) error {

	var results []RelationshipResponse
	id := context.Query("followedUserId")

	err := db.Model(&models.Relationships{}).Select("relationships.follower_user_id").Where("relationships.followed_user_id = ?", id).Find(&results).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return context.Status(http.StatusOK).JSON(results)
		}
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "Could not get relationships"})
	}

	return context.Status(http.StatusOK).JSON(results)
}


func AddRelationship(context *fiber.Ctx, db *gorm.DB) error {
	token := context.Cookies("accessToken")
	t, err := jwt.ParseWithClaims(token, &jwt.StandardClaims{}, func (token *jwt.Token) (interface{}, error ) {
		return []byte("JWT_KEY"), nil
	})

	if err != nil {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "token is not valid"})
	}

	if !(len(token) > 0) {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "Not logged in"})
	}
	
	claims := t.Claims.(*jwt.StandardClaims)

	relationshipModel := models.Relationships{}

	err = context.BodyParser(&relationshipModel)
	


	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Request failed"})
	}
	relationshipModel.FollowerUserID, err = strconv.Atoi(string(claims.Issuer))

	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problems with issuer"})
	}

	result := db.Create(&relationshipModel)

	if result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Cannot follow"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"messge": "Following"})

}


func DeleteRelationship(context *fiber.Ctx, db *gorm.DB) error {
	token := context.Cookies("accessToken")
	t, err := jwt.ParseWithClaims(token, &jwt.StandardClaims{}, func (token *jwt.Token) (interface{}, error ) {
		return []byte("JWT_KEY"), nil
	})

	if err != nil {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "token is not valid"})
	}

	if !(len(token) > 0) {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "Not logged in"})
	}
	
	claims := t.Claims.(*jwt.StandardClaims)

	relationshipModel := models.Relationships{}

	relationshipModel.FollowedUserID, err = strconv.Atoi(string(context.Query("userId")))

	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problems with followedUserId"})
	}
	relationshipModel.FollowerUserID, err = strconv.Atoi(string(claims.Issuer))

	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problems with issuer"})
	}

	result := db.Where("relationships.follower_user_id = ? AND relationships.followed_user_id = ?", relationshipModel.FollowerUserID, relationshipModel.FollowedUserID).Delete(&models.Relationships{})

	if result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Cannot unfollow"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"messge": "Unfollowing"})
}