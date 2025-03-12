package v1

import (
	"encoding/json"
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

	_, userId, err := userValidateSession(token, false)

	if err != nil {
		utils.PrintError(w, err, err == user.ErrUnexpected)
		return
	}

	userData, err := userGetUserData(userId)

	if err != nil {
		utils.PrintError(w, err, err == user.ErrUnexpected)
		return
	}

	// The error check is omitted here,
	// since a UserData struct will always be passed here.
	// This struct has no channels or complex types.
	userDataJson, _ := json.Marshal(userData)

	fmt.Fprintf(w, `{"data":{"user":%s},"error":null}`, userDataJson)
}
