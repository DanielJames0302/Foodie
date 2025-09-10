package main

import (
	"log"
	"os"
	"time"

	"github.com/DanielJames0302/Foodie/models"
	"github.com/DanielJames0302/Foodie/storage"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	// Load environment variables
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Database configuration
	config := &storage.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Password: os.Getenv("DB_PASS"),
		User:     os.Getenv("DB_USER"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
		DBName:   os.Getenv("DB_NAME"),
	}

	// Connect to database
	db, err := storage.NewConnection(config)
	if err != nil {
		log.Fatal("Could not connect to database")
	}

	// Run migrations
	err = models.MigrateBooks(db)
	if err != nil {
		log.Fatal("Could not migrate database")
	}

	// Seed the database
	seedDatabase(db)
	log.Println("Database seeded successfully!")
}

func seedDatabase(db *gorm.DB) {
	// Clear existing data
	clearDatabase(db)

	// Create sample users
	users := createSampleUsers(db)
	
	// Create sample posts
	posts := createSamplePosts(db, users)
	
	// Create sample relationships
	createSampleRelationships(db, users)
	
	// Create sample friend requests
	createSampleFriendRequests(db, users)
	
	// Create sample likes
	createSampleLikes(db, users, posts)
	
	// Create sample comments
	createSampleComments(db, users, posts)
	
	// Create sample conversations and messages
	createSampleConversations(db, users)
	
	// Create sample notifications
	createSampleNotifications(db, users, posts)
}

func clearDatabase(db *gorm.DB) {
	log.Println("Clearing existing data...")
	
	// Delete in reverse order of dependencies
	db.Exec("DELETE FROM notifications")
	db.Exec("DELETE FROM message_user")
	db.Exec("DELETE FROM messages")
	db.Exec("DELETE FROM conversation_user")
	db.Exec("DELETE FROM conversations")
	db.Exec("DELETE FROM comments")
	db.Exec("DELETE FROM likes")
	db.Exec("DELETE FROM friend_requests")
	db.Exec("DELETE FROM relationships")
	db.Exec("DELETE FROM posts")
	db.Exec("DELETE FROM users")
}

func createSampleUsers(db *gorm.DB) []models.Users {
	log.Println("Creating sample users...")
	
	users := []models.Users{
		{
			Username:   "chef_mario",
			Password:   hashPassword("password123"),
			Email:      "mario@foodie.com",
			Name:       "Mario Rossi",
			CoverPic:   "default-cover.png",
			ProfilePic: "default-user.jpg",
			City:       "Rome, Italy",
			Website:    "https://chefmario.com",
		},
		{
			Username:   "sarah_baker",
			Password:   hashPassword("password123"),
			Email:      "sarah@foodie.com",
			Name:       "Sarah Johnson",
			CoverPic:   "default-cover.png",
			ProfilePic: "default-user.jpg",
			City:       "New York, USA",
			Website:    "https://sarahbakes.com",
		},
		{
			Username:   "asian_fusion",
			Password:   hashPassword("password123"),
			Email:      "li@foodie.com",
			Name:       "Li Wei",
			CoverPic:   "default-cover.png",
			ProfilePic: "default-user.jpg",
			City:       "Tokyo, Japan",
			Website:    "https://asianfusion.com",
		},
		{
			Username:   "vegan_chef",
			Password:   hashPassword("password123"),
			Email:      "emma@foodie.com",
			Name:       "Emma Green",
			CoverPic:   "default-cover.png",
			ProfilePic: "default-user.jpg",
			City:       "London, UK",
			Website:    "https://veganchef.com",
		},
		{
			Username:   "bbq_master",
			Password:   hashPassword("password123"),
			Email:      "jake@foodie.com",
			Name:       "Jake Thompson",
			CoverPic:   "default-cover.png",
			ProfilePic: "default-user.jpg",
			City:       "Austin, Texas",
			Website:    "https://bbqmaster.com",
		},
		{
			Username:   "dessert_queen",
			Password:   hashPassword("password123"),
			Email:      "sophie@foodie.com",
			Name:       "Sophie Martinez",
			CoverPic:   "default-cover.png",
			ProfilePic: "default-user.jpg",
			City:       "Paris, France",
			Website:    "https://dessertqueen.com",
		},
		{
			Username:   "spice_lover",
			Password:   hashPassword("password123"),
			Email:      "raj@foodie.com",
			Name:       "Raj Patel",
			CoverPic:   "default-cover.png",
			ProfilePic: "default-user.jpg",
			City:       "Mumbai, India",
			Website:    "https://spicelover.com",
		},
		{
			Username:   "healthy_eats",
			Password:   hashPassword("password123"),
			Email:      "alex@foodie.com",
			Name:       "Alex Chen",
			CoverPic:   "default-cover.png",
			ProfilePic: "default-user.jpg",
			City:       "Sydney, Australia",
			Website:    "https://healthyeats.com",
		},
	}

	for i := range users {
		if err := db.Create(&users[i]).Error; err != nil {
			log.Printf("Error creating user %s: %v", users[i].Username, err)
		}
	}

	return users
}

