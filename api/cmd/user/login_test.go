package user

import (
	"database/sql"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func setupLoginTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestLoginErrMissingCredentials(t *testing.T) {
	_, cleanup := setupLoginTests(t)
	defer cleanup()

	err := Login("", "")
	assert.EqualError(t, err, ErrMissingCredentials.Error())
}

func TestLoginErrInternalServerError(t *testing.T) {
	mock, cleanup := setupLoginTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM users WHERE .+ LIMIT 1").WillReturnError(assert.AnError)

	err := Login("Username", "Password")
	assert.EqualError(t, err, ErrUnexpected.Error())
}

func TestLoginErrInvalidUser(t *testing.T) {
	mock, cleanup := setupLoginTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM users WHERE .+ LIMIT 1").WillReturnError(sql.ErrNoRows)

	err := Login("bogus", "bogus")
	assert.EqualError(t, err, ErrCredentials.Error())
}

func TestLoginErrInvalidPassword(t *testing.T) {
	mock, cleanup := setupLoginTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM users WHERE .+ LIMIT 1").WillReturnRows(
		sqlmock.NewRows([]string{"id", "password"}).AddRow(0, ""),
	)

	err := Login("test", "bogus")
	assert.EqualError(t, err, ErrCredentials.Error())
}

func TestLoginErrSetLastUpdated(t *testing.T) {
	mock, cleanup := setupLoginTests(t)
	defer cleanup()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("test"), 12)
	assert.NoError(t, err)

	mock.ExpectQuery("SELECT .+ FROM users WHERE .+ LIMIT 1").WillReturnRows(
		sqlmock.NewRows([]string{"id", "password"}).AddRow(1, hashedPassword),
	)

	mock.ExpectExec("UPDATE users SET last_login = .+").WillReturnError(assert.AnError)

	err = Login("test", "test")
	assert.EqualError(t, err, ErrUnexpected.Error())
}

func TestLoginErrUpdateSessionToken(t *testing.T) {
	mock, cleanup := setupLoginTests(t)
	defer cleanup()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("test"), 12)
	assert.NoError(t, err)

	mock.ExpectQuery("SELECT .+ FROM users WHERE .+ LIMIT 1").WillReturnRows(
		sqlmock.NewRows([]string{"id", "password"}).AddRow(1, hashedPassword),
	)

	mock.ExpectExec("UPDATE users SET last_login = .+").WillReturnResult(sqlmock.NewResult(1, 1))

	err = Login("test", "test")
	assert.EqualError(t, err, ErrUnexpected.Error())
}

func TestLoginSuccess(t *testing.T) {
	mock, cleanup := setupLoginTests(t)
	defer cleanup()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("test"), 12)
	assert.NoError(t, err)

	mock.ExpectQuery("SELECT .+ FROM users WHERE .+ LIMIT 1").WillReturnRows(
		sqlmock.NewRows([]string{"id", "password"}).AddRow(1, hashedPassword),
	)

	mock.ExpectExec("UPDATE users SET last_login = .+").WillReturnResult(sqlmock.NewResult(1, 1))

	mock.ExpectExec("INSERT INTO sessions .+ ON CONFLICT(.+) DO .+").WillReturnResult(
		sqlmock.NewResult(1, 1),
	)

	err = Login("test", "test")
	assert.NoError(t, err)
}
