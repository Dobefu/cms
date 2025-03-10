package server

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Dobefu/cms/api/cmd/server/middleware"
)

func handleRoutes(mux *http.ServeMux) *http.ServeMux {
	mux.Handle(
		"GET /{catchall...}",
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			path := strings.TrimRight(r.URL.Path, "/")

			if path != "" && path != r.URL.Path {
				http.Redirect(w, r, path, http.StatusSeeOther)
				return
			}

			w.WriteHeader(404)
		}),
	)

	apiRoute(mux, 1, "/", "GET", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "{}")
	})

	apiRoute(mux, 1, "/login", "POST", routesV1Login)
	apiRoute(mux, 1, "/validate-session", "POST", routesV1ValidateSession)
	apiRoute(mux, 1, "/logout", "POST", routesV1Logout)

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
