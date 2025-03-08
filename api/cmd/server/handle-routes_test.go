package server

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	routes_v1 "github.com/Dobefu/cms/api/cmd/server/routes/v1"
	"github.com/stretchr/testify/assert"
)

func setupHandleRoutesTests(t *testing.T, method string, path string, body io.Reader) (rr *httptest.ResponseRecorder, cleanup func()) {
	routesV1Login = func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, "{}") }

	mux := http.NewServeMux()
	handleRoutes(mux)

	req, err := http.NewRequest(method, path, body)
	assert.NoError(t, err)

	rr = httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	return rr, func() {
		routesV1Login = routes_v1.Login
	}
}

func TestHandleRoutesHomepage(t *testing.T) {
	rr, cleanup := setupHandleRoutesTests(t, "GET", "/", nil)
	defer cleanup()

	assert.Equal(t, http.StatusNotFound, rr.Code)
}

func TestHandleRoutesTrailingSlash(t *testing.T) {
	rr, cleanup := setupHandleRoutesTests(t, "GET", "/api/", nil)
	defer cleanup()

	assert.Equal(t, http.StatusSeeOther, rr.Code)
}

func TestHandleRoutesApiV1(t *testing.T) {
	rr, cleanup := setupHandleRoutesTests(t, "GET", "/api/v1", nil)
	defer cleanup()

	assert.Equal(t, http.StatusOK, rr.Code)
}

func TestHandleRoutesApiV1Login(t *testing.T) {
	rr, cleanup := setupHandleRoutesTests(t, "GET", "/api/v1/login", nil)
	defer cleanup()

	assert.Equal(t, http.StatusOK, rr.Code)
}
