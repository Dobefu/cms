package v1

import (
	"database/sql"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func setupLoginTests(t *testing.T) (rr *httptest.ResponseRecorder, mock sqlmock.Sqlmock, cleanup func()) {
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

func TestLoginErrMissingBody(t *testing.T) {
	rr, _, cleanup := setupLoginTests(t)
	defer cleanup()

	req, err := http.NewRequest("POST", "", nil)
	assert.NoError(t, err)

	Login(rr, req)
	assert.JSONEq(t, `{"data": null, "error": "Internal server error"}`, rr.Body.String())
}

func TestLoginErrMissingCredentials(t *testing.T) {
	rr, _, cleanup := setupLoginTests(t)
	defer cleanup()

	req, err := http.NewRequest("POST", "", strings.NewReader(""))
	assert.NoError(t, err)

	Login(rr, req)
	assert.JSONEq(t, `{"data": null, "error": "Missing username and/ or password"}`, rr.Body.String())
}

func TestLoginErrInternalServerError(t *testing.T) {
	rr, mock, cleanup := setupLoginTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT password FROM users WHERE .+ LIMIT 1").WillReturnError(assert.AnError)

	req, err := http.NewRequest("POST", "", strings.NewReader("username=bogus&password=bogus"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	Login(rr, req)
	assert.JSONEq(t, `{"data": null, "error": "Internal server error"}`, rr.Body.String())
}

func TestLoginErrInvalidUser(t *testing.T) {
	rr, mock, cleanup := setupLoginTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT password FROM users WHERE .+ LIMIT 1").WillReturnError(sql.ErrNoRows)

	req, err := http.NewRequest("POST", "", strings.NewReader("username=bogus&password=bogus"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	Login(rr, req)
	assert.JSONEq(t, `{"data": null, "error": "Invalid username or password"}`, rr.Body.String())
}

func TestLoginErrInvalidPassword(t *testing.T) {
	rr, mock, cleanup := setupLoginTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT password FROM users WHERE .+ LIMIT 1").WillReturnRows(sqlmock.NewRows([]string{"password"}).AddRow(""))

	req, err := http.NewRequest("POST", "", strings.NewReader("username=test&password=bogus"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	Login(rr, req)
	assert.JSONEq(t, `{"data": null, "error": "Invalid username or password"}`, rr.Body.String())
}

func TestLoginSuccess(t *testing.T) {
	rr, mock, cleanup := setupLoginTests(t)
	defer cleanup()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("test"), 12)
	assert.NoError(t, err)

	mock.ExpectQuery("SELECT password FROM users WHERE .+ LIMIT 1").WillReturnRows(
		sqlmock.NewRows([]string{"password"}).AddRow(hashedPassword),
	)

	req, err := http.NewRequest("POST", "", strings.NewReader("username=test&password=test"))
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	Login(rr, req)
	assert.JSONEq(t, `{"data":null,"error":null}`, rr.Body.String())
}
