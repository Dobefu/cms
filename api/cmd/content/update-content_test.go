package content

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupUpdateContentTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestUpdateContentErrMissingTitle(t *testing.T) {
	_, cleanup := setupUpdateContentTests(t)
	defer cleanup()

	err := UpdateContent(1, 1, "")
	assert.EqualError(t, err, "Missing title")
}

func TestUpdateContentErrInsert(t *testing.T) {
	_, cleanup := setupUpdateContentTests(t)
	defer cleanup()

	err := UpdateContent(1, 1, "Title")
	assert.EqualError(t, err, user.ErrUnexpected.Error())
}

func TestUpdateContentSuccess(t *testing.T) {
	mock, cleanup := setupUpdateContentTests(t)
	defer cleanup()

	mock.ExpectExec("UPDATE content SET (.+) = (.+) WHERE .+").WillReturnResult(
		sqlmock.NewResult(1, 1),
	)

	err := UpdateContent(1, 1, "Title")
	assert.NoError(t, err)
}
