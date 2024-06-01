package models

import (
	"gorm.io/gorm"


	
)

type Books struct {
	ID					string 	`json:"id"`
	Author 			string 	`json:"author"`
	Title 			string 	`json:"title"`
	Publisher		string 	`json:"publisher"`
}

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
}

type Posts struct {
	gorm.Model
	Desc 				string `json:"desc"`
	Img 				string `json:"img"`
	UserID			int `json:"userID"`
	Users Users `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type Relationships struct {
	gorm.Model
	FollowerUserID int `json:"follower_user_id"`
	FollowedUserID int `json:"followed_user_id"`
	Users Users `gorm:"foreignKey:FollowerUserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Users2 Users `gorm:"foreignKey:FollowedUserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`



}

type Likes struct {
	gorm.Model
	UserID 			int `json:"userID"`
	PostID 			int `json:"postID"`
	Users Users  `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Posts Posts  `gorm:"foreignKey:PostID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

}

type Comments struct {
	gorm.Model
	Desc			string `json:"desc"`
	UserID		int `json:"userID"`
	PostID 		int `json:"postID"`
	Users Users  `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Posts Posts  `gorm:"foreignKey:PostID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type FollowRequests struct {
	gorm.Model
	ReceiverProfileId int `json:"receiver_profile_id"`
	SenderProfileId 	int `json:"sender_profile_id"`
	Users 	Users `gorm:"foreignKey:ReceiverProfileId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Users2 	Users `gorm:"foreignKey:SenderProfileId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

}

func MigrateBooks(db *gorm.DB) error {
	err := db.AutoMigrate( &Users{}, &Posts{}, &Relationships{}, &Likes{}, &Comments{}, &FollowRequests{})
	return err
}