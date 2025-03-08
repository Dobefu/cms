package v1

import (
	"errors"
	"net/http"

	"github.com/Dobefu/cms/api/cmd/server/utils"
)

func Login(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")

	if username == "" || password == "" {
		utils.PrintError(w, errors.New("Missing username and/ or password"), false)
	}

}
