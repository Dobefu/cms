package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/Dobefu/cms/api/cmd/logger"
)

func Init(port uint, ctx context.Context) (err error) {
	url := fmt.Sprintf(":%d", port)
	mux := http.NewServeMux()

	handleRoutes(mux)

	logger.Info("Starting server on http://localhost:%d\n", port)

	server := &http.Server{
		Addr:    url,
		Handler: mux,
	}

	if ctx != nil {
		go func() {
			<-ctx.Done()
			_ = server.Shutdown(context.Background())
		}()
	}

	err = server.ListenAndServe()

	return err
}
