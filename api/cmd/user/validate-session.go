package user

import (
	"database/sql"
	"errors"
	"time"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/logger"
)

func ValidateSession(oldToken string, refresh bool) (newToken string, userId int, err error) {
	if oldToken == "" {
		return "", 0, errors.New("Missing session_token")
	}

	row := database.DB.QueryRow(
		"SELECT user_id,token,updated_at FROM sessions WHERE token = $1 AND updated_at >= NOW() - interval '1 month'",
		oldToken,
	)

	var token string
	var lastUpdated time.Time
	err = row.Scan(&userId, &token, &lastUpdated)

	if err != nil {
		if err == sql.ErrNoRows {
			oldTokenRow := database.DB.QueryRow(
				"SELECT user_id,token FROM sessions WHERE old_token = $1 AND updated_at >= NOW() - interval '1 minute'",
				oldToken,
			)

			var currentToken string
			oldTokenErr := oldTokenRow.Scan(&userId, &currentToken)

			if oldTokenErr != nil {
				return oldToken, 0, errors.New("Could not validate session_token")
			}

			return currentToken, userId, nil
		}

		logger.Error(err.Error())
		return oldToken, 0, ErrUnexpected
	}

	tokenAge := time.Now().Unix() - lastUpdated.Unix()

	if refresh && tokenAge >= 300 {
		newToken, err = UpdateSessionToken(userId)

		if err != nil {
			logger.Error(err.Error())
			return token, userId, ErrUnexpected
		}

		_, err = database.DB.Exec(
			"UPDATE sessions SET token = $1, old_token = $2, updated_at = $3 WHERE user_id = $4",
			newToken,
			oldToken,
			time.Now(),
			userId,
		)

		if err != nil {
			logger.Error(err.Error())
			return token, userId, ErrUnexpected
		}

		token = newToken
	}

	return token, userId, nil
}
