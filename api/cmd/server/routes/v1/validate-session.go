package v1

import (
	"encoding/json"
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

	newToken, _, err := userValidateSession(oldToken, refresh != "")

	if err != nil {
		utils.PrintError(w, err, err == user.ErrUnexpected)
		return
	}

	response, _ := json.Marshal(map[string]any{
		"data": map[string]any{
			"token": newToken,
		},
		"error": nil,
	})

	fmt.Fprint(w, string(response))
}
