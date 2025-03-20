package server

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/stretchr/testify/assert"
)

func setupHandleRoutesTests() (mux *http.ServeMux, cleanup func()) {
	dbPing = func() error { return nil }

	oldApiKey := os.Getenv("API_KEY")
	os.Setenv("API_KEY", "test-api-key")

	mux = http.NewServeMux()
	handleRoutes(mux)

	return mux, func() {
		dbPing = func() error { return database.DB.Ping() }

		os.Setenv("API_KEY", oldApiKey)
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

func TestHandleRoutesAPIErrNoApiKey(t *testing.T) {
	mux, cleanup := setupHandleRoutesTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "/api/v1", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusUnauthorized, rr.Code)
}

func TestHandleRoutesAPIErrInvalidApiKey(t *testing.T) {
	mux, cleanup := setupHandleRoutesTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "/api/v1", nil)
	req.Header.Add("X-Api-Key", "test-api-key")
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}
