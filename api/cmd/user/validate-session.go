package user

import (
	"database/sql"
	"errors"
	"time"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/logger"
)

func ValidateSession(oldToken string, refresh bool) (newToken string, err error) {
	if oldToken == "" {
		return "", errors.New("Missing session token")
	}

	row := database.DB.QueryRow(
		"SELECT user_id, token, updated_at FROM sessions WHERE token = $1 AND updated_at >= NOW() - interval '1 month'",
		oldToken,
	)

	var userId int
	var token string
	var lastUpdated time.Time
	err = row.Scan(&userId, &token, &lastUpdated)

	if err != nil {
		if err == sql.ErrNoRows {
			return oldToken, errors.New("Could not validate session_token")
		} else {
			logger.Error(err.Error())
			return oldToken, ErrUnexpected
		}
	}

	tokenAge := time.Now().Unix() - lastUpdated.Unix()

	if refresh && tokenAge >= 360 {
		newToken, err = UpdateSessionToken(userId)

		if err != nil {
			logger.Error(err.Error())
			return token, ErrUnexpected
		}

		_, err = database.DB.Exec(
			"UPDATE sessions SET token = $1, updated_at = $2 WHERE token = $3",
			newToken,
			time.Now(),
			oldToken,
		)

		if err != nil {
			logger.Error(err.Error())
			return token, ErrUnexpected
		}

		token = newToken
	}

	return token, nil
}
