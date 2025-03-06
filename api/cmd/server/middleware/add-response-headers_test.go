package middleware

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func setupAddResponseHeaders() *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()

	return rr
}

func TestAddResponseHeadersSuccess(t *testing.T) {
	rr := setupAddResponseHeaders()
	req, _ := http.NewRequest("GET", "/", nil)

	endpoint := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, `{"error":null}`)
	})

	AddResponseHeaders(endpoint).ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.JSONEq(t, `{"error":null}`, rr.Body.String())
}
