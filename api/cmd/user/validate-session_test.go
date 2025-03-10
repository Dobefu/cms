package user

import (
	"database/sql"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/stretchr/testify/assert"
)

func setupValidateSessionTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestValidateSessionErrMissingSessionToken(t *testing.T) {
	_, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	newToken, err := ValidateSession("")
	assert.EqualError(t, err, "Missing session token")
	assert.Equal(t, newToken, "")
}

func TestValidateSessionErrInvalidSessionToken(t *testing.T) {
	mock, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id, token, updated_at FROM sessions WHERE .+").WillReturnError(sql.ErrNoRows)

	newToken, err := ValidateSession("bogus")
	assert.EqualError(t, err, "Could not validate session_token")
	assert.Equal(t, newToken, "bogus")
}

func TestValidateSessionErrSessionTokenUnexpected(t *testing.T) {
	mock, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id, token, updated_at FROM sessions WHERE .+").WillReturnError(assert.AnError)

	newToken, err := ValidateSession("test")
	assert.EqualError(t, err, ErrUnexpected.Error())
	assert.Equal(t, newToken, "test")
}

func TestValidateSessionErrUpdateToken(t *testing.T) {
	mock, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id, token, updated_at FROM sessions WHERE .+").WillReturnRows(
		sqlmock.NewRows([]string{"user_id", "token", "updated_at"}).AddRow(1, "test", time.Now().Add(-360*time.Second)),
	)

	mock.ExpectExec("INSERT INTO sessions .+ ON CONFLICT(.+) DO .+").WillReturnError(assert.AnError)

	newToken, err := ValidateSession("test")
	assert.EqualError(t, err, ErrUnexpected.Error())
	assert.Equal(t, newToken, "test")
}

func TestValidateSessionErrUpdateTokenDatabase(t *testing.T) {
	mock, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id, token, updated_at FROM sessions WHERE .+").WillReturnRows(
		sqlmock.NewRows([]string{"user_id", "token", "updated_at"}).AddRow(1, "test", time.Now().Add(-360*time.Second)),
	)

	mock.ExpectExec("INSERT INTO sessions .+ ON CONFLICT(.+) DO .+").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec("UPDATE sessions SET .+").WillReturnError(assert.AnError)

	newToken, err := ValidateSession("test")
	assert.EqualError(t, err, ErrUnexpected.Error())
	assert.Equal(t, newToken, "test")
}

func TestValidateSessionSuccess(t *testing.T) {
	mock, cleanup := setupValidateSessionTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT user_id, token, updated_at FROM sessions WHERE .+").WillReturnRows(
		sqlmock.NewRows([]string{"user_id", "token", "updated_at"}).AddRow(1, "test", time.Now().Add(-360*time.Second)),
	)

	mock.ExpectExec("INSERT INTO sessions .+ ON CONFLICT(.+) DO .+").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec("UPDATE sessions SET .+").WillReturnResult(sqlmock.NewResult(1, 1))

	newToken, err := ValidateSession("test")
	assert.NoError(t, err)
	assert.NotEqual(t, newToken, "test")
}
