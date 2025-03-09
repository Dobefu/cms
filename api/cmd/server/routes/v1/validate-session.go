package v1

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/logger"
	"github.com/Dobefu/cms/api/cmd/server/utils"
	"github.com/Dobefu/cms/api/cmd/user"
)

func ValidateSession(w http.ResponseWriter, r *http.Request) {
	oldToken := r.FormValue("session_token")

	if oldToken == "" {
		utils.PrintError(w, errors.New("Missing session_token"), false)
		return
	}

	row := database.DB.QueryRow(
		"SELECT user_id, token, updated_at FROM sessions WHERE token = $1",
		oldToken,
	)

	var userId int
	var token string
	var lastUpdated time.Time
	err := row.Scan(&userId, &token, &lastUpdated)

	if err != nil {
		if err == sql.ErrNoRows {
			utils.PrintError(w, errors.New("Could not validate session_token"), false)
		} else {
			logger.Error(err.Error())
			utils.PrintError(w, user.ErrUnexpected, true)
		}

		return
	}

	tokenAge := time.Now().Unix() - lastUpdated.Unix()

	if tokenAge > 360 {
		newToken, err := user.UpdateSessionToken(userId)

		if err != nil {
			logger.Error(err.Error())
			utils.PrintError(w, user.ErrUnexpected, true)

			return
		}

		_, err = database.DB.Exec(
			"UPDATE sessions SET token = $1, updated_at = $2 WHERE token = $3",
			newToken,
			time.Now(),
			oldToken,
		)

		if err != nil {
			logger.Error(err.Error())
			utils.PrintError(w, user.ErrUnexpected, true)

			return
		}

		token = newToken
	}

	fmt.Fprintf(w, `{"data":{"token":"%s"},"error":null}`, token)
}
