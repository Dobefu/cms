package v1

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/Dobefu/cms/api/cmd/server/utils"
	"github.com/Dobefu/cms/api/cmd/user"
)

func ValidateSession(w http.ResponseWriter, r *http.Request) {
	oldToken := r.FormValue("session_token")
	refresh := r.FormValue("refresh")

	if oldToken == "" {
		utils.PrintError(w, errors.New("Missing session_token"), false)
		return
	}

	newToken, err := userValidateSession(oldToken, refresh != "")

	if err != nil {
		utils.PrintError(w, err, err == user.ErrUnexpected)
		return
	}

	fmt.Fprintf(w, `{"data":{"token":"%s"},"error":null}`, newToken)
}
