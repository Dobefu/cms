package content_type

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupUpdateContentTypeTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestUpdateContentTypeErrMissingTitle(t *testing.T) {
	_, cleanup := setupUpdateContentTypeTests(t)
	defer cleanup()

	err := UpdateContentType(1, 1, "")
	assert.EqualError(t, err, "Missing title")
}

func TestUpdateContentTypeErrInsert(t *testing.T) {
	_, cleanup := setupUpdateContentTypeTests(t)
	defer cleanup()

	err := UpdateContentType(1, 1, "Title")
	assert.EqualError(t, err, user.ErrUnexpected.Error())
}

func TestUpdateContentTypeSuccess(t *testing.T) {
	mock, cleanup := setupUpdateContentTypeTests(t)
	defer cleanup()

	mock.ExpectExec("UPDATE content_types SET (.+) = (.+) WHERE .+").WillReturnResult(
		sqlmock.NewResult(1, 1),
	)

	err := UpdateContentType(1, 1, "Title")
	assert.NoError(t, err)
}
