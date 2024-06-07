package utils

import (
	"time"

	"github.com/golang-jwt/jwt"
)

func CreateToken(userId uint, expiration string) (string, error) {
	expDuration, err := time.ParseDuration(expiration)
	if err != nil {
			return "", err
	}
	
	claims := jwt.MapClaims {
		"id": userId,
		"exp": time.Now().Add(expDuration).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte("JWT_KEY"))
}


