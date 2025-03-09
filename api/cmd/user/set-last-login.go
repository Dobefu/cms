package user

import (
	"time"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/logger"
)

func SetLastLogin(userId int, lastLoginTime time.Time) (err error) {
	_, err = database.DB.Exec(
		"UPDATE users SET last_login = $1 WHERE id = $2",
		lastLoginTime,
		userId,
	)

	if err != nil {
		logger.Error(err.Error())
		return err
	}

	return nil
}
