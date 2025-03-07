package utils

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReadLine(t *testing.T) {
	tmpfile, err := os.CreateTemp("", "TestReadLine")
	assert.Equal(t, nil, err)

	defer os.Remove(tmpfile.Name())

	oldStdin := os.Stdin
	defer func() { os.Stdin = oldStdin }()

	os.Stdin = tmpfile

	_, err = tmpfile.WriteAt([]byte("Test!\n"), 0)
	assert.Equal(t, nil, err)

	_, err = tmpfile.Seek(0, 0)
	assert.Equal(t, nil, err)

	var value string

	value, err = ReadLine("Test?")
	assert.Equal(t, nil, err)
	assert.Equal(t, "Test!", value)

	_, err = tmpfile.WriteAt([]byte("incomplete"), 0)
	assert.Equal(t, nil, err)

	_, err = tmpfile.Seek(0, 0)
	assert.Equal(t, nil, err)

	value, err = ReadLine("Test?")
	assert.NotEqual(t, nil, err)
	assert.Equal(t, "", value)
}
