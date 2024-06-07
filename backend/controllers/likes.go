package controllers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type LikeResponse struct {
	UserID int `json:"userID"`
}

func GetLikes(context *fiber.Ctx, db *gorm.DB) error {

	var results []LikeResponse
	id := context.Query("postId")

	err := db.Model(&models.Likes{}).Select("likes.user_id").Where("likes.post_id = ?", id).Find(&results).Error

	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "Could not get the like"})

	}
	return context.Status(http.StatusOK).JSON(results)
}

func AddLike(context *fiber.Ctx, db *gorm.DB) error {
	likeModel := models.Likes{}

	userInfoId := context.Locals("userId").(uint)
	likeModel.UserID = userInfoId

	postId := context.Query("postId")
	u64_postId, err := strconv.ParseUint(postId, 10, 64)
	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Problem with post id"})
	}
	likeModel.PostID = uint(u64_postId)

	result := db.Create(&likeModel)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrDuplicatedKey) {
			return context.Status(http.StatusOK).JSON(fiber.Map{"message": "Post has been liked already"})
		}
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Cannot save like"})

	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"messge": "Post has been liked"})

}

func DeleteLike(context *fiber.Ctx, db *gorm.DB) error {
	likeModel := models.Comments{}

	paramUserId := context.Locals("userId").(uint)
	likeModel.UserID = paramUserId
	
	postId := context.Query("postId")
	u64_postId, err := strconv.ParseUint(postId, 10, 64)
	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Problem with post id"})
	}
	likeModel.PostID = uint(u64_postId)


	result := db.Where("likes.user_id = ? AND likes.post_id = ?", likeModel.UserID, likeModel.PostID).Delete(&models.Likes{})

	if result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Cannot delete like"})
	}
	return context.Status(http.StatusOK).JSON(&fiber.Map{"messge": "Like has been deleted from post"})
}
