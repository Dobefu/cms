package v1

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Dobefu/cms/api/cmd/content"
	content_structs "github.com/Dobefu/cms/api/cmd/content/structs"
	"github.com/stretchr/testify/assert"
)

func setupGetContentTypeTests() (rr *httptest.ResponseRecorder, cleanup func()) {
	rr = httptest.NewRecorder()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 1, nil
	}

	contentGetContentType = func(id int) (contentType content_structs.ContentType, err error) {
		return content_structs.ContentType{}, nil
	}

	return rr, func() {
		contentGetContentType = content.GetContentType
	}
}

func TestGetContentTypeErrNoContentTypeId(t *testing.T) {
	rr, cleanup := setupGetContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "", nil)
	assert.NoError(t, err)

	GetContentType(rr, req)
	assert.Equal(t, "", rr.Body.String())
}

func TestGetContentTypeErrInvalidSessionToken(t *testing.T) {
	rr, cleanup := setupGetContentTypeTests()
	defer cleanup()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 0, assert.AnError
	}

	req, err := http.NewRequest("GET", "", nil)
	req.SetPathValue("id", "1")
	req.Header.Add("Session-Token", "bogus")
	assert.NoError(t, err)

	GetContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestGetContentTypeErrMissingSessionToken(t *testing.T) {
	rr, cleanup := setupGetContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "", nil)
	req.SetPathValue("id", "1")
	assert.NoError(t, err)

	GetContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing session_token"), rr.Body.String())
}

func TestGetContentTypeErrGetContentType(t *testing.T) {
	rr, cleanup := setupGetContentTypeTests()
	defer cleanup()

	contentGetContentType = func(id int) (contentType content_structs.ContentType, err error) {
		return content_structs.ContentType{}, assert.AnError
	}

	req, err := http.NewRequest("GET", "", nil)
	req.SetPathValue("id", "1")
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	GetContentType(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestGetContentTypeSuccess(t *testing.T) {
	rr, cleanup := setupGetContentTypeTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "", nil)
	req.SetPathValue("id", "1")
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	GetContentType(rr, req)
	assert.JSONEq(t, `{"data": {"content_type": {"id": 0, "title": ""}}, "error": null}`, rr.Body.String())
}
