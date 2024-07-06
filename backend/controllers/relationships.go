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

	var results []models.Users
	userId := context.Locals("userId").(uint);

	err := db.Model(&models.Relationships{}).Select("relationships.my_profile_id, users.name, users.profile_pic, users.id").Joins("LEFT JOIN users ON relationships.friend_profile_id = users.id").Where("relationships.my_profile_id = ?",  userId).Find(&results).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return context.Status(http.StatusOK).JSON(results)
		}
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "Unable to fetch relationships"})
	}

	return context.Status(http.StatusOK).JSON(results)
}

func DeleteRelationship(context *fiber.Ctx, db *gorm.DB) error {
	relationshipModel := models.Relationships{}

	followedUserId := context.Query("userId")
	u64_followedUserId, err := strconv.ParseUint(followedUserId, 10, 64);

	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Having issues with followed user id"});
	}
	relationshipModel.FriendProfileId = uint(u64_followedUserId);
	
	userInfoId := context.Locals("userId").(uint); 

	relationshipModel.MyProfileId= userInfoId;

	query := db.Exec("DELETE FROM relationships WHERE my_profile_id = ? AND friend_profile_id = ?", relationshipModel.MyProfileId, relationshipModel.FriendProfileId);
	

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to delete friend"})
	}

	query = db.Exec("DELETE FROM relationships WHERE my_profile_id = ? AND friend_profile_id = ?", relationshipModel.FriendProfileId, relationshipModel.MyProfileId);
	

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to delete friend"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"messge": "Unfollow successfully"})
}
