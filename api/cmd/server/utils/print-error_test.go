package utils

import (
	"io"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func setupPrintErrorTests() (w *httptest.ResponseRecorder) {
	w = httptest.NewRecorder()

	return w
}

func TestPrintErrorInternalServerError(t *testing.T) {
	w := setupPrintErrorTests()

	PrintError(w, assert.AnError, true)
	assert.Equal(t, 500, w.Result().StatusCode)

	respBody, err := io.ReadAll(w.Body)
	assert.Equal(t, nil, err)
	assert.Contains(t, string(respBody), assert.AnError.Error())
}

func TestPrintErrorBadRequest(t *testing.T) {
	w := setupPrintErrorTests()

	PrintError(w, assert.AnError, false)
	assert.Equal(t, 400, w.Result().StatusCode)

	respBody, err := io.ReadAll(w.Body)
	assert.Equal(t, nil, err)

	assert.Contains(t, string(respBody), assert.AnError.Error())
}
