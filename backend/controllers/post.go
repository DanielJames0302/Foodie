package controllers

import (
	"errors"
	"net/http"

	"strconv"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type PostResponse struct {
	models.Posts
	UserID       uint   `json:"user_id"`
	Username     string `json:"username"`
	Name         string `json:"name"`
	ProfilePic   string `json:"profile_pic"`
	Email        string `json:"email"`
	City         string `json:"city"`
	Website      string `json:"website"`
	User         models.Users `json:"User"`
}



func GetPost(context *fiber.Ctx, db *gorm.DB) error {
	userId := context.Query("userId")
	pageStr := context.Query("page", "1")
	limitStr := context.Query("limit", "10")

	// Parse pagination parameters
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 50 {
		limit = 10
	}

	offset := (page - 1) * limit

	results := []PostResponse{};
	fields := `posts.*,
						 users.id AS user_id,
						 users.username,
						 users.name,
						 users.profile_pic,
						 users.email,
						 users.city,
						 users.website`
	
	var totalCount int64
	var query *gorm.DB

	if userId != "" {
		// Count total posts for this user
		db.Model(&models.Posts{}).Where("posts.user_id = ?", userId).Count(&totalCount)
		
		query = db.Model(&models.Posts{}).Select(fields).
			Joins("INNER JOIN users ON posts.user_id = users.id").
			Where("posts.user_id = ?", userId).
			Order("posts.created_at desc").
			Offset(offset).
			Limit(limit)
	} else {
		uid := context.Locals("userId").(uint)
		subQuery := db.Model(&models.Relationships{}).Select("friend_profile_id").Where("my_profile_id = ?", uid)
		
		// Count total posts for user and friends
		db.Model(&models.Posts{}).
			Joins("JOIN users ON users.id = posts.user_id").
			Where("posts.user_id = ? OR posts.user_id IN (?)", uid, subQuery).
			Count(&totalCount)
		
		query = db.Model(&models.Posts{}).Select(fields).
			Joins("JOIN users ON users.id = posts.user_id").
			Where("posts.user_id = ? OR posts.user_id IN (?)", uid, subQuery).
			Order("posts.created_at desc").
			Offset(offset).
			Limit(limit)
	}

	err = query.Find(&results).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return context.Status(http.StatusOK).JSON(fiber.Map{
				"posts": results,
				"pagination": fiber.Map{
					"page": page,
					"limit": limit,
					"total": totalCount,
					"totalPages": (totalCount + int64(limit) - 1) / int64(limit),
					"hasNext": page < int((totalCount + int64(limit) - 1) / int64(limit)),
					"hasPrev": page > 1,
				},
			})
		}
		return context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "Unable to load posts"})
	}

	// Populate the User object for each result
	for i := range results {
		results[i].User = models.Users{
			Model:      gorm.Model{ID: results[i].UserID},
			Username:   results[i].Username,
			Name:       results[i].Name,
			ProfilePic: results[i].ProfilePic,
			Email:      results[i].Email,
			City:       results[i].City,
			Website:    results[i].Website,
		}
	}

	return context.Status(http.StatusOK).JSON(fiber.Map{
		"posts": results,
		"pagination": fiber.Map{
			"page": page,
			"limit": limit,
			"total": totalCount,
			"totalPages": (totalCount + int64(limit) - 1) / int64(limit),
			"hasNext": page < int((totalCount + int64(limit) - 1) / int64(limit)),
			"hasPrev": page > 1,
		},
	})
}

func GetPostById (context *fiber.Ctx, db *gorm.DB) error {
	postId := context.Params("postId");

	result := models.Posts{};

	err := db.Where("id = ?", postId).Preload("User").First(&result).Error;

	if err != nil {
		return context.Status(http.StatusInternalServerError).SendString("Unable to load post");
	}

	return context.Status(http.StatusOK).JSON(result);
}

func GetFoodPost(context *fiber.Ctx, db *gorm.DB) error {
	foodFilter := context.Query("filter");

	results := []models.Posts{}
	var err error

	// If no filter is provided, return all posts
	if foodFilter == "" {
		err = db.Model(&models.Posts{}).Find(&results).Error;
	} else {
		err = db.Model(&models.Posts{}).Where("category = ?", foodFilter).Find(&results).Error;
	}

	if err != nil {
		if (errors.Is(err, gorm.ErrRecordNotFound)) {
			return context.Status(http.StatusOK).JSON(results);
		}
		return context.Status(http.StatusInternalServerError).SendString("Unable to load food posts");
	}
	return context.Status(http.StatusOK).JSON(results);
}

func AddPost(context *fiber.Ctx, db *gorm.DB) error {
	userId := context.Locals("userId").(uint);
	postModel := models.Posts{}

	if err := context.BodyParser(&postModel); err != nil {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Request failed"})
	}
	postModel.UserID = userId
	result := db.Create(&postModel)
	if result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to add post"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"messge": "Post has been created succesfully"})
}

func DeletePost(context *fiber.Ctx, db *gorm.DB) error {
	userId := context.Locals("userId")
	currentUserId := userId

	postId, err := strconv.Atoi(string(context.Query("postId")))
	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Having issues with postID"})
	}
	
	result := db.Where("id = ? AND posts.user_id = ?", postId, currentUserId).Delete(&models.Posts{})

	if result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to delete post"})
	}

	return context.Status(http.StatusOK).JSON(fiber.Map{"message": "Post has been deleted successfully"})
}
