package v1

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Dobefu/cms/api/cmd/content"
	"github.com/stretchr/testify/assert"
)

func setupUpdateContentTypeTests() (rr *httptest.ResponseRecorder, cleanup func()) {
	rr = httptest.NewRecorder()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 1, nil
	}

	contentUpdateContentType = func(userId int, title string) (id int, err error) {
		return 1, nil
	}

	return rr, func() {
		contentUpdateContentType = content.UpdateContentType
	}
}

func TestUpdateContentTypeErrMissingTitle(t *testing.T) {
	rr, cleanup := setupUpdateContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("PUT", "", nil)
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	UpdateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing title"), rr.Body.String())
}

func TestUpdateContentTypeErrUpdateContentType(t *testing.T) {
	rr, cleanup := setupUpdateContentTypeTests()
	defer cleanup()

	contentUpdateContentType = func(userId int, title string) (id int, err error) {
		return 0, assert.AnError
	}

	req, err := http.NewRequest("PUT", "", strings.NewReader("title=Title"))
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	UpdateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestUpdateContentTypeSuccess(t *testing.T) {
	rr, cleanup := setupUpdateContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("PUT", "", strings.NewReader("title=Title"))
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	UpdateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": {"id": %d}, "error": null}`, 1), rr.Body.String())
}
