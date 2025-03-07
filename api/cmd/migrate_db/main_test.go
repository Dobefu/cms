package migrate_db

import (
	"testing"
	"testing/fstest"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/stretchr/testify/assert"
)

func setupMigrateDbTests(t *testing.T) (mock sqlmock.Sqlmock, cleanup func()) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)

	oldDb := database.DB
	database.DB = db

	getFs = func() FS {
		return fstest.MapFS{
			"migrations/000001-test.down.sql": {Data: []byte("DROP TABLE IF EXISTS bogus")},
			"migrations/000001-test.up.sql":   {Data: []byte("CREATE TABLE IF NOT EXISTS bogus()")},
		}
	}

	return mock, func() {
		db.Close()
		database.DB = oldDb
		getFs = func() FS { return content }
	}
}

func TestMigrateDBErrCreateMigrationsTable(t *testing.T) {
	_, cleanup := setupMigrateDbTests(t)
	defer cleanup()

	err := Main(true)
	assert.Error(t, err)
}

func TestMigrateDBErrGetMigrationState(t *testing.T) {
	mock, cleanup := setupMigrateDbTests(t)
	defer cleanup()

	mock.ExpectExec("CREATE TABLE IF NOT EXISTS migrations(.+)").WillReturnResult(sqlmock.NewResult(1, 1))

	err := Main(true)
	assert.Error(t, err)
}

func TestMigrateDBErrRunMigration(t *testing.T) {
	mock, cleanup := setupMigrateDbTests(t)
	defer cleanup()

	mock.ExpectExec("CREATE TABLE IF NOT EXISTS migrations(.+)").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT .+ FROM migrations LIMIT 1").WillReturnRows(sqlmock.NewRows([]string{"version", "dirty"}).AddRow(1, false))

	err := Main(true)
	assert.Error(t, err)
}

func TestMigrateDBErrReadDirReset(t *testing.T) {
	mock, cleanup := setupMigrateDbTests(t)
	defer cleanup()

	mock.ExpectExec("CREATE TABLE IF NOT EXISTS migrations(.+)").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT .+ FROM migrations LIMIT 1").WillReturnRows(sqlmock.NewRows([]string{"version", "dirty"}).AddRow(1, false))

	getFs = func() FS {
		return fstest.MapFS{"bogus/000001-test.down.sql": {Data: []byte{}}}
	}

	err := Main(true)
	assert.Error(t, err)
}

func TestMigrateDBErrReadDir(t *testing.T) {
	mock, cleanup := setupMigrateDbTests(t)
	defer cleanup()

	mock.ExpectExec("CREATE TABLE IF NOT EXISTS migrations(.+)").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT .+ FROM migrations LIMIT 1").WillReturnRows(sqlmock.NewRows([]string{"version", "dirty"}).AddRow(1, false))

	getFs = func() FS {
		return fstest.MapFS{"bogus/000001-test.down.sql": {Data: []byte{}}}
	}

	err := Main(false)
	assert.Error(t, err)
}

func TestMigrateDBErrTruncate(t *testing.T) {
	mock, cleanup := setupMigrateDbTests(t)
	defer cleanup()

	mock.ExpectExec("CREATE TABLE IF NOT EXISTS migrations(.+)").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT .+ FROM migrations LIMIT 1").WillReturnRows(sqlmock.NewRows([]string{"version", "dirty"}).AddRow(-1, false))
	mock.ExpectExec("DROP TABLE IF EXISTS bogus").WillReturnResult(sqlmock.NewResult(1, 1))

	err := Main(true)
	assert.Error(t, err)
}

func TestMigrateDBErrFileInvalid(t *testing.T) {
	mock, cleanup := setupMigrateDbTests(t)
	defer cleanup()

	getFs = func() FS {
		return fstest.MapFS{
			"migrations/000001-test.down.sql": nil,
		}
	}

	mock.ExpectExec("CREATE TABLE IF NOT EXISTS migrations(.+)").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT .+ FROM migrations LIMIT 1").WillReturnRows(sqlmock.NewRows([]string{"version", "dirty"}).AddRow(1, false))

	err := Main(true)
	assert.Error(t, err)
}

func TestMigrateDBErrInsert(t *testing.T) {
	mock, cleanup := setupMigrateDbTests(t)
	defer cleanup()

	mock.ExpectExec("CREATE TABLE IF NOT EXISTS migrations(.+)").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT .+ FROM migrations LIMIT 1").WillReturnRows(sqlmock.NewRows([]string{"version", "dirty"}).AddRow(1, false))
	mock.ExpectExec("DROP TABLE IF EXISTS bogus").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec("TRUNCATE migrations").WillReturnResult(sqlmock.NewResult(1, 1))

	err := Main(true)
	assert.Error(t, err)
}

func TestMigrateDBErrSetMigrationState(t *testing.T) {
	mock, cleanup := setupMigrateDbTests(t)
	defer cleanup()

	mock.ExpectExec("CREATE TABLE IF NOT EXISTS migrations(.+)").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT .+ FROM migrations LIMIT 1").WillReturnRows(sqlmock.NewRows([]string{"version", "dirty"}).AddRow(2, false))
	mock.ExpectExec("DROP TABLE IF EXISTS bogus").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec("TRUNCATE migrations").WillReturnResult(sqlmock.NewResult(1, 1))

	err := Main(false)
	assert.Error(t, err)
}

func TestMigrateDBErrCreateTable(t *testing.T) {
	mock, cleanup := setupMigrateDbTests(t)
	defer cleanup()

	mock.ExpectExec("CREATE TABLE IF NOT EXISTS migrations(.+)").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT .+ FROM migrations LIMIT 1").WillReturnRows(sqlmock.NewRows([]string{"version", "dirty"}).AddRow(1, false))
	mock.ExpectExec("DROP TABLE IF EXISTS bogus").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec("TRUNCATE migrations").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec("INSERT INTO migrations (.+) VALUES (.+)").WillReturnResult(sqlmock.NewResult(1, 1))

	err := Main(true)
	assert.Error(t, err)
}

func TestMigrateDB(t *testing.T) {
	mock, cleanup := setupMigrateDbTests(t)
	defer cleanup()

	mock.ExpectExec("CREATE TABLE IF NOT EXISTS migrations(.+)").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT .+ FROM migrations LIMIT 1").WillReturnRows(sqlmock.NewRows([]string{"version", "dirty"}).AddRow(1, false))
	mock.ExpectExec("TRUNCATE migrations").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec("INSERT INTO migrations (.+) VALUES (.+)").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec("CREATE TABLE IF NOT EXISTS bogus()").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec("TRUNCATE migrations").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectExec("INSERT INTO migrations (.+) VALUES (.+)").WillReturnResult(sqlmock.NewResult(1, 1))

	err := Main(false)
	assert.NoError(t, err)
}