func createSamplePosts(db *gorm.DB, users []models.Users) []models.Posts {
	log.Println("Creating sample posts...")
	
	posts := []models.Posts{
		{
			Title:    "Authentic Italian Carbonara",
			Desc:     "Classic Roman pasta dish with eggs, cheese, pancetta, and black pepper. The secret is in the technique!",
			ImgUrl:   "foodie/carbonara",
			Category: "Italian",
			Calories: 520.0,
			UserID:   users[0].ID,
			Type:     "recipe",
		},
		{
			Title:    "Chocolate Chip Cookies",
			Desc:     "Soft and chewy chocolate chip cookies that melt in your mouth. Perfect for any occasion!",
			ImgUrl:   "foodie/cookies",
			Category: "Dessert",
			Calories: 180.0,
			UserID:   users[1].ID,
			Type:     "recipe",
		},
		{
			Title:    "Ramen Bowl Deluxe",
			Desc:     "Rich tonkotsu broth with perfectly cooked noodles, soft-boiled egg, and fresh vegetables.",
			ImgUrl:   "foodie/ramen",
			Category: "Japanese",
			Calories: 650.0,
			UserID:   users[2].ID,
			Type:     "recipe",
		},
		{
			Title:    "Quinoa Buddha Bowl",
			Desc:     "Nutritious and colorful bowl with quinoa, roasted vegetables, avocado, and tahini dressing.",
			ImgUrl:   "foodie/buddha-bowl",
			Category: "Healthy",
			Calories: 420.0,
			UserID:   users[3].ID,
			Type:     "recipe",
		},
		{
			Title:    "Smoked Brisket",
			Desc:     "12-hour smoked brisket with perfect bark and tender, juicy meat. Texas-style BBQ at its finest!",
			ImgUrl:   "foodie/brisket",
			Category: "BBQ",
			Calories: 380.0,
			UserID:   users[4].ID,
			Type:     "recipe",
		},
		{
			Title:    "Tiramisu Layer Cake",
			Desc:     "Elegant coffee-flavored dessert with mascarpone cream and ladyfinger biscuits.",
			ImgUrl:   "foodie/tiramisu",
			Category: "Dessert",
			Calories: 320.0,
			UserID:   users[5].ID,
			Type:     "recipe",
		},
		{
			Title:    "Butter Chicken Curry",
			Desc:     "Rich and creamy Indian curry with tender chicken in a tomato-based sauce with aromatic spices.",
			ImgUrl:   "foodie/butter-chicken",
			Category: "Indian",
			Calories: 480.0,
			UserID:   users[6].ID,
			Type:     "recipe",
		},
		{
			Title:    "Green Smoothie Bowl",
			Desc:     "Refreshing smoothie bowl with spinach, banana, mango, and topped with granola and berries.",
			ImgUrl:   "foodie/smoothie-bowl",
			Category: "Healthy",
			Calories: 250.0,
			UserID:   users[7].ID,
			Type:     "recipe",
		},
		{
			Title:    "Margherita Pizza",
			Desc:     "Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil.",
			ImgUrl:   "foodie/pizza",
			Category: "Italian",
			Calories: 320.0,
			UserID:   users[0].ID,
			Type:     "recipe",
		},
		{
			Title:    "Sushi Roll Masterpiece",
			Desc:     "Beautiful dragon roll with eel, avocado, and cucumber, topped with spicy mayo and eel sauce.",
			ImgUrl:   "foodie/sushi",
			Category: "Japanese",
			Calories: 280.0,
			UserID:   users[2].ID,
			Type:     "recipe",
		},
	}

	for i := range posts {
		if err := db.Create(&posts[i]).Error; err != nil {
			log.Printf("Error creating post %s: %v", posts[i].Title, err)
		}
	}

	return posts
}

func createSampleRelationships(db *gorm.DB, users []models.Users) {
	log.Println("Creating sample relationships...")
	
	relationships := []models.Relationships{
		{MyProfileId: users[0].ID, FriendProfileId: users[1].ID},
		{MyProfileId: users[1].ID, FriendProfileId: users[0].ID},
		{MyProfileId: users[0].ID, FriendProfileId: users[2].ID},
		{MyProfileId: users[2].ID, FriendProfileId: users[0].ID},
		{MyProfileId: users[1].ID, FriendProfileId: users[3].ID},
		{MyProfileId: users[3].ID, FriendProfileId: users[1].ID},
		{MyProfileId: users[2].ID, FriendProfileId: users[4].ID},
		{MyProfileId: users[4].ID, FriendProfileId: users[2].ID},
		{MyProfileId: users[3].ID, FriendProfileId: users[5].ID},
		{MyProfileId: users[5].ID, FriendProfileId: users[3].ID},
	}

	for _, rel := range relationships {
		if err := db.Create(&rel).Error; err != nil {
			log.Printf("Error creating relationship: %v", err)
		}
	}
}

