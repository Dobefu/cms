package server

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestHandleRoutesHomepage(t *testing.T) {
	req, err := http.NewRequest("GET", "/", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusSeeOther, rr.Code)
}

func TestHandleRoutesInvalidPage(t *testing.T) {
	req, err := http.NewRequest("GET", "/bogus", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusNotFound, rr.Code)
}

func TestHandleRoutesTrailingSlash(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusSeeOther, rr.Code)
}

func TestHandleRoutesHealthErrDbPing(t *testing.T) {
	mockDb.ExpectPing().WillReturnError(sqlmock.ErrCancelled)

	req, err := http.NewRequest("GET", "/health", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusInternalServerError, rr.Code)
}

func TestHandleRoutesHealthSuccess(t *testing.T) {
	mockDb.ExpectPing()

	req, err := http.NewRequest("GET", "/health", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}

func TestHandleRoutesDocsOpenapiJsonSuccess(t *testing.T) {
	req, err := http.NewRequest("GET", "/docs/openapi.json", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}

func TestHandleRoutesAPIErrNoApiKey(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/v1", nil)
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusUnauthorized, rr.Code)
}

func TestHandleRoutesAPIErrInvalidApiKey(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/v1", nil)
	req.Header.Add("X-Api-Key", "test-api-key")
	assert.NoError(t, err)

	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
}
