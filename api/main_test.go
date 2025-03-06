package main

import (
	"os"
	"testing"

	"github.com/Dobefu/cms/api/cmd/logger"
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

	osExit = func(code int) {
		isOsExitCalled = true
	}

	return func() {
		loggerFatal = logger.Fatal
		osExit = os.Exit
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