func createSampleFriendRequests(db *gorm.DB, users []models.Users) {
	log.Println("Creating sample friend requests...")
	
	requests := []models.FriendRequests{
		{SenderProfileId: users[4].ID, ReceiverProfileId: users[0].ID},
		{SenderProfileId: users[5].ID, ReceiverProfileId: users[1].ID},
		{SenderProfileId: users[6].ID, ReceiverProfileId: users[2].ID},
		{SenderProfileId: users[7].ID, ReceiverProfileId: users[3].ID},
	}

	for _, req := range requests {
		if err := db.Create(&req).Error; err != nil {
			log.Printf("Error creating friend request: %v", err)
		}
	}
}

func createSampleLikes(db *gorm.DB, users []models.Users, posts []models.Posts) {
	log.Println("Creating sample likes...")
	
	likes := []models.Likes{
		{UserID: users[1].ID, PostID: posts[0].ID},
		{UserID: users[2].ID, PostID: posts[0].ID},
		{UserID: users[3].ID, PostID: posts[0].ID},
		{UserID: users[0].ID, PostID: posts[1].ID},
		{UserID: users[2].ID, PostID: posts[1].ID},
		{UserID: users[4].ID, PostID: posts[1].ID},
		{UserID: users[0].ID, PostID: posts[2].ID},
		{UserID: users[1].ID, PostID: posts[2].ID},
		{UserID: users[3].ID, PostID: posts[2].ID},
		{UserID: users[5].ID, PostID: posts[2].ID},
		{UserID: users[1].ID, PostID: posts[3].ID},
		{UserID: users[2].ID, PostID: posts[3].ID},
		{UserID: users[6].ID, PostID: posts[3].ID},
		{UserID: users[0].ID, PostID: posts[4].ID},
		{UserID: users[2].ID, PostID: posts[4].ID},
		{UserID: users[5].ID, PostID: posts[4].ID},
		{UserID: users[7].ID, PostID: posts[4].ID},
	}

	for _, like := range likes {
		if err := db.Create(&like).Error; err != nil {
			log.Printf("Error creating like: %v", err)
		}
	}
}

func createSampleComments(db *gorm.DB, users []models.Users, posts []models.Posts) {
	log.Println("Creating sample comments...")
	
	comments := []models.Comments{
		{Desc: "This looks absolutely delicious! Can't wait to try it.", UserID: users[1].ID, PostID: posts[0].ID},
		{Desc: "I've been looking for a good carbonara recipe. This one looks perfect!", UserID: users[2].ID, PostID: posts[0].ID},
		{Desc: "Amazing cookies! My kids loved them.", UserID: users[0].ID, PostID: posts[1].ID},
		{Desc: "The secret ingredient is love! 😊", UserID: users[3].ID, PostID: posts[1].ID},
		{Desc: "This ramen looks incredible! Where did you get the noodles?", UserID: users[4].ID, PostID: posts[2].ID},
		{Desc: "Perfect for a cold day! Thanks for sharing.", UserID: users[5].ID, PostID: posts[2].ID},
		{Desc: "So healthy and colorful! Love the presentation.", UserID: users[6].ID, PostID: posts[3].ID},
		{Desc: "This is exactly what I needed for my meal prep!", UserID: users[7].ID, PostID: posts[3].ID},
		{Desc: "That bark looks perfect! What temperature did you smoke at?", UserID: users[0].ID, PostID: posts[4].ID},
		{Desc: "Texas BBQ is the best! This looks amazing.", UserID: users[1].ID, PostID: posts[4].ID},
		{Desc: "This tiramisu is a work of art! Beautiful presentation.", UserID: users[2].ID, PostID: posts[5].ID},
		{Desc: "I need this recipe! It looks so elegant.", UserID: users[3].ID, PostID: posts[5].ID},
		{Desc: "The spices in this curry must be incredible!", UserID: users[4].ID, PostID: posts[6].ID},
		{Desc: "Butter chicken is my favorite! This looks authentic.", UserID: users[5].ID, PostID: posts[6].ID},
		{Desc: "Perfect for breakfast! So refreshing and healthy.", UserID: users[6].ID, PostID: posts[7].ID},
		{Desc: "Love the green color! What's in the smoothie?", UserID: users[7].ID, PostID: posts[7].ID},
	}

	for _, comment := range comments {
		if err := db.Create(&comment).Error; err != nil {
			log.Printf("Error creating comment: %v", err)
		}
	}
}

