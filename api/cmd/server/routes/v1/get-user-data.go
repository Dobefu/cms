package v1

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/Dobefu/cms/api/cmd/server/utils"
	"github.com/Dobefu/cms/api/cmd/user"
)

func GetUserData(w http.ResponseWriter, r *http.Request) {
	token := r.FormValue("session_token")

	if token == "" {
		utils.PrintError(w, errors.New("Missing session_token"), false)
		return
	}

	_, _, err := userValidateSession(token, false)

	if err != nil {
		utils.PrintError(w, err, err == user.ErrUnexpected)
		return
	}

	fmt.Fprint(w, `{"data":{"user":{}},"error":null}`)
}
