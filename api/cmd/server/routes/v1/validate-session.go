package v1

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"

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
		"SELECT token FROM sessions WHERE token = $1",
		oldToken,
	)

	var token string
	err := row.Scan(&token)

	if err != nil {
		if err == sql.ErrNoRows {
			utils.PrintError(w, errors.New("Could not validate session_token"), false)
		} else {
			logger.Error(err.Error())
			utils.PrintError(w, user.ErrUnexpected, true)
		}
		return
	}

	fmt.Fprintf(w, `{"data":{"token":"%s"},"error":null}`, token)
}
