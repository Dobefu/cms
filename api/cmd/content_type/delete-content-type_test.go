package content_type

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupDeleteContentTypeTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestDeleteContentTypeErrDelete(t *testing.T) {
	_, cleanup := setupDeleteContentTypeTests(t)
	defer cleanup()

	err := DeleteContentType(1)
	assert.EqualError(t, err, user.ErrUnexpected.Error())
}

func TestDeleteContentTypeSuccess(t *testing.T) {
	mock, cleanup := setupDeleteContentTypeTests(t)
	defer cleanup()

	mock.ExpectExec("DELETE FROM content_types WHERE .+").WillReturnResult(
		sqlmock.NewResult(1, 1),
	)

	err := DeleteContentType(1)
	assert.NoError(t, err)
}
