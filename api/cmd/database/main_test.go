package database

import (
	"database/sql"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func setupDatabaseTest() func() {
	sqlOpen = func(driverName, dataSourceName string) (*sql.DB, error) {
		return nil, nil
	}

	return func() {
		sqlOpen = sql.Open

		os.Unsetenv("DB_CONN")
	}
}

func TestConnectSuccess(t *testing.T) {
	cleanup := setupDatabaseTest()
	defer cleanup()

	os.Setenv("DB_CONN", "test-conn")

	err := Connect()
	assert.NoError(t, err)
}

func TestConnectErrNoConn(t *testing.T) {
	cleanup := setupDatabaseTest()
	defer cleanup()

	err := Connect()
	assert.EqualError(t, err, "DB_CONN is not set")
}
