package user

import (
	"database/sql"
	"errors"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/logger"
	user_structs "github.com/Dobefu/cms/api/cmd/user/structs"
)

func GetUserData(userId int) (userData user_structs.UserData, err error) {
	row := database.DB.QueryRow(
		"SELECT username FROM users WHERE id = $1 LIMIT 1",
		userId,
	)

	err = row.Scan(&userData.Username)

	if err != nil {
		if err == sql.ErrNoRows {
			return userData, errors.New("Could not get user data")
		} else {
			logger.Error(err.Error())
			return userData, ErrUnexpected
		}
	}

	return userData, nil
}
