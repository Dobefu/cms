package utils

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Dobefu/cms/api/cmd/logger"
)

func PrintError(w http.ResponseWriter, err error, isServerError bool) {
	statusCode := http.StatusBadRequest

	if isServerError {
		statusCode = http.StatusInternalServerError
		logger.Error(err.Error())
	}

	w.WriteHeader(statusCode)

	response, _ := json.Marshal(map[string]any{
		"data":  nil,
		"error": err.Error(),
	})

	fmt.Fprint(w, string(response))
}
