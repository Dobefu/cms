package logger

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLogMessage(t *testing.T) {
	SetLogLevel(LOG_FATAL)
	assert.NotEmpty(t, logMessage(255, "test"))
}

func TestLogVerbose(t *testing.T) {
	SetExitOnFatal(false)

	SetLogLevel(LOG_VERBOSE)
	assert.NotEmpty(t, Verbose("test"))
	SetLogLevel(LOG_INFO)
	assert.Empty(t, Verbose("test"))
	SetLogLevel(LOG_WARNING)
	assert.Empty(t, Verbose("test"))
	SetLogLevel(LOG_ERROR)
	assert.Empty(t, Verbose("test"))
	SetLogLevel(LOG_FATAL)
	assert.Empty(t, Verbose("test"))
}

func TestLogInfo(t *testing.T) {
	SetExitOnFatal(false)

	SetLogLevel(LOG_VERBOSE)
	assert.NotEmpty(t, Info("test"))
	SetLogLevel(LOG_INFO)
	assert.NotEmpty(t, Info("test"))
	SetLogLevel(LOG_WARNING)
	assert.Empty(t, Info("test"))
	SetLogLevel(LOG_ERROR)
	assert.Empty(t, Info("test"))
	SetLogLevel(LOG_FATAL)
	assert.Empty(t, Info("test"))
}

func TestLogWarning(t *testing.T) {
	SetExitOnFatal(false)

	SetLogLevel(LOG_VERBOSE)
	assert.NotEmpty(t, Warning("test"))
	SetLogLevel(LOG_INFO)
	assert.NotEmpty(t, Warning("test"))
	SetLogLevel(LOG_WARNING)
	assert.NotEmpty(t, Warning("test"))
	SetLogLevel(LOG_ERROR)
	assert.Empty(t, Warning("test"))
	SetLogLevel(LOG_FATAL)
	assert.Empty(t, Warning("test"))
}

func TestLogError(t *testing.T) {
	SetExitOnFatal(false)

	SetLogLevel(LOG_VERBOSE)
	assert.NotEmpty(t, Error("test"))
	SetLogLevel(LOG_INFO)
	assert.NotEmpty(t, Error("test"))
	SetLogLevel(LOG_WARNING)
	assert.NotEmpty(t, Error("test"))
	SetLogLevel(LOG_ERROR)
	assert.NotEmpty(t, Error("test"))
	SetLogLevel(LOG_FATAL)
	assert.Empty(t, Error("test"))
}

func TestLogFatal(t *testing.T) {
	SetExitOnFatal(false)

	SetLogLevel(LOG_VERBOSE)
	assert.NotEmpty(t, Fatal("test"))
	SetLogLevel(LOG_INFO)
	assert.NotEmpty(t, Fatal("test"))
	SetLogLevel(LOG_WARNING)
	assert.NotEmpty(t, Fatal("test"))
	SetLogLevel(LOG_ERROR)
	assert.NotEmpty(t, Fatal("test"))
	SetLogLevel(LOG_FATAL)
	assert.NotEmpty(t, Fatal("test"))
}

func TestLogFatalWithExit(t *testing.T) {
	SetExitOnFatal(true)
	isExitCalled := false

	osExit = func(code int) {
		isExitCalled = true
	}

	defer func() { osExit = os.Exit }()

	assert.NotEmpty(t, Fatal("test"))
	assert.True(t, isExitCalled, "os.Exit should have been called")
}
