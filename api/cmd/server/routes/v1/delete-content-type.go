package v1

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/Dobefu/cms/api/cmd/server/utils"
	"github.com/Dobefu/cms/api/cmd/user"
)

func DeleteContentType(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))

	if err != nil {
		w.WriteHeader(404)
		return
	}

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

	title := r.FormValue("title")

	if title == "" {
		utils.PrintError(w, errors.New("Missing title"), false)
		return
	}

	err = contentDeleteContentType(id, userId, title)

	if err != nil {
		utils.PrintError(w, err, err == user.ErrUnexpected)
		return
	}

	response, _ := json.Marshal(map[string]any{
		"data": map[string]any{
			"id": id,
		},
		"error": nil,
	})

	fmt.Fprint(w, string(response))
}
