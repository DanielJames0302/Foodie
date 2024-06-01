package controllers

import (

	"net/http"

	"time"
	"strconv"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
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
	loginUser := models.Users{}
	userModel := &models.Users{}

	err := context.BodyParser(&loginUser)

	if (err !=  nil) {
		context.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{"message": "Request failed"})
		return err
	}

	err = db.Where("username = ?", loginUser.Username).First(userModel).Error
	if (err != nil) {
		return context.Status(http.StatusNotFound).JSON(&fiber.Map{"message": "User not found"})
	}

	checkPassword := bcrypt.CompareHashAndPassword([]byte(userModel.Password),[]byte(loginUser.Password))

	if checkPassword != nil {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "Wrong password"})
	}

	expirationTime :=  time.Now().Add(time.Hour * 24)
	userModel.Password =" "
	claims := jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
			Issuer: strconv.Itoa(int(userModel.ID)),
	}
	
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	var jwtKey = []byte("JWT_KEY")
	tokenValue, err := token.SignedString(jwtKey)
	
	if err != nil {
		return err
	}

	context.Cookie(&fiber.Cookie{
		Name:     "accessToken",
		Value:    tokenValue,
		Expires:  expirationTime,
		Domain:   "localhost",
		HTTPOnly: true,
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
	context.ClearCookie()
	return context.Status(http.StatusOK).JSON(&fiber.Map{"message": "User has been logged out"})
}