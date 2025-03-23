package server

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

var mux *http.ServeMux
var originalDBPing func() error
var originalAPIKey string
var rr *httptest.ResponseRecorder

func TestMain(m *testing.M) {
	originalDBPing = dbPing
	originalAPIKey = os.Getenv("API_KEY")

	os.Setenv("API_KEY", "test-api-key")
	dbPing = func() error { return nil }

	mux = http.NewServeMux()
	handleRoutes(mux)

	code := m.Run()

	dbPing = originalDBPing
	os.Setenv("API_KEY", originalAPIKey)

	os.Exit(code)
}

func TestHandleRoutesHomepage(t *testing.T) {
	req, err := http.NewRequest("GET", "/", nil)
	assert.NoError(t, err)

	rr = httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusSeeOther, rr.Code)
}

func TestHandleRoutesInvalidPage(t *testing.T) {
	req, err := http.NewRequest("GET", "/bogus", nil)
	assert.NoError(t, err)

	rr = httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusNotFound, rr.Code)
}

func TestHandleRoutesTrailingSlash(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/", nil)
	assert.NoError(t, err)

	rr = httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusSeeOther, rr.Code)
}

func TestHandleRoutesHealthErrDbPing(t *testing.T) {
	originalPing := dbPing
	dbPing = func() error { return assert.AnError }
	defer func() { dbPing = originalPing }()

	req, err := http.NewRequest("GET", "/health", nil)
	assert.NoError(t, err)

	rr = httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
}

func TestHandleRoutesHealthSuccess(t *testing.T) {
	req, err := http.NewRequest("GET", "/health", nil)
	assert.NoError(t, err)

	rr = httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}

func TestHandleRoutesDocsOpenapiJsonSuccess(t *testing.T) {
	req, err := http.NewRequest("GET", "/docs/openapi.json", nil)
	assert.NoError(t, err)

	rr = httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}

func TestHandleRoutesAPIErrNoApiKey(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/v1", nil)
	assert.NoError(t, err)

	rr = httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusUnauthorized, rr.Code)
}

func TestHandleRoutesAPIErrInvalidApiKey(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/v1", nil)
	req.Header.Add("X-Api-Key", "test-api-key")
	assert.NoError(t, err)

	rr = httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}
