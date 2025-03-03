package server

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Dobefu/cms/api/cmd/server/middleware"
)

func handleRoutes() *http.ServeMux {
	mux := http.NewServeMux()

	apiRoute(mux, 1, "/", "GET", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "{}")
	})

	return mux
}

func apiRoute(
	mux *http.ServeMux,
	version int,
	path string,
	method string,
	handler func(w http.ResponseWriter, r *http.Request),
) {
	fullPath := fmt.Sprintf("%s /api/v%d%s", method, version, path)
	fullPath = strings.TrimRight(fullPath, "/")

	mux.Handle(
		fullPath,
		middleware.AddResponseHeaders(
			http.HandlerFunc(handler),
		),
	)
}
