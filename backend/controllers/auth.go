package controllers

import (
	"net/http"
	"time"
	"github.com/DanielJames0302/Foodie/models"
	"github.com/DanielJames0302/Foodie/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)
type Claims struct {
	User models.Users
	jwt.StandardClaims
}

type PublicUser struct {

}

func Login(context *fiber.Ctx, db *gorm.DB) error {
	sess := context.Locals("session").(*session.Session)
	loginUser := models.Users{}
	userModel := &models.Users{}

	err := context.BodyParser(&loginUser)

	if (err !=  nil) {
		context.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{"message": "Request failed"})
		return err
	}

	err = db.Where("username = ?", loginUser.Username).First(userModel).Error
	if (err != nil) {
		return context.Status(http.StatusNotFound).JSON("User not found")
	}

	checkPassword := bcrypt.CompareHashAndPassword([]byte(userModel.Password),[]byte(loginUser.Password))

	if checkPassword != nil {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "Wrong password"})
	}

	accessToken, err := utils.CreateToken(userModel.ID,"2h")
	if err != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate access token",
		})
	}
	refreshToken, err := utils.CreateToken(userModel.ID,"168h")
	if err != nil {
		
		context.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate refresh token",
		})
		return err
	
	}


	sess.Set("accessToken", accessToken)
	sess.Set("username", userModel.Username)
	if err := sess.Save(); err != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(err)
	}
	context.Cookie(&fiber.Cookie{
			Name:     "token",
			Value:    refreshToken,
			Expires:  time.Now().Add(7 * 24 * time.Hour),
			HTTPOnly: true,
			Secure:   false,
			Domain:   "localhost",
			SameSite: "Strict",
	})
	

	return context.JSON(userModel)
}

func Register(context *fiber.Ctx, db *gorm.DB) error {
	user := models.Users{}
	userModel := &[]models.Users{}

	err := context.BodyParser(&user)
	if (err != nil) {
		context.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{"message": "Request failed"})
		return err
	}


	err = db.Where("username = ?", user.Username).First(userModel).Error

	if (err != nil) {
		bytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
		if err != nil {
			return err
		}
		user.Password = string(bytes)
		err = db.Select("username","password","email","name").Create(&user).Error
		if err != nil {
			return context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message" : "Cannot create user"})	
		}
	} else {
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "User has already existed"})
		
	}
	return context.Status(http.StatusOK).JSON(&fiber.Map{"message": "User is created successfully"})
}

func Logout(context *fiber.Ctx) error {
	sess := context.Locals("session").(*session.Session)
	if err := sess.Destroy(); err != nil {
		panic(err)
	}
	context.ClearCookie()
	return context.Status(http.StatusOK).JSON(&fiber.Map{"message": "User has been logged out"})
}


func VerifyUser(context *fiber.Ctx) error {
	return context.Status(http.StatusOK).JSON(&fiber.Map{"message": "User has been verified"})
}