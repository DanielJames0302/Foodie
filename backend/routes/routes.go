package routes

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"github.com/DanielJames0302/Foodie/controllers"

)




func WithDB(fn func(context *fiber.Ctx, db *gorm.DB) error, db *gorm.DB) func(context *fiber.Ctx) error {
	return func(context *fiber.Ctx) error {
		return fn(context,db)
	}
}



func AuthRoutes (db *gorm.DB, app *fiber.App) {
	api := app.Group("/api")
	api.Post("/auth/register", WithDB(controllers.Register,db))
	api.Post("/auth/login", WithDB(controllers.Login,db))
	api.Get("/auth/logout", controllers.Logout)
}

func PostRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api")
	api.Get("/posts", WithDB(controllers.GetPost, db))
	api.Post("/posts", WithDB(controllers.AddPost, db))
	api.Delete("/posts", WithDB(controllers.DeletePost, db))
}

func UploadRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api")
	api.Post("/upload", controllers.Upload)
}


func CommentsRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api")
	api.Get("/comments",WithDB(controllers.GetComments,db))
	api.Post("/comments", WithDB(controllers.AddComment, db))
}

func LikesRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api")
	api.Get("/likes",WithDB(controllers.GetLikes,db))
	api.Post("/likes", WithDB(controllers.AddLike,db))
	api.Delete("/likes", WithDB(controllers.DeleteLike,db))
}

func UserRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api")
	api.Get("/users/find/:userId", WithDB(controllers.GetUser,db))
	api.Put("/users", WithDB(controllers.UpdateUser,db))
}

func RelationshipRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api")
	api.Post("/relationships", WithDB(controllers.AddRelationship,db))
	api.Get("/relationships", WithDB(controllers.GetRelationships,db))
	api.Delete("/relationships", WithDB(controllers.DeleteRelationship,db))
}

func FollowRequestRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api")
	api.Post("/send_follow_request/:receiverProfileId", WithDB(controllers.SendFollowRequest, db))
	api.Post("/accept_follow_request/:senderProfileId", WithDB(controllers.AcceptFollowRequest, db))
	api.Delete("/cancel_follow_request/:receiverProfileId", WithDB(controllers.CancelFollowRequest, db))
	api.Get("/follow_requests", WithDB(controllers.GetFollowRequests, db) )
	api.Get("/sended_follow_requests", WithDB(controllers.GetSendedFollowRequests, db))
}