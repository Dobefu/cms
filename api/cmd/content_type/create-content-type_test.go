package content_type

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupCreateContentTypeTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestCreateContentTypeErrMissingTitle(t *testing.T) {
	_, cleanup := setupCreateContentTypeTests(t)
	defer cleanup()

	id, err := CreateContentType(1, "")
	assert.EqualError(t, err, "Missing title")
	assert.Equal(t, 0, id)
}

func TestCreateContentTypeErrInsert(t *testing.T) {
	_, cleanup := setupCreateContentTypeTests(t)
	defer cleanup()

	id, err := CreateContentType(1, "Title")
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, 0, id)
}

func TestCreateContentTypeErrScan(t *testing.T) {
	mock, cleanup := setupCreateContentTypeTests(t)
	defer cleanup()

	mock.ExpectQuery("INSERT INTO content_types (.+) VALUES (.+) RETURNING id").WillReturnRows(
		sqlmock.NewRows([]string{"id"}).AddRow("bogus"),
	)

	id, err := CreateContentType(1, "Title")
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, 0, id)
}

func TestCreateContentTypeSuccess(t *testing.T) {
	mock, cleanup := setupCreateContentTypeTests(t)
	defer cleanup()

	mock.ExpectQuery("INSERT INTO content_types (.+) VALUES (.+) RETURNING id").WillReturnRows(
		sqlmock.NewRows([]string{"id"}).AddRow(1),
	)

	id, err := CreateContentType(1, "Title")
	assert.NoError(t, err)
	assert.Equal(t, 1, id)
}
