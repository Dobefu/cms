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

func setupCreateContentTests() (rr *httptest.ResponseRecorder, cleanup func()) {
	rr = httptest.NewRecorder()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 1, nil
	}

	contentCreateContent = func(userId int, contentType int, title string, isPublished bool) (id int, err error) {
		return 1, nil
	}

	return rr, func() {
		contentCreateContent = content.CreateContent
	}
}

func TestCreateContentErrInvalidSessionToken(t *testing.T) {
	rr, cleanup := setupCreateContentTests()
	defer cleanup()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 0, assert.AnError
	}

	req, err := http.NewRequest("PUT", "", nil)
	req.Header.Add("Session-Token", "bogus")
	assert.NoError(t, err)

	CreateContent(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestCreateContentErrMissingSessionToken(t *testing.T) {
	rr, cleanup := setupCreateContentTests()
	defer cleanup()

	req, err := http.NewRequest("PUT", "", nil)
	assert.NoError(t, err)

	CreateContent(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing session_token"), rr.Body.String())
}

func TestCreateContentErrMissingParams(t *testing.T) {
	rr, cleanup := setupCreateContentTests()
	defer cleanup()

	req, err := http.NewRequest("PUT", "", nil)
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	CreateContent(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing or invalid content type ID"), rr.Body.String())
}

func TestCreateContentErrMissingTitle(t *testing.T) {
	rr, cleanup := setupCreateContentTests()
	defer cleanup()

	req, err := http.NewRequest("PUT", "", strings.NewReader("content_type=1"))
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	CreateContent(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing title"), rr.Body.String())
}

func TestCreateContentErrCreateContent(t *testing.T) {
	rr, cleanup := setupCreateContentTests()
	defer cleanup()

	contentCreateContent = func(userId int, contentType int, title string, isPublished bool) (id int, err error) {
		return 0, assert.AnError
	}

	req, err := http.NewRequest("PUT", "", strings.NewReader("content_type=1&title=Title"))
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	CreateContent(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestCreateContentSuccess(t *testing.T) {
	rr, cleanup := setupCreateContentTests()
	defer cleanup()

	req, err := http.NewRequest("PUT", "", strings.NewReader("content_type=1&title=Title"))
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	CreateContent(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": {"id": %d}, "error": null}`, 1), rr.Body.String())
}
