package content

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

	id, err := UpdateContentType(1, "")
	assert.EqualError(t, err, "Missing title")
	assert.Equal(t, 0, id)
}

func TestUpdateContentTypeErrInsert(t *testing.T) {
	_, cleanup := setupUpdateContentTypeTests(t)
	defer cleanup()

	id, err := UpdateContentType(1, "Title")
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, 0, id)
}

func TestUpdateContentTypeErrScan(t *testing.T) {
	mock, cleanup := setupUpdateContentTypeTests(t)
	defer cleanup()

	mock.ExpectQuery("INSERT INTO content_types (.+) VALUES (.+) RETURNING id").WillReturnRows(
		sqlmock.NewRows([]string{"id"}).AddRow("bogus"),
	)

	id, err := UpdateContentType(1, "Title")
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, 0, id)
}

func TestUpdateContentTypeSuccess(t *testing.T) {
	mock, cleanup := setupUpdateContentTypeTests(t)
	defer cleanup()

	mock.ExpectQuery("INSERT INTO content_types (.+) VALUES (.+) RETURNING id").WillReturnRows(
		sqlmock.NewRows([]string{"id"}).AddRow(1),
	)

	id, err := UpdateContentType(1, "Title")
	assert.NoError(t, err)
	assert.Equal(t, 1, id)
}
