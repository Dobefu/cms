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

func Login(username string, password string) (err error) {
	if username == "" || password == "" {
		return errors.New("Missing username and/ or password")
	}

	row := database.DB.QueryRow(
		"SELECT password FROM users WHERE username = $1 LIMIT 1",
		username,
	)

	var hashedPassword string
	err = row.Scan(&hashedPassword)

	if err != nil {
		if err == sql.ErrNoRows {
			return ErrCredentials
		} else {
			return ErrUnexpected
		}
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))

	if err != nil {
		return ErrCredentials
	}

	err = SetLastLogin(username, time.Now().UTC())

	if err != nil {
		return ErrUnexpected
	}

	return nil
}
