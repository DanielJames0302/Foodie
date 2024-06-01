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

type PostInfo struct {
	UserID         string `json:"user_id"`
	UserProfilePic string `json:"user_profile_pic"`
	UserName       string `json:"user_username"`
	models.Posts   `gorm:"embedded"`
}

func GetPost(context *fiber.Ctx, db *gorm.DB) error {
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

	currentUserID, err := strconv.Atoi(string(claims.Issuer))

	if err != nil {
		context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "Problem with issuer"})
		return err
	}

	userId := context.Query("userId")

	var results []PostInfo
	fields := `users.id AS user_id,
						 users.profile_pic AS user_profile_pic,
						 users.name AS user_name,
						 posts.*`

	if userId != "" {
		err = db.Model(&models.Posts{}).Select(fields).
					Joins("INNER JOIN users ON posts.user_id = users.id").
					Where("posts.user_id = ?", userId).
					Order("posts.created_at desc"). 
					Find(&results).Error
	} else {
		err = db.Model(&models.Posts{}).Select(fields).
		Joins("JOIN users ON users.id = posts.user_id").
		Joins("LEFT JOIN relationships ON posts.user_id = relationships.followed_user_id").
		Where("posts.user_id = ?", currentUserID).Or("relationships.follower_user_id = ?", currentUserID).
		Order("posts.created_at desc").
		Find(&results).Error
	}


	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return context.Status(http.StatusOK).JSON(results)
		}
		return context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "internal server error"})
	}
	return context.JSON(results)
}

func AddPost(context *fiber.Ctx, db *gorm.DB) error {
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

	postModel := models.Posts{}

	err = context.BodyParser(&postModel)

	if err != nil {
		context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Request failed"})
	}
	postModel.UserID, err = strconv.Atoi(string(claims.Issuer))
	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problems with issuer"})
	}
	result := db.Create(&postModel)

	if result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Cannot save post"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"messge": "Post has been created succesfully"})
}

func DeletePost(context *fiber.Ctx, db *gorm.DB) error {
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
	currentUserId, err := strconv.Atoi(string(claims.Issuer))

	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "could not found issuer"})
	}
	postID, err := strconv.Atoi(string(context.Query("postId")))
	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "problems with postID"})
	}
	
	result := db.Where("id = ? AND posts.user_id = ?", postID, currentUserId).Delete(&models.Posts{})

	if result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "could not delete post"})
	}

	return context.Status(http.StatusOK).JSON(fiber.Map{"message": "post has been deleted"})
}
