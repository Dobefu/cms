package v1

import (
	"github.com/Dobefu/cms/api/cmd/content"
	"github.com/Dobefu/cms/api/cmd/content_type"
	"github.com/Dobefu/cms/api/cmd/user"
)

var userLogin = user.Login
var userValidateSession = user.ValidateSession
var userGetUserData = user.GetUserData

var contentTypeCreateContentType = content_type.CreateContentType
var contentTypeUpdateContentType = content_type.UpdateContentType
var contentTypeDeleteContentType = content_type.DeleteContentType
var contentTypeGetContentTypes = content_type.GetContentTypes
var contentTypeGetContentType = content_type.GetContentType

var contentCreateContent = content.CreateContent
var contentGetContent = content.GetContent
