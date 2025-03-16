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

	contentUpdateContentType = func(id int, userId int, title string) (err error) {
		return nil
	}

	return rr, func() {
		contentUpdateContentType = content.UpdateContentType
	}
}

func TestUpdateContentTypeErrInvalidId(t *testing.T) {
	rr, cleanup := setupUpdateContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("POST", "", nil)
	req.SetPathValue("id", "bogus")
	assert.NoError(t, err)

	UpdateContentType(rr, req)
	assert.Equal(t, "", rr.Body.String())
}

func TestUpdateContentTypeErrInvalidSessionToken(t *testing.T) {
	rr, cleanup := setupUpdateContentTypeTests()
	defer cleanup()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 0, assert.AnError
	}

	req, err := http.NewRequest("POST", "", nil)
	req.SetPathValue("id", "1")
	req.Header.Add("Session-Token", "bogus")
	assert.NoError(t, err)

	UpdateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestUpdateContentTypeErrMissingSessionToken(t *testing.T) {
	rr, cleanup := setupUpdateContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("POST", "", nil)
	req.SetPathValue("id", "1")
	assert.NoError(t, err)

	UpdateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing session_token"), rr.Body.String())
}

func TestUpdateContentTypeErrMissingTitle(t *testing.T) {
	rr, cleanup := setupUpdateContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("POST", "", nil)
	req.SetPathValue("id", "1")
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	UpdateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing title"), rr.Body.String())
}

func TestUpdateContentTypeErrUpdateContentType(t *testing.T) {
	rr, cleanup := setupUpdateContentTypeTests()
	defer cleanup()

	contentUpdateContentType = func(id int, userId int, title string) (err error) {
		return assert.AnError
	}

	req, err := http.NewRequest("POST", "", strings.NewReader("title=Title"))
	req.SetPathValue("id", "1")
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	UpdateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestUpdateContentTypeSuccess(t *testing.T) {
	rr, cleanup := setupUpdateContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("POST", "", strings.NewReader("title=Title"))
	req.SetPathValue("id", "1")
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	UpdateContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": {"id": %d}, "error": null}`, 1), rr.Body.String())
}
