package server

import (
	"net/http"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func setupInitTests() (cleanup func()) {
	httpListenAndServe = func(addr string, handler http.Handler) error {
		if strings.Contains(addr, ":404") {
			return assert.AnError
		}

		return nil
	}

	return func() {
		httpListenAndServe = http.ListenAndServe
	}
}

func TestStartErr(t *testing.T) {
	cleanup := setupInitTests()
	defer cleanup()

	err := Init(404)
	assert.NotEqual(t, nil, err)
}

func TestStart(t *testing.T) {
	cleanup := setupInitTests()
	defer cleanup()

	err := Init(4000)
	assert.Equal(t, nil, err)
}
