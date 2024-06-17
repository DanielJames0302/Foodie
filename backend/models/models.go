package models

import (
	"time"

	"gorm.io/gorm"
)



type Users struct {
	gorm.Model
	Username			string		`json:"username"`
	Password 			string  	`json:"password"`
	Email					string		`json:"email"`
	Name 					string   `json:"name"`
	CoverPic 			string 	`json:"coverPic"`
  ProfilePic 		string   `json:"profilePic"`
  City 					string 	`json:"city"`
  Website 			string   `json:"website"`

	Conversations []Conversation `gorm:"many2many:conversation_user;"`
	SeenMessages 	[]Message `gorm:"many2many:message_user;"`

}

type Posts struct {
	gorm.Model
	Desc 				string `json:"desc"`
	Img 				string `json:"img"`
	UserID			uint `json:"userID"`
	Users Users `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Relationships struct {
	gorm.Model
	FollowerUserID uint `json:"follower_user_id"`
	FollowedUserID uint `json:"followed_user_id"`
	Users Users `gorm:"foreignKey:FollowerUserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Users2 Users `gorm:"foreignKey:FollowedUserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`



}

type Likes struct {
	gorm.Model
	UserID 			uint `json:"userID"`
	PostID 			uint `json:"postID"`
	Users Users  `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Posts Posts  `gorm:"foreignKey:PostID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

}

type Comments struct {
	gorm.Model
	Desc			string `json:"desc"`
	UserID		uint `json:"userID"`
	PostID 		uint `json:"postID"`
	Users Users  `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Posts Posts  `gorm:"foreignKey:PostID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type FollowRequests struct {
	gorm.Model
	ReceiverProfileId uint `json:"receiver_profile_id"`
	SenderProfileId 	uint `json:"sender_profile_id"`
	Users 	Users `gorm:"foreignKey:ReceiverProfileId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Users2 	Users `gorm:"foreignKey:SenderProfileId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

}

type Message struct {
	gorm.Model
	Body string
	Image string

	SeenIds []Users `gorm:"many2many:message_user;"`
	ConversationIds [] Conversation `gorm:"foreignKey:conversation_message"`
}

type Conversation struct {
	gorm.Model
	LastMessageAt time.Time
	Name string
	IsGroup bool

	Users    []Users    `gorm:"many2many:conversation_user;"`
	Messages []Message `gorm:"foreignKey:conversation_message"`

	SenderId uint
	Users2 	Users `gorm:"foreignKey:SenderId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	
}

func MigrateBooks(db *gorm.DB) error {
	err := db.AutoMigrate( &Users{}, &Posts{}, &Relationships{}, &Likes{}, &Comments{}, &FollowRequests{})
	return err
}