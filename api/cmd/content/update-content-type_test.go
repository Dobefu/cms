package content

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
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

	id, err := UpdateContentType(1, "")
	assert.EqualError(t, err, "Missing title")
	assert.Equal(t, 0, id)
}

func TestUpdateContentTypeSuccess(t *testing.T) {
	_, cleanup := setupUpdateContentTypeTests(t)
	defer cleanup()

	id, err := UpdateContentType(1, "Title")
	assert.NoError(t, err)
	assert.Equal(t, 1, id)
}
