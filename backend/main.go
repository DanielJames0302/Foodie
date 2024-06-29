package main

import (
	"log"
	"os"
	"github.com/DanielJames0302/Foodie/models"
	"github.com/DanielJames0302/Foodie/routes"
	"github.com/DanielJames0302/Foodie/storage"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)
var store = session.New()
type Repository struct {
	DB *gorm.DB
}



func (r *Repository) SetupRoutes(app *fiber.App) {

	routes.AuthRoutes(r.DB, app)
	routes.PostRoutes(r.DB, app)
	routes.UploadRoutes(r.DB, app)
	routes.CommentsRoutes(r.DB, app)
	routes.LikesRoutes(r.DB,app)
	routes.UserRoutes(r.DB, app)
	routes.RelationshipRoutes(r.DB, app)
	routes.FollowRequestRoutes(r.DB, app)
	routes.ConversationRoutes(r.DB,app)
	routes.MessageRoutes(r.DB,app)
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}
	config := &storage.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Password: os.Getenv("DB_PASS"),
		User:     os.Getenv("DB_USER"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
		DBName:   os.Getenv("DB_NAME"),
	}

	db, err := storage.NewConnection(config)

	if err != nil {
		log.Fatal("could not load the database")
	}
	err = models.MigrateBooks(db)
	if err != nil {
		log.Fatal("could not migrate db")
	}
	

	r := Repository{
		DB: db,
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowCredentials: true,
	}))
	app.Use(func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
				return err
		}
		c.Locals("session", sess)
		return c.Next()
	})
	r.SetupRoutes(app)
	app.Static("/images","../client/public/uploads")
	app.Listen(":8080")
}