package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
)


func Upload (context *fiber.Ctx) error {
	file, err := context.FormFile("file")
	if err != nil {
			return context.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Cannot retrieve file"})
	}

	newFileName := fmt.Sprintf("%s_%s", time.Now().Format("20060102150405"), file.Filename)

	destination := fmt.Sprintf("../client/public/uploads/%s", newFileName)
	if err := context.SaveFile(file, destination); err != nil {
    return err
	}

	return context.Status(http.StatusOK).JSON(newFileName)

}