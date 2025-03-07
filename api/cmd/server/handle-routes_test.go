package server

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func setupHandleRoutesTests(t *testing.T, method string, path string, body io.Reader) (rr *httptest.ResponseRecorder) {
	mux := http.NewServeMux()
	handleRoutes(mux)

	req, err := http.NewRequest(method, path, body)
	assert.NoError(t, err)

	rr = httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	return rr
}

func TestHandleRoutesHomepage(t *testing.T) {
	rr := setupHandleRoutesTests(t, "GET", "/", nil)
	assert.Equal(t, http.StatusNotFound, rr.Code)
}

func TestHandleRoutesTrailingSlash(t *testing.T) {
	rr := setupHandleRoutesTests(t, "GET", "/api/", nil)
	assert.Equal(t, http.StatusSeeOther, rr.Code)
}

func TestHandleRoutesApi(t *testing.T) {
	rr := setupHandleRoutesTests(t, "GET", "/api/v1", nil)
	assert.Equal(t, http.StatusOK, rr.Code)
}
