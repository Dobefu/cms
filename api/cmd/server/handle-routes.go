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

	mux.Handle(
		"GET /health",
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			err := dbPing()

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, `{"ok": false, "error": "%s"}`, err.Error())
				return
			}

			fmt.Fprint(w, `{"ok": true, "error": null}`)
		}),
	)

	apiRoute(mux, 1, "/", "GET", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "{}")
	})

	apiRoute(mux, 1, "/login", "POST", routesV1Login)

	apiRoute(mux, 1, "/validate-session", "GET", routesV1ValidateSession)

	apiRoute(mux, 1, "/logout", "GET", routesV1Logout)

	apiRoute(mux, 1, "/get-user-data", "GET", routesV1GetUserData)

	apiRoute(mux, 1, "/content-types", "GET", routesV1GetContentTypes)

	apiRoute(mux, 1, "/content-type/{id}", "GET", routesV1GetContentType)
	apiRoute(mux, 1, "/content-type", "PUT", routesV1CreateContentType)
	apiRoute(mux, 1, "/content-type/{id}", "POST", routesV1UpdateContentType)
	apiRoute(mux, 1, "/content-type/{id}", "DELETE", routesV1DeleteContentType)

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
