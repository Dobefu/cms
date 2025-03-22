package v1

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Dobefu/cms/api/cmd/content_type"
	content_type_structs "github.com/Dobefu/cms/api/cmd/content_type/structs"
	"github.com/stretchr/testify/assert"
)

func setupGetContentTypesTests() (rr *httptest.ResponseRecorder, cleanup func()) {
	rr = httptest.NewRecorder()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 1, nil
	}

	contentTypeGetContentTypes = func() (contentTypes []content_type_structs.ContentType, err error) {
		return []content_type_structs.ContentType{}, nil
	}

	return rr, func() {
		contentTypeGetContentTypes = content_type.GetContentTypes
	}
}

func TestGetContentTypesErrInvalidSessionToken(t *testing.T) {
	rr, cleanup := setupGetContentTypesTests()
	defer cleanup()

	userValidateSession = func(oldToken string, refresh bool) (newToken string, userId int, err error) {
		return "", 0, assert.AnError
	}

	req, err := http.NewRequest("PUT", "", nil)
	req.Header.Add("Session-Token", "bogus")
	assert.NoError(t, err)

	GetContentTypes(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestGetContentTypesErrMissingSessionToken(t *testing.T) {
	rr, cleanup := setupGetContentTypesTests()
	defer cleanup()

	req, err := http.NewRequest("PUT", "", nil)
	assert.NoError(t, err)

	GetContentTypes(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, "Missing session_token"), rr.Body.String())
}

func TestGetContentTypesErrGetContentTypes(t *testing.T) {
	rr, cleanup := setupGetContentTypesTests()
	defer cleanup()

	contentTypeGetContentTypes = func() (contentTypes []content_type_structs.ContentType, err error) {
		return []content_type_structs.ContentType(nil), assert.AnError
	}

	req, err := http.NewRequest("PUT", "", strings.NewReader("title=Title"))
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	GetContentTypes(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": null, "error": "%s"}`, assert.AnError), rr.Body.String())
}

func TestGetContentTypesSuccess(t *testing.T) {
	rr, cleanup := setupGetContentTypesTests()
	defer cleanup()

	req, err := http.NewRequest("PUT", "", strings.NewReader("title=Title"))
	req.Header.Add("Session-Token", "test")
	assert.NoError(t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	GetContentTypes(rr, req)
	assert.JSONEq(t, fmt.Sprintf(`{"data": {"content_types": %s}, "error": null}`, []any{}), rr.Body.String())
}
