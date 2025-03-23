package server

import (
	_ "embed"
	"fmt"
	"net/http"
	"strings"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/server/middleware"
	routes_v1 "github.com/Dobefu/cms/api/cmd/server/routes/v1"
	"github.com/swaggest/swgui/v5emb"
)

//go:embed openapi.json
var openapiJson string

func handleRoutes(mux *http.ServeMux) *http.ServeMux {
	mux.Handle(
		"GET /{catchall...}",
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			path := strings.TrimRight(r.URL.Path, "/")

			if path == "" {
				http.Redirect(w, r, "/docs/", http.StatusSeeOther)
				return
			}

			if path != r.URL.Path {
				http.Redirect(w, r, path, http.StatusSeeOther)
				return
			}

			w.WriteHeader(404)
		}),
	)

	mux.Handle(
		"GET /health",
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			err := database.DB.Ping()

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

	apiRoute(mux, 1, "/login", "POST", routes_v1.Login)

	apiRoute(mux, 1, "/validate-session", "GET", routes_v1.ValidateSession)

	apiRoute(mux, 1, "/logout", "GET", routes_v1.Logout)

	apiRoute(mux, 1, "/user-data", "GET", routes_v1.GetUserData)

	apiRoute(mux, 1, "/content-types", "GET", routes_v1.GetContentTypes)

	contentTypeRoute := "/content-type/{id}"
	apiRoute(mux, 1, "/content-type", "PUT", routes_v1.CreateContentType)
	apiRoute(mux, 1, contentTypeRoute, "GET", routes_v1.GetContentType)
	apiRoute(mux, 1, contentTypeRoute, "POST", routes_v1.UpdateContentType)
	apiRoute(mux, 1, contentTypeRoute, "DELETE", routes_v1.DeleteContentType)

	contentRoute := "/content/{id}"
	apiRoute(mux, 1, contentRoute, "GET", routes_v1.GetContent)

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
