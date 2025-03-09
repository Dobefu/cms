package v1

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupLoginTests() (rr *httptest.ResponseRecorder, cleanup func()) {
	rr = httptest.NewRecorder()

	userLogin = func(username string, password string) (token string, err error) {
		return "", nil
	}

	return rr, func() {
		userLogin = user.Login
	}
}

func TestLoginErrMissingCredentials(t *testing.T) {
	rr, cleanup := setupLoginTests()
	defer cleanup()

	req, err := http.NewRequest("POST", "", strings.NewReader(""))
	assert.NoError(t, err)

	Login(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, user.ErrMissingCredentials.Error()), rr.Body.String())
}

func TestLoginErrLoginCredentials(t *testing.T) {
	rr, cleanup := setupLoginTests()
	defer cleanup()

	userLogin = func(username string, password string) (token string, err error) {
		return "", user.ErrCredentials
	}

	req, err := http.NewRequest("POST", "", strings.NewReader("username=test&password=bogus"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	Login(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, user.ErrCredentials.Error()), rr.Body.String())
}

func TestLoginErrUnexpected(t *testing.T) {
	rr, cleanup := setupLoginTests()
	defer cleanup()

	userLogin = func(username string, password string) (token string, err error) {
		return "", user.ErrUnexpected
	}

	req, err := http.NewRequest("POST", "", strings.NewReader("username=test&password=test"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	Login(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, user.ErrUnexpected.Error()), rr.Body.String())
}

func TestLoginSuccess(t *testing.T) {
	rr, cleanup := setupLoginTests()
	defer cleanup()

	req, err := http.NewRequest("POST", "", strings.NewReader("username=test&password=test"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	Login(rr, req)
	assert.JSONEq(t, `{"data": {"token": ""}, "error": null}`, rr.Body.String())
}
