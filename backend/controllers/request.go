package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SendFriendRequest (context *fiber.Ctx, db *gorm.DB) error {
	userInfoId := context.Locals("userId").(uint)

	result := models.FriendRequests{}
	
	receiverProfileId := context.Params("receiverProfileId")
	u64_receiverProfileId, err := strconv.ParseUint(receiverProfileId, 10, 64)

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Problem with receiver profile id"})
	}
	uint_receiverProfileId := uint(u64_receiverProfileId)

	query := db.Model(&models.FriendRequests{}).Where("sender_profile_id = ? AND receiver_profile_id = ?", userInfoId, uint_receiverProfileId).First(&result)

	if query.RowsAffected > 0 {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Request already sent"})
	}
	if !errors.Is(query.Error, gorm.ErrRecordNotFound) {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Having issues with request"})
	} 
	
	receiverUser := models.Users{};
	query = db.Where("id = ?", receiverProfileId).Find(&receiverUser);

	if query.RowsAffected == 0 {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "User not found"})
	}

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}
	followRequest := models.FriendRequests{}
	followRequest.ReceiverProfileId = uint_receiverProfileId
	followRequest.SenderProfileId = userInfoId

	err = db.Create(&followRequest).Error

	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Cannot save request"})
	}

	query_statement := `INSERT INTO notifications (notification_type, notification, profile_id, sender_profile_id)
		VALUES (?, ?, ?, ?)
	`;

	query_result := db.Exec(query_statement, "friend_request", fmt.Sprintf("%s has sent you a friend request",receiverUser.Username), followRequest.ReceiverProfileId, followRequest.SenderProfileId);

	if query_result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to create send friend request notifcation"});
	}
	return context.Status(http.StatusOK).JSON(fiber.Map{"message": "Save request successfully"})

}

func AcceptFriendRequest(context *fiber.Ctx, db *gorm.DB) error {
	userId := context.Locals("userId").(uint)

	senderProfileId, err := strconv.Atoi(string(context.Params("senderProfileId")))

	if (err != nil) {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problem with sender profile id"})
	}

	user := models.Users{};

	err = db.First(&user, senderProfileId).Error;
	
	if err != nil {
		return context.Status(http.StatusInternalServerError).SendString("Cannot find sender profile");
	}

	query := db.Where("sender_profile_id = ? AND receiver_profile_id = ?", senderProfileId, userId).Find(&models.FriendRequests{})


	if query.RowsAffected == 0 {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Request not found"})
	}

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}

	query = db.Exec("DELETE FROM friend_requests as fr WHERE fr.sender_profile_id=? AND fr.receiver_profile_id=?", senderProfileId, userId)
	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}
	query = db.Exec("INSERT INTO relationships(my_profile_id, friend_profile_id) VALUES (?,?)", userId, senderProfileId)
	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}

	query = db.Exec("INSERT INTO relationships(my_profile_id, friend_profile_id) VALUES (?,?)", senderProfileId, userId)
	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}
	query_statement := `INSERT INTO notifications (notification_type, notification, profile_id, sender_profile_id)
		VALUES (?, ?, ?, ?)
	`;

	query_result := db.Exec(query_statement, "accept_request",fmt.Sprintf("%s has accepted your friend request",user.Username), senderProfileId, userId);

	if query_result.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to create accept friend request notifcation"});
	}


	return context.Status(http.StatusOK).JSON(fiber.Map{"message": fmt.Sprintf("You have accepted the follow request from %d", senderProfileId)})

}

func DeclineFriendRequest(context *fiber.Ctx, db*gorm.DB) error {
	userId := context.Locals("userId").(uint)
	senderProfileId, err := strconv.Atoi(string(context.Params("senderProfileId")))

	if (err != nil) {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problem with sender profile id"})
	}

	query := db.Exec("DELETE FROM friend_requests WHERE receiver_profile_id = ? AND sender_profile_id = ?", userId, senderProfileId)

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to delete message"})
	}

	return context.Status(http.StatusOK).JSON(fiber.Map{"message": "Decline follow request succesfully"})

}

func CancelFriendRequest(context *fiber.Ctx, db *gorm.DB) error {
	userId := context.Locals("userId").(uint)
	receiverProfileId, err := strconv.Atoi(string(context.Params("receiverProfileId")))

	if (err != nil) {
		return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Problem with sender receiver id"})
	}

	query := db.Exec("DELETE FROM friend_requests WHERE receiver_profile_id = ? AND sender_profile_id = ?", receiverProfileId, userId)

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}

	return context.Status(http.StatusOK).JSON(fiber.Map{"message": "Delete follow request successfully"})
}


func GetFriendRequests (context *fiber.Ctx, db *gorm.DB) error {
	userInfoId := context.Locals("userId").(uint)

	results := []models.Users{}

	query_statement := `SELECT u.id, u.username, u.name, u.profile_pic FROM friend_requests as fr INNER JOIN users as u ON (fr.sender_profile_id=u.id) WHERE receiver_profile_id = ?`

	query := db.Raw(query_statement, userInfoId).Scan(&results)

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON("Internal Server Error")
	}

	return context.Status(http.StatusOK).JSON(results)

}


func GetSendedFriendRequests (context *fiber.Ctx, db *gorm.DB) error {
	userInfoId := context.Locals("userId").(uint)

	results := []models.FriendRequests{}

	query := db.Raw("SELECT id, receiver_profile_id FROM friend_requests WHERE sender_profile_id = ?", userInfoId).Scan(&results)

	if query.Error != nil {
		return context.Status(http.StatusInternalServerError).JSON(query.Error)
	}

	return context.Status(http.StatusOK).JSON(results)
}