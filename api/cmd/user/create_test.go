package user

import (
	"database/sql"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/stretchr/testify/assert"
)

func setupCreateTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestCreateErrHashPassword(t *testing.T) {
	_, cleanup := setupCreateTests(t)
	defer cleanup()

	err := Create(
		"Username",
		"email@example.com",
		"test-password-that-exceeds-72-characters-and-will-therefore-cause-an-error",
		true,
	)
	assert.Error(t, err)
}

func TestCreateErrExec(t *testing.T) {
	mock, cleanup := setupCreateTests(t)
	defer cleanup()

	mock.ExpectExec("INSERT INTO users (.+) VALUES (.+)").WillReturnError(sql.ErrNoRows)

	err := Create("Username", "email@example.com", "test-password", true)
	assert.Error(t, err)
}

func TestCreate(t *testing.T) {
	mock, cleanup := setupCreateTests(t)
	defer cleanup()

	mock.ExpectExec("INSERT INTO users (.+) VALUES (.+)").WillReturnResult(sqlmock.NewResult(1, 1))

	err := Create("Username", "email@example.com", "test-password", true)
	assert.NoError(t, err)
}
