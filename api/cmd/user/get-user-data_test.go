package user

import (
	"database/sql"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/stretchr/testify/assert"
)

func setupGetUserDataTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestGetUserDataErrNoUser(t *testing.T) {
	mock, cleanup := setupGetUserDataTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM users WHERE .+ LIMIT 1").WillReturnError(sql.ErrNoRows)

	err := GetUserData(-1)
	assert.EqualError(t, err, "Could not get user data")
}

func TestGetUserDataErrUnexpected(t *testing.T) {
	mock, cleanup := setupGetUserDataTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM users WHERE .+ LIMIT 1").WillReturnError(assert.AnError)

	err := GetUserData(1)
	assert.EqualError(t, err, ErrUnexpected.Error())
}

func TestGetUserDataSuccess(t *testing.T) {
	mock, cleanup := setupGetUserDataTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT username FROM users WHERE .+ LIMIT 1").WillReturnRows(sqlmock.NewRows([]string{"username"}).AddRow("test-username"))

	err := GetUserData(1)
	assert.NoError(t, err)
}
