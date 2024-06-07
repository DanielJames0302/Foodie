package controllers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type RelationshipResponse struct {
	FollowerUserID int `json:"userID"`
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
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "Unable to fetch relationships"})
	}

	return context.Status(http.StatusOK).JSON(results)
}

func AddRelationship(context *fiber.Ctx, db *gorm.DB) error {
	relationshipModel := models.Relationships{}

	err := context.BodyParser(&relationshipModel)
	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Uanble to parse request body"})
	}

	userId := context.Locals("userId").(uint)

	relationshipModel.FollowerUserID = userId
	if err != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Problem with user id"})
	}

	result := db.Create(&relationshipModel)

	if result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to follow"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"messge": "Follow successfully"})
}

func DeleteRelationship(context *fiber.Ctx, db *gorm.DB) error {
	relationshipModel := models.Relationships{}

	followedUserId := context.Query("userId")
	u64_followedUserId, err := strconv.ParseUint(followedUserId, 10, 64)

	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problem with followed user id"})
	}
	relationshipModel.FollowedUserID = uint(u64_followedUserId)
	
	userInfoId := context.Locals("userId").(uint); 

	relationshipModel.FollowerUserID = userInfoId
	if err != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Problem with your user id"})
	}

	query := db.Exec("DELETE FROM relationships WHERE follower_user_id = ? AND followed_user_id = ?", relationshipModel.FollowerUserID, relationshipModel.FollowedUserID)
	

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Cannot unfollow"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"messge": "Unfollow successfully"})
}
