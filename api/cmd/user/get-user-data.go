package user

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/logger"
	user_structs "github.com/Dobefu/cms/api/cmd/user/structs"
)

func GetUserData(userId int, includeInactive bool) (userData user_structs.UserData, err error) {
	var whereClause string

	if !includeInactive {
		whereClause = "AND status = true"
	}

	row := database.DB.QueryRow(
		fmt.Sprintf(
			"SELECT id,username,email,status,created_at,updated_at,last_login FROM users WHERE id = $1 %s LIMIT 1",
			whereClause,
		),
		userId,
	)

	err = row.Scan(
		&userData.Id,
		&userData.Username,
		&userData.Email,
		&userData.Status,
		&userData.CreatedAt,
		&userData.UpdatedAt,
		&userData.LastLogin,
	)

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
