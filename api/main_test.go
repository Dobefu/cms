package main

import (
	"errors"
	"os"
	"testing"

	"github.com/Dobefu/cms/api/cmd/logger"
	"github.com/Dobefu/cms/api/cmd/server"
	"github.com/stretchr/testify/assert"
)

var (
	isOsExitCalled      bool
	isLoggerFatalCalled bool
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
	serverInit = func(port uint) (err error) { return nil }

	return func() {
		loggerFatal = logger.Fatal
		osExit = os.Exit
		serverInit = server.Init
		os.Args = oldOsArgs
	}
}

func TestMainNoArguments(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	main()
	assert.True(t, isOsExitCalled)
}

func TestMainWithSubCommandErr(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "bogus"}

	main()
	assert.True(t, isOsExitCalled)
}

func TestMainWithSubCommandVerbose(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "--verbose"}

	main()
	assert.True(t, isOsExitCalled)
}

func TestMainWithSubCommandQuiet(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "--quiet"}

	main()
	assert.True(t, isOsExitCalled)
}

func TestMainWithSubCommandServerErrFlag(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "server", "--bogus"}

	main()
	assert.True(t, isLoggerFatalCalled)
}

func TestMainWithSubCommandServerErr(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	serverInit = func(port uint) (err error) { return errors.New("server subcommand test error") }
	os.Args = []string{os.Args[0], "server"}

	main()
	assert.True(t, isLoggerFatalCalled)
}

func TestMainWithSubCommandServer(t *testing.T) {
	cleanup := setupMainTests()
	defer cleanup()

	os.Args = []string{os.Args[0], "server"}

	main()
	assert.False(t, isLoggerFatalCalled)
}
