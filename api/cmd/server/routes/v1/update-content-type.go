package v1

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/Dobefu/cms/api/cmd/server/utils"
	"github.com/Dobefu/cms/api/cmd/user"
)

func UpdateContentType(w http.ResponseWriter, r *http.Request) {
	title := r.FormValue("title")

	if title == "" {
		utils.PrintError(w, errors.New("Missing title"), false)
		return
	}

	id, err := contentUpdateContentType(title)

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
