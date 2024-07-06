package middlewares

import (
	"net/http"
	"strings"

	"time"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/DanielJames0302/Foodie/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/golang-jwt/jwt"
	"gorm.io/gorm"
)



func IsAuthorized(context *fiber.Ctx, db *gorm.DB) error {

	sess := context.Locals("session").(*session.Session)

	accessToken := sess.Get("accessToken")

	token := context.Cookies("token")

	if !(len(token) > 0) {
		authHeader := context.Get("Authorization")
    if authHeader == "" {
        return context.Status(fiber.StatusUnauthorized).SendString("Missing token")
    }

    // Split the Authorization header to get the token part
    parts := strings.Split(authHeader, " ")
    if len(parts) != 2 || parts[0] != "Bearer" {
        return context.Status(fiber.StatusUnauthorized).SendString("Invalid token format")
    }
    token = parts[1]
	}

	if !(len(token) > 0) && accessToken != nil {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "Not logged in"})
	} 

	t, err := jwt.ParseWithClaims(token, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("JWT_KEY"), nil
	})

	if err != nil {
		return context.Status(http.StatusUnauthorized).JSON(&fiber.Map{"message": "User not authorized"})
	}
	claims := t.Claims.(*jwt.MapClaims)

	exp := int64((*claims)["exp"].(float64))

	if time.Now().Unix() > exp {
		userID := (*claims)["id"].(uint)
		accessToken, err := utils.CreateToken(userID, "2h")
		if err != nil {
				return context.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
						"error": "Failed to generate access token",
				})
		}
		refreshToken, err := utils.CreateToken(userID, "168h")
		if err != nil {
				return context.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
						"error": "Failed to generate refresh token",
				})
		}

		sess.Set("accessToken", accessToken)
		context.Cookie(&fiber.Cookie{
				Name:     "token",
				Value:    refreshToken,
				Expires:  time.Now().Add(7 * 24 * time.Hour),
				HTTPOnly: true,
				Secure:   false,
				Domain:   "localhost",
				SameSite: "Strict",
		})
		context.Locals("userId", userID)
		return context.Next()
	}
	userId := uint((*claims)["id"].(float64))
	context.Locals("userId", userId)
	return context.Next()

}

func UserById (context *fiber.Ctx, db *gorm.DB) error {
	sess := context.Locals("session").(*session.Session)
	param := context.Locals("userId")


	username := sess.Get("username")

	result := models.Users{}
	if username == nil {
		query := db.Raw("SELECT username FROM users WHERE id = ?", param).Scan(&result)
		if query.Error != nil {
			return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "internal server error"})
		}

		sess.Set("username", result.Username)
		if err := sess.Save(); err != nil {
			return context.Status(fiber.StatusInternalServerError).JSON(err)
		}

		context.Locals("username", result.Username)
		return context.Next()
	}
	context.Locals("username", username)
	return context.Next()
}