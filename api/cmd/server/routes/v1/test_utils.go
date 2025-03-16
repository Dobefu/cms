package v1

import (
	"github.com/Dobefu/cms/api/cmd/content"
	"github.com/Dobefu/cms/api/cmd/user"
)

var userLogin = user.Login
var userValidateSession = user.ValidateSession
var userGetUserData = user.GetUserData
var contentCreateContentType = content.CreateContentType
var contentUpdateContentType = content.UpdateContentType
var contentDeleteContentType = content.DeleteContentType
var contentGetContentTypes = content.GetContentTypes
var contentGetContentType = content.GetContentType
