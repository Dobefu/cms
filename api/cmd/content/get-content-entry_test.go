package content

import (
	"database/sql"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	content_structs "github.com/Dobefu/cms/api/cmd/content/structs"
	content_type_structs "github.com/Dobefu/cms/api/cmd/content_type/structs"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupGetContentEntryTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestGetContentEntryErrSelect(t *testing.T) {
	_, cleanup := setupGetContentEntryTests(t)
	defer cleanup()

	content, err := GetContentEntry(1)
	assert.EqualError(t, err, user.ErrUnexpected.Error())
	assert.Equal(t, content_structs.Content{}, content)
}

func TestGetContentEntryErrScanNoRows(t *testing.T) {
	mock, cleanup := setupGetContentEntryTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM content .+").WillReturnError(sql.ErrNoRows)

	_, err := GetContentEntry(1)
	assert.EqualError(t, err, "Cannot find the content")
}

func TestGetContentEntryErrScanUnexpected(t *testing.T) {
	mock, cleanup := setupGetContentEntryTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM content .+").WillReturnRows(
		sqlmock.NewRows([]string{"c.id", "ct.title", "ct.created_at", "ct.updated_at", "title", "", ""}).AddRow("bogus", "", "", "", "Title", "", ""),
	)

	_, err := GetContentEntry(1)
	assert.EqualError(t, err, user.ErrUnexpected.Error())
}

func TestGetContentEntrySuccess(t *testing.T) {
	mock, cleanup := setupGetContentEntryTests(t)
	defer cleanup()

	mock.ExpectQuery("SELECT .+ FROM content .+").WillReturnRows(
		sqlmock.NewRows([]string{"c.id", "ct.title", "ct.created_at", "ct.updated_at", "title", "", ""}).AddRow(1, "", "", "", "Title", "", ""),
	)

	content, err := GetContentEntry(1)
	assert.NoError(t, err)
	assert.Equal(t, content_structs.Content{Id: 1, ContentType: content_type_structs.ContentType{Id: 1}, Title: "Title", CreatedAt: "", UpdatedAt: ""}, content)
}
