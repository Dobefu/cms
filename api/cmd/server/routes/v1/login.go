package v1

import (
	"encoding/json"
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
		utils.PrintError(w, err, err == user.ErrUnexpected)
		return
	}

	response, _ := json.Marshal(map[string]any{
		"data": map[string]any{
			"token": token,
		},
		"error": nil,
	})

	fmt.Fprint(w, string(response))
}
