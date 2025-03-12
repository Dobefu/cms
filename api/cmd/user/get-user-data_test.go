package user

import (
	"database/sql"
	"testing"
	"time"

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

	userData, err := GetUserData(-1)
	assert.EqualError(t, err, "Could not get user data")
	assert.Empty(t, userData)
}

func TestGetUserDataErrUnexpected(t *testing.T) {
	mock, cleanup := setupGetUserDataTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM users WHERE .+ LIMIT 1").WillReturnError(assert.AnError)

	userData, err := GetUserData(1)
	assert.EqualError(t, err, ErrUnexpected.Error())
	assert.Empty(t, userData)
}

func TestGetUserDataSuccess(t *testing.T) {
	mock, cleanup := setupGetUserDataTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM users WHERE .+ LIMIT 1").WillReturnRows(
		sqlmock.NewRows(
			[]string{
				"id",
				"username",
				"email",
				"status",
				"created_at",
				"updated_at",
				"last_login",
			},
		).AddRow(
			1,
			"test-username",
			"test-email",
			true,
			time.Time{},
			time.Time{},
			time.Time{},
		),
	)

	userData, err := GetUserData(1)
	assert.NoError(t, err)
	assert.NotNil(t, userData)
}
