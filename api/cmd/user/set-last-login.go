package user

import (
	"time"

	"github.com/Dobefu/cms/api/cmd/database"
)

func SetLastLogin(username string, lastLoginTime time.Time) (err error) {
	_, err = database.DB.Exec(
		"UPDATE users SET last_login = $1 WHERE username = $2",
		lastLoginTime,
		username,
	)

	if err != nil {
		return err
	}

	return nil
}
