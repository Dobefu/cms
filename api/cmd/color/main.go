package color

import (
	"fmt"
	"os"
)

const escape = "\x1b"

type Color int

const (
	Reset Color = iota
	Bold
	Dim
	Italic
	Underline
)

const (
	FgBlack Color = iota + 30
	FgRed
	FgGreen
	FgYellow
	FgBlue
	FgMagenta
	FgCyan
)

const (
	FgDarkGray Color = iota + 90
	FgLightRed
	FgLightGreen
	FgLightYellow
	FgLightBlue
	FgLightMagenta
	FgLightCyan
	FgWhite
)

const (
	BgDefault Color = iota + 49
	BgBlack
	BgRed
	BgGreen
	BgYellow
	BgBlue
	BgMagenta
	BgCyan
	BgLightGray
)

const (
	BgDarkGray Color = iota + 100
	BgLightRed
	BgLightGreen
	BgLightYellow
	BgLightBlue
	BgLightMagenta
	BgLightCyan
	BgWhite
)

func SprintColor(fg Color, bg Color, message string) string {
	fileInfo, _ := osStatFn()

	if (fileInfo.Mode() & os.ModeCharDevice) == 0 {
		return fmt.Sprint(message)
	}

	return fmt.Sprintf("%s[%d;%dm%s%s[0;0m", escape, fg, bg, message, escape)
}

func PrintfColor(fg Color, bg Color, format string, args ...any) {
	fmt.Print(SprintColor(fg, bg, fmt.Sprintf(format, args...)))
}

func PrintColor(fg Color, bg Color, message string) {
	PrintfColor(fg, bg, message, nil)
}
