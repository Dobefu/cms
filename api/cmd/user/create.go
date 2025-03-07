package user

import (
	"github.com/Dobefu/cms/api/cmd/database"
	"golang.org/x/crypto/bcrypt"
)

func Create(username string, email string, password string, status bool) (err error) {
	hashedPassword, err := hashPassword([]byte(password))

	if err != nil {
		return err
	}

	_, err = database.DB.Exec(
		"INSERT INTO users (username, email, password, status) VALUES ($1, $2, $3, $4)",
		username,
		email,
		hashedPassword,
		status,
	)

	if err != nil {
		return err
	}

	return nil
}

func hashPassword(password []byte) (hashedPassword []byte, err error) {
	hashedPassword, err = bcrypt.GenerateFromPassword(password, 12)

	if err != nil {
		return []byte{}, err
	}

	return hashedPassword, nil
}
