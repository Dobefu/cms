package v1

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupValidateSessionTests(t *testing.T) (rr *httptest.ResponseRecorder, cleanup func()) {
	rr = httptest.NewRecorder()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "new-token", 1, nil
	}

	return rr, func() {
		userValidateSession = user.ValidateSession
	}
}

func TestValidateSessionErrMissingSessionToken(t *testing.T) {
	rr, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	req, err := http.NewRequest("GET", "", nil)
	assert.NoError(t, err)

	ValidateSession(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing session_token"), rr.Body.String())
}

func TestValidateSessionErrInvalidSessionToken(t *testing.T) {
	rr, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 0, assert.AnError
	}

	req, err := http.NewRequest("GET", "", nil)
	req.Header.Add("Session-Token", "bogus")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	ValidateSession(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestValidateSessionSuccess(t *testing.T) {
	rr, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	req, err := http.NewRequest("GET", "", nil)
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	ValidateSession(rr, req)
	assert.JSONEq(t, `{"data": {"token": "new-token"}, "error": null}`, rr.Body.String())
}
