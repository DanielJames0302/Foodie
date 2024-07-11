package routes

import (
	"github.com/DanielJames0302/Foodie/controllers"
	"github.com/DanielJames0302/Foodie/middlewares"
	"github.com/gofiber/fiber/v2"
	"github.com/pusher/pusher-http-go/v5"
	"gorm.io/gorm"
)




func WithDB(fn func(context *fiber.Ctx, db *gorm.DB) error, db *gorm.DB) func(context *fiber.Ctx) error {
	return func(context *fiber.Ctx) error {
		return fn(context,db)
	}
}

func WithDBAndPusher(fn func(context *fiber.Ctx, db *gorm.DB, pusherClient *pusher.Client) error, db *gorm.DB, pusherClient *pusher.Client) func(context *fiber.Ctx) error {
	return func(context *fiber.Ctx) error {
		return fn(context, db, pusherClient)
	}
}
func PusherRoutes(db *gorm.DB, app *fiber.App, pusherClient *pusher.Client) {
	app.Post("/api/pusher/auth",WithDBAndPusher(controllers.PusherAuth,db, pusherClient));
}

func AuthRoutes (db *gorm.DB, app *fiber.App) {
	api := app.Group("/api")
	api.Post("/auth/register", WithDB(controllers.Register,db))
	api.Post("/auth/login", WithDB(controllers.Login,db))
	api.Post("/auth/logout",WithDB(middlewares.IsAuthorized,db), controllers.Logout)
	api.Get("/auth/verify_user/:userId",WithDB(middlewares.IsAuthorized,db), controllers.VerifyUser)
}

func PostRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api", WithDB(middlewares.IsAuthorized, db))
	api.Get("/posts",  WithDB(controllers.GetPost, db))
	api.Get("/posts/food",WithDB(controllers.GetFoodPost,db))
	api.Get("/post/:postId",WithDB(controllers.GetPostById,db))
	api.Post("/posts", WithDB(controllers.AddPost, db))
	api.Delete("/posts", WithDB(controllers.DeletePost, db))
}

func UploadRoutes(db *gorm.DB,  app *fiber.App) {
	api := app.Group("/api", WithDB(middlewares.IsAuthorized, db))
	api.Post("/upload", controllers.Upload)
}


func CommentsRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api", WithDB(middlewares.IsAuthorized, db))
	api.Get("/comments",WithDB(controllers.GetComments,db))
	api.Post("/comments", WithDB(controllers.AddComment, db))
}

func LikesRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api", WithDB(middlewares.IsAuthorized, db))
	api.Get("/likes",WithDB(controllers.GetLikes,db))
	api.Post("/likes", WithDB(controllers.AddLike,db))
	api.Delete("/likes", WithDB(controllers.DeleteLike,db))
}

func UserRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api", WithDB(middlewares.IsAuthorized, db), WithDB(middlewares.UserById,db))
	api.Get("/users/find/:userId", WithDB(controllers.GetUser,db))
	api.Put("/users", WithDB(controllers.UpdateUser,db))
	api.Post("/users/search_profile", WithDB(controllers.SearchUser, db))
}

func RelationshipRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api", WithDB(middlewares.IsAuthorized, db))
	api.Get("/relationships", WithDB(controllers.GetRelationships,db))
	api.Delete("/relationships", WithDB(controllers.DeleteRelationship,db))
}

func FriendRequestRoutes(db *gorm.DB, app *fiber.App) {
	api := app.Group("/api", WithDB(middlewares.IsAuthorized, db))
	api.Post("/send_friend_request/:receiverProfileId", WithDB(controllers.SendFriendRequest, db))
	api.Post("/accept_friend_request/:senderProfileId", WithDB(controllers.AcceptFriendRequest, db))
	api.Delete("/decline_friend_request/:senderProfileId", WithDB(controllers.DeclineFriendRequest, db))
	api.Delete("/cancel_friend_request/:receiverProfileId", WithDB(controllers.CancelFriendRequest, db))
	api.Get("/friend_requests", WithDB(controllers.GetFriendRequests, db) )
	api.Get("/sended_friend_requests", WithDB(controllers.GetSendedFriendRequests, db))
}


func ConversationRoutes(db *gorm.DB, app *fiber.App, pusherClient *pusher.Client) {
	api := app.Group("/api", WithDB(middlewares.IsAuthorized, db));
	api.Get("/conversations", WithDB(controllers.GetConversations, db));
	api.Post("/conversations", WithDBAndPusher(controllers.CreateConversation, db, pusherClient));
	api.Post("/conversations/:id/seen", WithDBAndPusher(controllers.ConversationSeen,db, pusherClient));
	api.Get("/conversations/:id", WithDB(controllers.GetConversationById,db));
	api.Delete("/conversations/:id", WithDBAndPusher(controllers.DeleteConversation,db,pusherClient));
 
}

func MessageRoutes(db *gorm.DB, app *fiber.App, pusherClient *pusher.Client) {
	api := app.Group("/api", WithDB(middlewares.IsAuthorized, db));
	api.Get("/messages/:conversationId",WithDB(controllers.GetMessages,db));
	api.Post("/messages", WithDBAndPusher(controllers.CreateMessage,db, pusherClient));
}

func NotificationRoutes(db *gorm.DB, app *fiber.App) {
	api:= app.Group("/api", WithDB(middlewares.IsAuthorized,db));
	api.Post("/notifications/seen", WithDB(controllers.NotificationSeen,db));
	api.Get("/notifications", WithDB(controllers.GetNotifications,db));
	api.Get("/notifications/seen", WithDB(controllers.GetUnSeenNotifications,db));
}


