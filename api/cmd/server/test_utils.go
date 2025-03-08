package server

import (
	"net/http"

	routes_v1 "github.com/Dobefu/cms/api/cmd/server/routes/v1"
)

var httpListenAndServe = http.ListenAndServe
var routesV1Login = routes_v1.Login
