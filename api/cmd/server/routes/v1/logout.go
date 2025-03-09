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

func Logout(w http.ResponseWriter, r *http.Request) {
	token := r.FormValue("session_token")

	if token == "" {
		utils.PrintError(w, errors.New("Missing session_token"), false)
		return
	}

	row := database.DB.QueryRow(
		"SELECT user_id FROM sessions WHERE token = $1 AND updated_at >= NOW() - interval '1 month'",
		token,
	)

	var userId int
	err := row.Scan(&userId)

	if err != nil {
		if err == sql.ErrNoRows {
			utils.PrintError(w, errors.New("Could not validate session_token"), false)
		} else {
			logger.Error(err.Error())
			utils.PrintError(w, user.ErrUnexpected, true)
		}

		return
	}

	_, err = database.DB.Exec(
		"DELETE FROM sessions WHERE user_id = $1 AND token = $2",
		userId,
		token,
	)

	if err != nil {
		logger.Error(err.Error())
		utils.PrintError(w, user.ErrUnexpected, true)

		return
	}

	fmt.Fprint(w, `{"data":null,"error":null}`)
}
