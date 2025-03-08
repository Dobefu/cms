package v1

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func setupLoginTests() (rr *httptest.ResponseRecorder, cleanup func()) {
	rr = httptest.NewRecorder()

	return rr, func() {}
}

func TestLogin(t *testing.T) {
	rr, cleanup := setupLoginTests()
	defer cleanup()

	req, err := http.NewRequest("POST", "", nil)
	assert.NoError(t, err)

	Login(rr, req)
	assert.JSONEq(t, `{"data": null, "error": "Missing username and/ or password"}`, rr.Body.String())
}
