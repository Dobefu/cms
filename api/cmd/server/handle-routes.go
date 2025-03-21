package server

import (
	_ "embed"
	"fmt"
	"net/http"
	"strings"

	"github.com/Dobefu/cms/api/cmd/server/middleware"
	"github.com/swaggest/swgui/v5emb"
)

//go:embed openapi.json
var openapiJson string

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

	mux.Handle("GET /docs/openapi.json", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, openapiJson)
	}))

	mux.Handle("GET /docs/{subpaths...}", v5emb.New("CMS", "/docs/openapi.json", "/docs/"))

	apiRoute(mux, 1, "/", "GET", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "{}")
	})

	apiRoute(mux, 1, "/login", "POST", routesV1Login)

	apiRoute(mux, 1, "/validate-session", "GET", routesV1ValidateSession)

	apiRoute(mux, 1, "/logout", "GET", routesV1Logout)

	apiRoute(mux, 1, "/user-data", "GET", routesV1GetUserData)

	apiRoute(mux, 1, "/content-types", "GET", routesV1GetContentTypes)

	contentTypeRoute := "/content-type/{id}"
	apiRoute(mux, 1, contentTypeRoute, "GET", routesV1GetContentType)
	apiRoute(mux, 1, "/content-type", "PUT", routesV1CreateContentType)
	apiRoute(mux, 1, contentTypeRoute, "POST", routesV1UpdateContentType)
	apiRoute(mux, 1, contentTypeRoute, "DELETE", routesV1DeleteContentType)

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
		middleware.RequireApiKey(
			middleware.AddResponseHeaders(
				http.HandlerFunc(handler),
			),
		),
	)
}