func createSampleConversations(db *gorm.DB, users []models.Users) {
	log.Println("Creating sample conversations...")
	
	// Create conversations
	conversations := []models.Conversation{
		{
			Name:          "Mario & Sarah",
			IsGroup:       false,
			LastMessageAt: time.Now().Add(-2 * time.Hour),
		},
		{
			Name:          "Foodie Group Chat",
			IsGroup:       true,
			LastMessageAt: time.Now().Add(-30 * time.Minute),
		},
		{
			Name:          "Li & Jake",
			IsGroup:       false,
			LastMessageAt: time.Now().Add(-1 * time.Hour),
		},
	}

	for i := range conversations {
		if err := db.Create(&conversations[i]).Error; err != nil {
			log.Printf("Error creating conversation: %v", err)
		}
	}

	// Add users to conversations
	db.Model(&conversations[0]).Association("Users").Append([]*models.Users{&users[0], &users[1]})
	db.Model(&conversations[1]).Association("Users").Append([]*models.Users{&users[0], &users[1], &users[2], &users[3]})
	db.Model(&conversations[2]).Association("Users").Append([]*models.Users{&users[2], &users[4]})

	// Create messages
	messages := []models.Message{
		{
			Body:           "Hey Sarah! I saw your chocolate chip cookies post. They look amazing!",
			ConversationId: conversations[0].ID,
			SenderId:       users[0].ID,
		},
		{
			Body:           "Thank you Mario! I'd love to share the recipe with you.",
			ConversationId: conversations[0].ID,
			SenderId:       users[1].ID,
		},
		{
			Body:           "Welcome everyone to our foodie group! Let's share some amazing recipes!",
			ConversationId: conversations[1].ID,
			SenderId:       users[0].ID,
		},
		{
			Body:           "Thanks for creating this group! I'm excited to learn from everyone.",
			ConversationId: conversations[1].ID,
			SenderId:       users[1].ID,
		},
		{
			Body:           "That ramen looks incredible! Where did you get those noodles?",
			ConversationId: conversations[1].ID,
			SenderId:       users[2].ID,
		},
		{
			Body:           "Hey Jake! I tried your brisket recipe and it was incredible!",
			ConversationId: conversations[2].ID,
			SenderId:       users[2].ID,
		},
		{
			Body:           "Thanks Li! I'm glad you enjoyed it. The key is the 12-hour smoke time.",
			ConversationId: conversations[2].ID,
			SenderId:       users[4].ID,
		},
	}

	for i := range messages {
		if err := db.Create(&messages[i]).Error; err != nil {
			log.Printf("Error creating message: %v", err)
		}
	}
}

func createSampleNotifications(db *gorm.DB, users []models.Users, posts []models.Posts) {
	log.Println("Creating sample notifications...")
	
	notifications := []models.Notification{
		{
			NotificationType: models.Like,
			Notification:     "Sarah Johnson liked your post 'Authentic Italian Carbonara'",
			Interactions:     1,
			Seen:             false,
			PostId:           &posts[0].ID,
			ProfileId:        users[0].ID,
			SenderProfileId:  users[1].ID,
		},
		{
			NotificationType: models.Comment,
			Notification:     "Li Wei commented on your post 'Authentic Italian Carbonara'",
			Interactions:     1,
			Seen:             false,
			PostId:           &posts[0].ID,
			ProfileId:        users[0].ID,
			SenderProfileId:  users[2].ID,
		},
		{
			NotificationType: models.FriendRequest,
			Notification:     "Jake Thompson sent you a friend request",
			Interactions:     1,
			Seen:             false,
			ProfileId:        users[0].ID,
			SenderProfileId:  users[4].ID,
		},
		{
			NotificationType: models.Like,
			Notification:     "Mario Rossi liked your post 'Chocolate Chip Cookies'",
			Interactions:     1,
			Seen:             true,
			PostId:           &posts[1].ID,
			ProfileId:        users[1].ID,
			SenderProfileId:  users[0].ID,
		},
		{
			NotificationType: models.AcceptedRequest,
			Notification:     "Emma Green accepted your friend request",
			Interactions:     1,
			Seen:             true,
			ProfileId:        users[1].ID,
			SenderProfileId:  users[3].ID,
		},
		{
			NotificationType: models.Like,
			Notification:     "Sophie Martinez liked your post 'Ramen Bowl Deluxe'",
			Interactions:     1,
			Seen:             false,
			PostId:           &posts[2].ID,
			ProfileId:        users[2].ID,
			SenderProfileId:  users[5].ID,
		},
	}

	for _, notification := range notifications {
		if err := db.Create(&notification).Error; err != nil {
			log.Printf("Error creating notification: %v", err)
		}
	}
}

func hashPassword(password string) string {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	return string(hashedPassword)
}
