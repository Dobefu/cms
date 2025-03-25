package content

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	content_structs "github.com/Dobefu/cms/api/cmd/content/structs"
	content_type_structs "github.com/Dobefu/cms/api/cmd/content_type/structs"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupGetContentTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestGetContentErrSelect(t *testing.T) {
	_, cleanup := setupGetContentTests(t)
	defer cleanup()

	content, err := GetContent()
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, []content_structs.Content(nil), content)
}

func TestGetContentErrScan(t *testing.T) {
	mock, cleanup := setupGetContentTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM content .+").WillReturnRows(
		sqlmock.NewRows([]string{"c.id", "ct.title", "ct.created_at", "ct.updated_at", "title", "", ""}).AddRow("bogus", "", "", "", "Title", "", ""),
	)

	content, err := GetContent()
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, []content_structs.Content(nil), content)
}

func TestGetContentSuccess(t *testing.T) {
	mock, cleanup := setupGetContentTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM content .+").WillReturnRows(
		sqlmock.NewRows([]string{"c.id", "ct.title", "ct.created_at", "ct.updated_at", "title", "", "", "published"}).AddRow(1, "", "", "", "Title", "", "", true),
	)

	content, err := GetContent()
	assert.NoError(t, err)
	assert.Equal(t, []content_structs.Content{{Id: 1, ContentType: content_type_structs.ContentType{Id: 1}, Title: "Title", CreatedAt: "", UpdatedAt: "", Published: true}}, content)
}
