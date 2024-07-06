package controllers

import (

	"net/http"
	"net/url"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"github.com/pusher/pusher-http-go/v5"
	"gorm.io/gorm"
)

type payload struct {
	SocketId string `json:"socket_id"`
	ChannelName string  `json:"channel_name"`
}
func PusherAuth(context *fiber.Ctx, db *gorm.DB, pusherClient *pusher.Client)  error {

	
	user := models.Users{};

	db.Where("id = ?", 2).Find(&user);


	userData := map[string]interface{} { "id": "1234", "twitter": "jamiepatel" }



	socketID := context.FormValue("socket_id")
	channelName := context.FormValue("channel_name")

	// Validate form values
	if socketID == "" || channelName == "" {
		return context.Status(fiber.StatusBadRequest).SendString("Missing socket_id or channel_name")
	}

	// Construct params
	params := url.Values{}
	params.Set("socket_id", socketID)
	params.Set("channel_name", channelName)



	response, err := pusherClient.AuthenticateUser([]byte(params.Encode()), userData)

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(err.Error())
	}

	return context.Status(http.StatusOK).JSON(response);
}