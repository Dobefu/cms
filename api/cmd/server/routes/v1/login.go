package v1

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/logger"
	"github.com/Dobefu/cms/api/cmd/server/utils"
	"golang.org/x/crypto/bcrypt"
)

func Login(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")

	if username == "" || password == "" {
		utils.PrintError(w, errors.New("Missing username and/ or password"), false)
		return
	}

	row := database.DB.QueryRow(
		"SELECT password FROM users WHERE username = $1 LIMIT 1",
		username,
	)

	var hashedPassword string
	err := row.Scan(&hashedPassword)

	if err != nil {
		if err == sql.ErrNoRows {
			utils.PrintError(w, errors.New("Invalid username or password"), false)
		} else {
			logger.Error(err.Error())
			utils.PrintError(w, errors.New("Internal server error"), true)
		}
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))

	if err != nil {
		utils.PrintError(w, errors.New("Invalid username or password"), false)
		return
	}

	fmt.Fprint(w, "{}")
}
