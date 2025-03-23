package content

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupDeleteContentTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	return mock, func() {
		db.Close()
		database.DB = oldDb
	}
}

func TestDeleteContentErrDelete(t *testing.T) {
	_, cleanup := setupDeleteContentTests(t)
	defer cleanup()

	err := DeleteContent(1)
	assert.EqualError(t, err, user.ErrUnexpected.Error())
}

func TestDeleteContentSuccess(t *testing.T) {
	mock, cleanup := setupDeleteContentTests(t)
	defer cleanup()

	mock.ExpectExec("DELETE FROM content WHERE .+").WillReturnResult(
		sqlmock.NewResult(1, 1),
	)

	err := DeleteContent(1)
	assert.NoError(t, err)
}
