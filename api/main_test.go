package main

import (
	"context"
	"errors"
	"os"
	"testing"

	"github.com/Dobefu/cms/api/cmd/cli"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/logger"
	"github.com/Dobefu/cms/api/cmd/migrate_db"
	"github.com/Dobefu/cms/api/cmd/server"
	"github.com/stretchr/testify/assert"
)

var (
	isOsExitCalled      bool
	isLoggerFatalCalled bool
	envFile             = "--env-file=.env.example"
)

func setupMainTests() (cleanup func()) {
	isOsExitCalled = false
	isLoggerFatalCalled = false
	oldOsArgs := os.Args

	loggerFatal = func(format string, a ...any) string {
		isLoggerFatalCalled = true
		return ""
	}

	osExit = func(code int) { isOsExitCalled = true }
	serverInit = func(port uint, ctx context.Context) (err error) { return nil }
	migrateDbMain = func(reset bool) error { return nil }
	databaseConnect = func() error { return nil }
	dbPing = func() error { return nil }
	cliCreateUser = func(username string, email string, password string) (err error) {
		return nil
	}

	return func() {
		loggerFatal = logger.Fatal
		osExit = os.Exit
		serverInit = server.Init
		migrateDbMain = migrate_db.Main
		dbPing = func() error { return database.DB.Ping() }
		cliCreateUser = cli.CreateUser
		os.Args = oldOsArgs
	}
}

func TestMainNoArguments(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], envFile}

	main()
	assert.True(t, isOsExitCalled)
}

func TestMainErrDatabaseConnect(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	databaseConnect = func() error { return assert.AnError }
	os.Args = []string{os.Args[0], "bogus", envFile}

	main()
	assert.True(t, isOsExitCalled)
}

func TestMainErrDbPing(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	dbPing = func() error { return assert.AnError }
	os.Args = []string{os.Args[0], "bogus", envFile}

	main()
	assert.True(t, isOsExitCalled)
}

func TestMainWithSubCommandErr(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "bogus", envFile}

	main()
	assert.True(t, isOsExitCalled)
}

func TestMainWithSubCommandVerbose(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "--verbose", envFile}

	main()
	assert.True(t, isOsExitCalled)
}

func TestMainWithSubCommandQuiet(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "--quiet", envFile}

	main()
	assert.True(t, isOsExitCalled)
}

func TestMainWithSubCommandServerErrFlag(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "server", "--bogus", envFile}

	main()
	assert.True(t, isLoggerFatalCalled)
}

func TestMainWithSubCommandServerErr(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	serverInit = func(port uint, ctx context.Context) (err error) { return errors.New("server subcommand test error") }
	os.Args = []string{os.Args[0], "server", envFile}

	main()
	assert.True(t, isLoggerFatalCalled)
}

func TestMainWithSubCommandServer(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "server", envFile}

	main()
	assert.False(t, isLoggerFatalCalled)
}

func TestMainWithSubCommandMigrateErr(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	migrateDbMain = func(reset bool) error { return assert.AnError }
	os.Args = []string{os.Args[0], "migrate", envFile}

	main()
	assert.True(t, isLoggerFatalCalled)
}

func TestMainWithSubCommandMigrateErrFlag(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "migrate", "--bogus", envFile}

	main()
	assert.True(t, isLoggerFatalCalled)
}

func TestMainWithSubCommandUserCreateErr(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	cliCreateUser = func(username string, email string, password string) (err error) {
		return assert.AnError
	}
	os.Args = []string{os.Args[0], "user:create", envFile}

	main()
	assert.True(t, isLoggerFatalCalled)
}

func TestMainWithSubCommandUserCreateErrFlag(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "user:create", "--bogus", envFile}

	main()
	assert.True(t, isLoggerFatalCalled)
}
