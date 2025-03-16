package v1

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Dobefu/cms/api/cmd/user"
	user_structs "github.com/Dobefu/cms/api/cmd/user/structs"
	"github.com/stretchr/testify/assert"
)

func setupGetUserDataTests() (rr *httptest.ResponseRecorder, cleanup func()) {
	rr = httptest.NewRecorder()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "new-token", 1, nil
	}

	userGetUserData = func(userId int, includeInactive bool) (userData user_structs.UserData, err error) {
		return user_structs.UserData{Username: "test-user"}, nil
	}

	return rr, func() {
		userValidateSession = user.ValidateSession
		userGetUserData = user.GetUserData
	}
}

func TestGetUserDataErrMissingSessionToken(t *testing.T) {
	rr, cleanup := setupGetUserDataTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "", nil)
	assert.NoError(t, err)

	GetUserData(rr, req)
	assert.JSONEq(
		t,
		fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing session_token"),
		rr.Body.String(),
	)
}

func TestGetUserDataErrInvalidSessionToken(t *testing.T) {
	rr, cleanup := setupGetUserDataTests()
	defer cleanup()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 0, assert.AnError
	}

	req, err := http.NewRequest("GET", "", nil)
	req.Header.Add("Session-Token", "bogus")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	GetUserData(rr, req)
	assert.JSONEq(
		t,
		fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError),
		rr.Body.String(),
	)
}

func TestGetUserDataErrGetUserData(t *testing.T) {
	rr, cleanup := setupGetUserDataTests()
	defer cleanup()

	userGetUserData = func(userId int, includeInactive bool) (userData user_structs.UserData, err error) {
		return userData, assert.AnError
	}

	req, err := http.NewRequest("GET", "", nil)
	req.Header.Add("Session-Token", "bogus")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	GetUserData(rr, req)
	assert.JSONEq(
		t,
		fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError),
		rr.Body.String(),
	)
}

func TestGetUserDataSuccess(t *testing.T) {
	rr, cleanup := setupGetUserDataTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "", nil)
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	userDataJson, _ := json.Marshal(
		map[string]any{"user": user_structs.UserData{Username: "test-user"}},
	)

	GetUserData(rr, req)
	assert.JSONEq(
		t,
		fmt.Sprintf(`{"data": %s, "error": null}`, string(userDataJson)),
		rr.Body.String(),
	)
}
