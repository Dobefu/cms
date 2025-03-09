package v1

import (
	"database/sql"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupLogoutTests(t *testing.T) (rr *httptest.ResponseRecorder, mock sqlmock.Sqlmock, cleanup func()) {
	rr = httptest.NewRecorder()

	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return rr, mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestLogoutErrMissingSessionToken(t *testing.T) {
	rr, _, cleanup := setupLogoutTests(t)
	defer cleanup()

	req, err := http.NewRequest("POST", "", strings.NewReader(""))
	assert.NoError(t, err)

	Logout(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing session_token"), rr.Body.String())
}

func TestLogoutErrInvalidSessionToken(t *testing.T) {
	rr, mock, cleanup := setupLogoutTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id FROM sessions WHERE .+").WillReturnError(sql.ErrNoRows)

	req, err := http.NewRequest("POST", "", strings.NewReader("session_token=bogus"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	Logout(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Could not validate session_token"), rr.Body.String())
}

func TestLogoutErrSessionTokenUnexpected(t *testing.T) {
	rr, mock, cleanup := setupLogoutTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id FROM sessions WHERE .+").WillReturnError(assert.AnError)

	req, err := http.NewRequest("POST", "", strings.NewReader("session_token=test"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	Logout(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, user.ErrUnexpected), rr.Body.String())
}

func TestLogoutErrDeleteToken(t *testing.T) {
	rr, mock, cleanup := setupLogoutTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id FROM sessions WHERE .+").WillReturnRows(
		sqlmock.NewRows([]string{"user_id"}).AddRow(1),
	)

	mock.ExpectExec("DELETE FROM sessions WHERE .+").WillReturnError(assert.AnError)

	req, err := http.NewRequest("POST", "", strings.NewReader("session_token=test"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	Logout(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, user.ErrUnexpected), rr.Body.String())
}

func TestLogoutSuccess(t *testing.T) {
	rr, mock, cleanup := setupLogoutTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id FROM sessions WHERE .+").WillReturnRows(
		sqlmock.NewRows([]string{"user_id"}).AddRow(1),
	)

	mock.ExpectExec("DELETE FROM sessions WHERE .+").WillReturnResult(sqlmock.NewResult(1, 1))

	req, err := http.NewRequest("POST", "", strings.NewReader("session_token=test"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	Logout(rr, req)
	assert.JSONEq(t, `{"data": null, "error": null}`, rr.Body.String())
}
