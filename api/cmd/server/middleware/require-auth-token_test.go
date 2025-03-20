package middleware

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func setupRequireAuthToken(t *testing.T) (rr *httptest.ResponseRecorder, req *http.Request, endpoint http.HandlerFunc, cleanup func()) {
	rr = httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/", nil)
	assert.NoError(t, err)

	endpoint = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, `{"error":null}`)
	})

	oldApiKey := os.Getenv("API_KEY")
	os.Setenv("API_KEY", "test-api-key")

	return rr, req, endpoint, func() {
		os.Setenv("API_KEY", oldApiKey)
	}
}

func TestRequireAuthTokenErrNoApiKey(t *testing.T) {
	rr, req, endpoint, cleanup := setupRequireAuthToken(t)
	defer cleanup()

	RequireApiKey(endpoint).ServeHTTP(rr, req)

	assert.Equal(t, http.StatusUnauthorized, rr.Code)
	assert.JSONEq(t, `{"data": null, "error": "No API key provided"}`, rr.Body.String())
}

func TestRequireAuthTokenErrInvalidApiKey(t *testing.T) {
	rr, req, endpoint, cleanup := setupRequireAuthToken(t)
	defer cleanup()

	req.Header.Add("X-Api-Key", "bogus")
	RequireApiKey(endpoint).ServeHTTP(rr, req)

	assert.Equal(t, http.StatusUnauthorized, rr.Code)
	assert.JSONEq(t, `{"data": null, "error": "Invalid API key"}`, rr.Body.String())
}

func TestRequireAuthTokenSuccess(t *testing.T) {
	rr, req, endpoint, cleanup := setupRequireAuthToken(t)
	defer cleanup()

	req.Header.Add("X-Api-Key", "test-api-key")
	RequireApiKey(endpoint).ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.JSONEq(t, `{"error": null}`, rr.Body.String())
}
