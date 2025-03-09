package user

import (
	"database/sql"
	"errors"
	"time"

	"github.com/Dobefu/cms/api/cmd/database"
	"golang.org/x/crypto/bcrypt"
)

var ErrMissingCredentials = errors.New("Missing username and/ or password")
var ErrCredentials = errors.New("Invalid username or password")
var ErrUnexpected = errors.New("Internal server error")

func Login(username string, password string) (token string, err error) {
	if username == "" || password == "" {
		return "", errors.New("Missing username and/ or password")
	}

	row := database.DB.QueryRow(
		"SELECT id,password FROM users WHERE username = $1 LIMIT 1",
		username,
	)

	var userId int
	var hashedPassword string
	err = row.Scan(&userId, &hashedPassword)

	if err != nil {
		if err == sql.ErrNoRows {
			return "", ErrCredentials
		} else {
			return "", ErrUnexpected
		}
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))

	if err != nil {
		return "", ErrCredentials
	}

	err = SetLastLogin(userId, time.Now().UTC())

	if err != nil {
		return "", ErrUnexpected
	}

	token, err = UpdateSessionToken(userId)

	if err != nil {
		return "", ErrUnexpected
	}

	return token, nil
}
