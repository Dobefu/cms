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

func CreateContent(w http.ResponseWriter, r *http.Request) {
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

	contentType, err := strconv.Atoi(r.FormValue("content_type"))

	if err != nil {
		utils.PrintError(w, errors.New("Missing or invalid content type ID"), false)
		return
	}

	title := r.FormValue("title")

	if title == "" {
		utils.PrintError(w, errors.New("Missing title"), false)
		return
	}

	isPublished := r.FormValue("published") == "true" || r.FormValue("published") == "1"

	id, err := contentCreateContent(userId, contentType, title, isPublished)

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
