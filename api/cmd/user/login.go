package user

import (
	"database/sql"
	"errors"
	"time"

	"github.com/Dobefu/cms/api/cmd/database"
	"golang.org/x/crypto/bcrypt"
)

var ErrUnexpected = errors.New("Internal server error")
var errCredentials = errors.New("Invalid username or password")

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
			return errCredentials
		} else {
			return ErrUnexpected
		}
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))

	if err != nil {
		return errCredentials
	}

	_, err = database.DB.Exec(
		"UPDATE users SET last_login = $1 WHERE username = $2",
		time.Now().UTC(),
		username,
	)

	if err != nil {
		return ErrUnexpected
	}

	return nil
}
