package server

import (
	"fmt"
	"net/http"

	"github.com/Dobefu/cms/api/cmd/logger"
)

func Init(port uint) (err error) {
	url := fmt.Sprintf(":%d", port)
	mux := http.NewServeMux()

	handleRoutes(mux)

	logger.Info("Starting server on http://localhost:%d\n", port)

	err = httpListenAndServe(url, mux)

	if err != nil {
		return err
	}

	return nil
}
