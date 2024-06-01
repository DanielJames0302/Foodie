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

	likeModel := models.Likes{}

	likeModel.UserID, err = strconv.Atoi(string(claims.Issuer))

	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problems with issuer"})
	}
	postID := context.Query("postId")
	likeModel.PostID, err = strconv.Atoi(string(postID))

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Problems with postID"})
	}

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

	likeModel := models.Comments{}

	likeModel.UserID, err = strconv.Atoi(string(claims.Issuer))

	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problems with issuer"})
	}

	postID := context.Query("postId")
	likeModel.PostID, err = strconv.Atoi(string(postID))

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Problems with postID"})
	}

	result := db.Where("likes.user_id = ? AND likes.post_id = ?", likeModel.UserID, likeModel.PostID).Delete(&models.Likes{})

	if result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Cannot delete like"})
	}
	return context.Status(http.StatusOK).JSON(&fiber.Map{"messge": "Like has been deleted from post"})
}
