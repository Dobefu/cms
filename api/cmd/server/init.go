package server

import (
	"fmt"
	"net/http"
)

func Init(port uint) (err error) {
	router := handleRoutes()

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: router,
	}

	fmt.Printf("Starting server on http://localhost:%d\n", port)
	err = server.ListenAndServe()

	if err != nil {
		return err
	}

	return nil
}
