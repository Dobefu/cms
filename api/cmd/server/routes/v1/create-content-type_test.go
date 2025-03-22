package v1

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Dobefu/cms/api/cmd/content_type"
	"github.com/stretchr/testify/assert"
)

func setupCreateContentTypeTests() (rr *httptest.ResponseRecorder, cleanup func()) {
	rr = httptest.NewRecorder()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 1, nil
	}

	contentTypeCreateContentType = func(userId int, title string) (id int, err error) {
		return 1, nil
	}

	return rr, func() {
		contentTypeCreateContentType = content_type.CreateContentType
	}
}

func TestCreateContentTypeErrInvalidSessionToken(t *testing.T) {
	rr, cleanup := setupCreateContentTypeTests()
	defer cleanup()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 0, assert.AnError
	}

	req, err := http.NewRequest("PUT", "", nil)
	req.Header.Add("Session-Token", "bogus")
	assert.NoError(t, err)

	CreateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestCreateContentTypeErrMissingSessionToken(t *testing.T) {
	rr, cleanup := setupCreateContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("PUT", "", nil)
	assert.NoError(t, err)

	CreateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing session_token"), rr.Body.String())
}

func TestCreateContentTypeErrMissingTitle(t *testing.T) {
	rr, cleanup := setupCreateContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("PUT", "", nil)
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	CreateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing title"), rr.Body.String())
}

func TestCreateContentTypeErrCreateContentType(t *testing.T) {
	rr, cleanup := setupCreateContentTypeTests()
	defer cleanup()

	contentTypeCreateContentType = func(userId int, title string) (id int, err error) {
		return 0, assert.AnError
	}

	req, err := http.NewRequest("PUT", "", strings.NewReader("title=Title"))
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	CreateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestCreateContentTypeSuccess(t *testing.T) {
	rr, cleanup := setupCreateContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("PUT", "", strings.NewReader("title=Title"))
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	CreateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": {"id": %d}, "error": null}`, 1), rr.Body.String())
}
