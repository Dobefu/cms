package v1

import (
	"fmt"
	"net/http"

	"github.com/Dobefu/cms/api/cmd/server/utils"
	"github.com/Dobefu/cms/api/cmd/user"
)

func Login(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")

	if username == "" || password == "" {
		utils.PrintError(w, user.ErrMissingCredentials, false)
		return
	}

	token, err := userLogin(username, password)

	if err != nil {
		if err == user.ErrUnexpected {
			utils.PrintError(w, err, true)
		} else {
			utils.PrintError(w, err, false)
		}

		return
	}

	fmt.Fprintf(w, `{"data":{"token":"%s"},"error":null}`, token)
}
