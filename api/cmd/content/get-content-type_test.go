package content

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	content_structs "github.com/Dobefu/cms/api/cmd/content/structs"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupGetContentTypeTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestGetContentTypeErrSelect(t *testing.T) {
	_, cleanup := setupGetContentTypeTests(t)
	defer cleanup()

	contentType, err := GetContentType(1)
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, content_structs.ContentType{}, contentType)
}

func TestGetContentTypeErrScan(t *testing.T) {
	mock, cleanup := setupGetContentTypeTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT id,title,created_at,updated_at FROM content_types").WillReturnRows(
		sqlmock.NewRows([]string{"id", "title", "created_at", "updated_at"}).AddRow("bogus", "Title", "", ""),
	)

	_, err := GetContentType(1)
	assert.EqualError(t, err, user.ErrUnexpected.Error())
}

func TestGetContentTypeSuccess(t *testing.T) {
	mock, cleanup := setupGetContentTypeTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT id,title,created_at,updated_at FROM content_types").WillReturnRows(
		sqlmock.NewRows([]string{"id", "title", "created_at", "updated_at"}).AddRow(1, "Title", "", ""),
	)

	contentType, err := GetContentType(1)
	assert.NoError(t, err)
	assert.Equal(t, content_structs.ContentType{Id: 1, Title: "Title", CreatedAt: "", UpdatedAt: ""}, contentType)
}
