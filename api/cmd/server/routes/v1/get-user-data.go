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
	token := r.Header.Get("Session-Token")

	if token == "" {
		utils.PrintError(w, errors.New("Missing session_token"), false)
		return
	}

	_, userId, err := userValidateSession(token, false)

	if err != nil {
		utils.PrintError(w, err, err == user.ErrUnexpected)
		return
	}

	userData, err := userGetUserData(userId, false)

	if err != nil {
		utils.PrintError(w, err, err == user.ErrUnexpected)
		return
	}

	response, _ := json.Marshal(map[string]any{
		"data": map[string]any{
			"user": userData,
		},
		"error": nil,
	})

	fmt.Fprint(w, string(response))
}
