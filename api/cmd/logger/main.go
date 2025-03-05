package logger

import (
	"fmt"
	"os"
	"time"

	"github.com/Dobefu/cms/api/cmd/color"
)

var osExit = os.Exit

var (
	LOG_VERBOSE byte = 0
	LOG_INFO    byte = 1
	LOG_WARNING byte = 2
	LOG_ERROR   byte = 3
	LOG_FATAL   byte = 4
)

var LOGLEVEL byte = LOG_INFO
var EXIT_ON_FATAL = true

func logMessage(level byte, format string, a ...any) string {
	if level < LOGLEVEL {
		return ""
	}

	timestamp := time.Now().Format(time.DateTime)
	timestamp = fmt.Sprintf("[%s]", timestamp)
	var str string

	switch level {
	case LOG_VERBOSE:
		str = fmt.Sprintf(color.SprintColor(color.FgDarkGray, color.BgDefault, "  %s"), format)
	case LOG_INFO:
		str = fmt.Sprintf(color.SprintColor(color.FgLightCyan, color.BgDefault, "ℹ %s"), format)
	case LOG_WARNING:
		str = fmt.Sprintf(color.SprintColor(color.FgYellow, color.BgDefault, "⚠ %s"), format)
	case LOG_ERROR:
		str = fmt.Sprintf(color.SprintColor(color.FgLightRed, color.BgDefault, "‼ %s"), format)
	case LOG_FATAL:
		str = fmt.Sprintf(color.SprintColor(color.FgRed, color.BgDefault, "‼ %s"), format)
	default:
		str = format
	}

	str = fmt.Sprintf("%s %s\n", color.SprintColor(color.FgDarkGray, color.BgDefault, timestamp), str)
	output := fmt.Sprintf(str, a...)

	fmt.Print(output)
	return output
}

func Verbose(format string, a ...any) string {
	return logMessage(LOG_VERBOSE, format, a...)
}

func Info(format string, a ...any) string {
	return logMessage(LOG_INFO, format, a...)
}

func Warning(format string, a ...any) string {
	return logMessage(LOG_WARNING, format, a...)
}

func Error(format string, a ...any) string {
	return logMessage(LOG_ERROR, format, a...)
}

func Fatal(format string, a ...any) string {
	output := logMessage(LOG_FATAL, format, a...)

	if EXIT_ON_FATAL {
		osExit(1)
	}

	return output
}

func SetLogLevel(level byte) {
	LOGLEVEL = level
}

func SetExitOnFatal(value bool) {
	EXIT_ON_FATAL = value
}
