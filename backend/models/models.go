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

	Conversations  []*Conversation `gorm:"many2many:conversation_user;"`
	SeenMessages 	[]*Message      `gorm:"many2many:message_user;"`
	Notification 	[]*Notification  `gorm:"many2many:notification_user;"`;

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
	MyProfileId uint `json:"my_profile_id"`
	FriendProfileId uint `json:"friend_profile_id"`
	Users Users `gorm:"foreignKey:MyProfileId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Users2 Users `gorm:"foreignKey:FriendProfileId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
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

type FriendRequests struct {
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

	SeenIds []*Users `gorm:"many2many:message_user;"`

	ConversationId uint
	Conversation Conversation `gorm:"foreignKey:ConversationId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	SenderId uint
	Sender Users `gorm:"foreignKey:SenderId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`

}

type Conversation struct {
	gorm.Model
	LastMessageAt time.Time
	Name string
	IsGroup bool

	Users    []*Users    `gorm:"many2many:conversation_user;"` 
	Messages []*Message  `gorm:"many2many:conversation_message"`
	
}

type NotificationType string

const (
	FriendRequest   NotificationType = "friend_request"
	AcceptedRequest NotificationType = "accepted_request"
	Like            NotificationType = "like"
	Comment         NotificationType = "comment"
)

type Notification struct {
	ID               uint           `gorm:"primaryKey"`
	NotificationType NotificationType `gorm:"not null"`
	Notification     string         `gorm:"size:255;not null"`
	Interactions     int            `gorm:"default:1"`
	Seen             bool           `gorm:"default:false"`
	PostId           *uint          `gorm:"index;default:null"`
	CommentId        *uint          `gorm:"index;default:null"`
	AnswerId         *uint          `gorm:"index;default:null"`
	ProfileId        uint           `gorm:"index"`
	SenderProfileId  uint           `gorm:"index"`
	CreatedAt        time.Time      `gorm:"autoCreateTime"`

	// Define foreign key constraints
	Profile         Users         `gorm:"foreignKey:ProfileId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	SenderProfile   Users         `gorm:"foreignKey:SenderProfileId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Post            Posts            `gorm:"foreignKey:PostId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Comment         Comments         `gorm:"foreignKey:CommentId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

func MigrateBooks(db *gorm.DB) error {
	err := db.AutoMigrate( &Users{}, &Posts{}, &Relationships{}, &Likes{}, &Comments{}, &FriendRequests{}, &Conversation{}, &Message{}, &Notification{});
	return err
}