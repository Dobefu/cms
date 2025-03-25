package content

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupCreateContentTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestCreateContentErrMissingTitle(t *testing.T) {
	_, cleanup := setupCreateContentTests(t)
	defer cleanup()

	id, err := CreateContent(1, 1, "", true)
	assert.EqualError(t, err, "Missing title")
	assert.Equal(t, 0, id)
}

func TestCreateContentErrInsert(t *testing.T) {
	_, cleanup := setupCreateContentTests(t)
	defer cleanup()

	id, err := CreateContent(1, 1, "Title", true)
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, 0, id)
}

func TestCreateContentErrScan(t *testing.T) {
	mock, cleanup := setupCreateContentTests(t)
	defer cleanup()

	mock.ExpectQuery("INSERT INTO content (.+) VALUES (.+) RETURNING id").WillReturnRows(
		sqlmock.NewRows([]string{"id"}).AddRow("bogus"),
	)

	id, err := CreateContent(1, 1, "Title", true)
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, 0, id)
}

func TestCreateContentSuccess(t *testing.T) {
	mock, cleanup := setupCreateContentTests(t)
	defer cleanup()

	mock.ExpectQuery("INSERT INTO content (.+) VALUES (.+) RETURNING id").WillReturnRows(
		sqlmock.NewRows([]string{"id"}).AddRow(1),
	)

	id, err := CreateContent(1, 1, "Title", true)
	assert.NoError(t, err)
	assert.Equal(t, 1, id)
}
