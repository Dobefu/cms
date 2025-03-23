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

func setupGetContentTests() (rr *httptest.ResponseRecorder, cleanup func()) {
	rr = httptest.NewRecorder()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 1, nil
	}

	contentGetContent = func(id int) (content content_structs.Content, err error) {
		return content_structs.Content{}, nil
	}

	return rr, func() {
		contentGetContent = content.GetContent
	}
}

func TestGetContentErrNoContentId(t *testing.T) {
	rr, cleanup := setupGetContentTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "", nil)
	assert.NoError(t, err)

	GetContent(rr, req)
	assert.Equal(t, "", rr.Body.String())
}

func TestGetContentErrInvalidSessionToken(t *testing.T) {
	rr, cleanup := setupGetContentTests()
	defer cleanup()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 0, assert.AnError
	}

	req, err := http.NewRequest("GET", "", nil)
	req.SetPathValue("id", "1")
	req.Header.Add("Session-Token", "bogus")
	assert.NoError(t, err)

	GetContent(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestGetContentErrMissingSessionToken(t *testing.T) {
	rr, cleanup := setupGetContentTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "", nil)
	req.SetPathValue("id", "1")
	assert.NoError(t, err)

	GetContent(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing session_token"), rr.Body.String())
}

func TestGetContentErrGetContent(t *testing.T) {
	rr, cleanup := setupGetContentTests()
	defer cleanup()

	contentGetContent = func(id int) (content content_structs.Content, err error) {
		return content_structs.Content{}, assert.AnError
	}

	req, err := http.NewRequest("GET", "", nil)
	req.SetPathValue("id", "1")
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	GetContent(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestGetContentSuccess(t *testing.T) {
	rr, cleanup := setupGetContentTests()
	defer cleanup()

	req, err := http.NewRequest("GET", "", nil)
	req.SetPathValue("id", "1")
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	GetContent(rr, req)
	assert.JSONEq(t, `{"data": {"content": {"id": 0, "content_type": 0, "title": "", "created_at": "", "updated_at": ""}}, "error": null}`, rr.Body.String())
}
