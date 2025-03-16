package server

import (
	"net/http"

	"github.com/Dobefu/cms/api/cmd/database"
	routes_v1 "github.com/Dobefu/cms/api/cmd/server/routes/v1"
)

var httpListenAndServe = http.ListenAndServe
var dbPing = func() error { return database.DB.Ping() }
var routesV1Login = routes_v1.Login
var routesV1ValidateSession = routes_v1.ValidateSession
var routesV1Logout = routes_v1.Logout
var routesV1GetUserData = routes_v1.GetUserData
var routesV1GetContentType = routes_v1.GetContentType
var routesV1CreateContentType = routes_v1.CreateContentType
var routesV1UpdateContentType = routes_v1.UpdateContentType
var routesV1GetContentTypes = routes_v1.GetContentTypes
