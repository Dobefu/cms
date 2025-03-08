package utils

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Dobefu/cms/api/cmd/logger"
)

func PrintError(w http.ResponseWriter, err error, isServerError bool) {
	statusCode := http.StatusBadRequest

	if isServerError {
		statusCode = http.StatusInternalServerError
		logger.Error(err.Error())
	}

	w.WriteHeader(statusCode)
	fmt.Fprintf(w, `{"data": null, "error": "%s"}`, strings.ReplaceAll(err.Error(), `"`, `\"`))
}
