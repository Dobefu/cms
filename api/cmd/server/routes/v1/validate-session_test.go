package v1

import (
	"database/sql"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupValidateSessionTests(t *testing.T) (rr *httptest.ResponseRecorder, mock sqlmock.Sqlmock, cleanup func()) {
	rr = httptest.NewRecorder()

	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	userUpdateSessionToken = func(userId int) (token string, err error) {
		return "new-token", nil
	}

	return rr, mock, func() {
		db.Close()
		database.DB = oldDb

		userUpdateSessionToken = user.UpdateSessionToken
	}
}

func TestValidateSessionErrMissingSessionToken(t *testing.T) {
	rr, _, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	req, err := http.NewRequest("POST", "", strings.NewReader(""))
	assert.NoError(t, err)

	ValidateSession(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing session_token"), rr.Body.String())
}

func TestValidateSessionErrInvalidSessionToken(t *testing.T) {
	rr, mock, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id, token, updated_at FROM sessions WHERE .+").WillReturnError(sql.ErrNoRows)

	req, err := http.NewRequest("POST", "", strings.NewReader("session_token=bogus"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	ValidateSession(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Could not validate session_token"), rr.Body.String())
}

func TestValidateSessionErrSessionTokenUnexpected(t *testing.T) {
	rr, mock, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id, token, updated_at FROM sessions WHERE .+").WillReturnError(assert.AnError)

	req, err := http.NewRequest("POST", "", strings.NewReader("session_token=test"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	ValidateSession(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, user.ErrUnexpected), rr.Body.String())
}

func TestValidateSessionErrUpdateToken(t *testing.T) {
	rr, mock, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id, token, updated_at FROM sessions WHERE .+").WillReturnRows(
		sqlmock.NewRows([]string{"user_id", "token", "updated_at"}).AddRow(1, "test", time.Now().Add(-360*time.Second)),
	)

	mock.ExpectExec("INSERT INTO sessions .+ ON CONFLICT(.+) DO .+").WillReturnError(assert.AnError)

	req, err := http.NewRequest("POST", "", strings.NewReader("session_token=test"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	ValidateSession(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, user.ErrUnexpected), rr.Body.String())
}

func TestValidateSessionErrUpdateTokenDatabase(t *testing.T) {
	rr, mock, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id, token, updated_at FROM sessions WHERE .+").WillReturnRows(
		sqlmock.NewRows([]string{"user_id", "token", "updated_at"}).AddRow(1, "test", time.Now().Add(-360*time.Second)),
	)

	userUpdateSessionToken = func(userId int) (token string, err error) {
		return "new-token", assert.AnError
	}

	mock.ExpectExec("UPDATE sessions SET .+").WillReturnError(assert.AnError)

	req, err := http.NewRequest("POST", "", strings.NewReader("session_token=test"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	ValidateSession(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, user.ErrUnexpected), rr.Body.String())
}

func TestValidateSessionSuccess(t *testing.T) {
	rr, mock, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id, token, updated_at FROM sessions WHERE .+").WillReturnRows(
		sqlmock.NewRows([]string{"user_id", "token", "updated_at"}).AddRow(1, "test", time.Now().Add(-360*time.Second)),
	)

	mock.ExpectExec("UPDATE sessions SET .+").WillReturnResult(sqlmock.NewResult(1, 1))

	req, err := http.NewRequest("POST", "", strings.NewReader("session_token=test"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	ValidateSession(rr, req)
	assert.JSONEq(t, `{"data": {"token": "new-token"}, "error": null}`, rr.Body.String())
}
