package server

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Dobefu/cms/api/cmd/database"
	routes_v1 "github.com/Dobefu/cms/api/cmd/server/routes/v1"
	"github.com/stretchr/testify/assert"
)

func setupHandleRoutesTests() (mux *http.ServeMux, cleanup func()) {
	dbPing = func() error { return nil }

	routesV1Login = func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, "{}") }

	mux = http.NewServeMux()
	handleRoutes(mux)

	return mux, func() {
		dbPing = func() error { return database.DB.Ping() }

		routesV1Login = routes_v1.Login
	}
}

func TestHandleRoutesHomepage(t *testing.T) {
	mux, cleanup := setupHandleRoutesTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "/", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusNotFound, rr.Code)
}

func TestHandleRoutesTrailingSlash(t *testing.T) {
	mux, cleanup := setupHandleRoutesTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "/api/", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusSeeOther, rr.Code)
}

func TestHandleRoutesHealthErrDbPing(t *testing.T) {
	mux, cleanup := setupHandleRoutesTests()
	defer cleanup()

	dbPing = func() error { return assert.AnError }

	req, err := http.NewRequest("GET", "/health", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
}

func TestHandleRoutesHealthSuccess(t *testing.T) {
	mux, cleanup := setupHandleRoutesTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "/health", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}

func TestHandleRoutesApiV1(t *testing.T) {
	mux, cleanup := setupHandleRoutesTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "/api/v1", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}

func TestHandleRoutesApiV1Login(t *testing.T) {
	mux, cleanup := setupHandleRoutesTests()
	defer cleanup()

	req, err := http.NewRequest("POST", "/api/v1/login", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}
