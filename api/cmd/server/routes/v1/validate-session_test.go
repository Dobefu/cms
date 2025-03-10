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

func setupValidateSessionTests(t *testing.T) (rr *httptest.ResponseRecorder, cleanup func()) {
	rr = httptest.NewRecorder()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, err error) {
		return "new-token", nil
	}

	return rr, func() {
		userValidateSession = user.ValidateSession
	}
}

func TestValidateSessionErrMissingSessionToken(t *testing.T) {
	rr, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	req, err := http.NewRequest("POST", "", strings.NewReader(""))
	assert.NoError(t, err)

	ValidateSession(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing session_token"), rr.Body.String())
}

func TestValidateSessionErrInvalidSessionToken(t *testing.T) {
	rr, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, err error) {
		return "", assert.AnError
	}

	req, err := http.NewRequest("POST", "", strings.NewReader("session_token=bogus"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	ValidateSession(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestValidateSessionSuccess(t *testing.T) {
	rr, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	req, err := http.NewRequest("POST", "", strings.NewReader("session_token=test"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	ValidateSession(rr, req)
	assert.JSONEq(t, `{"data": {"token": "new-token"}, "error": null}`, rr.Body.String())
}
