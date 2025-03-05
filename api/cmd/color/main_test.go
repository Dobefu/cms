package color

import (
	"os"
	"syscall"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

type mockFileInfo struct{ modTime time.Time }

func (m mockFileInfo) Mode() os.FileMode  { return os.ModeCharDevice }
func (m mockFileInfo) ModTime() time.Time { return m.modTime }
func (m mockFileInfo) IsDir() bool        { return false }
func (m mockFileInfo) Name() string       { return "" }
func (m mockFileInfo) Size() int64        { return 0 }
func (m mockFileInfo) Sys() interface{} {
	return &syscall.Stat_t{Mode: syscall.S_IFCHR}
}

func TestSprintColor(t *testing.T) {
	oldStat := osStatFn

	osStatFn = func() (os.FileInfo, error) {
		return mockFileInfo{}, nil
	}

	assert.Equal(t, SprintColor(FgWhite, BgBlack, "test"), "\x1b[97;50mtest\x1b[0;0m")
	assert.Equal(t, SprintColor(FgLightRed, BgLightYellow, "test"), "\x1b[91;103mtest\x1b[0;0m")

	PrintColor(FgWhite, BgBlack, "test\n")

	osStatFn = oldStat
	assert.Equal(t, SprintColor(FgLightRed, BgLightYellow, "test"), "test")
}
