package content_type

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	content_type_structs "github.com/Dobefu/cms/api/cmd/content_type/structs"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupGetContentTypesTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestGetContentTypesErrSelect(t *testing.T) {
	_, cleanup := setupGetContentTypesTests(t)
	defer cleanup()

	contentTypes, err := GetContentTypes()
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, []content_type_structs.ContentType(nil), contentTypes)
}

func TestGetContentTypesErrScan(t *testing.T) {
	mock, cleanup := setupGetContentTypesTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT id,title,created_at,updated_at FROM content_types").WillReturnRows(
		sqlmock.NewRows([]string{"id", "title", "", ""}).AddRow("bogus", "Title", "", ""),
	)

	contentTypes, err := GetContentTypes()
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, []content_type_structs.ContentType(nil), contentTypes)
}

func TestGetContentTypesSuccess(t *testing.T) {
	mock, cleanup := setupGetContentTypesTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT id,title,created_at,updated_at FROM content_types").WillReturnRows(
		sqlmock.NewRows([]string{"id", "title", "created_at", "updated_at"}).AddRow(1, "Title", "", ""),
	)

	contentTypes, err := GetContentTypes()
	assert.NoError(t, err)
	assert.Equal(t, []content_type_structs.ContentType{{Id: 1, Title: "Title", CreatedAt: "", UpdatedAt: ""}}, contentTypes)
}
