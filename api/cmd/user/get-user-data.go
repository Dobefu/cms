package user

import (
	"database/sql"
	"errors"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/logger"
)

func GetUserData(userId int) (err error) {
	row := database.DB.QueryRow(
		"SELECT username FROM users WHERE id = $1 LIMIT 1",
		userId,
	)

	var username string
	err = row.Scan(&username)

	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("Could not get user data")
		} else {
			logger.Error(err.Error())
			return ErrUnexpected
		}
	}

	return nil
}
