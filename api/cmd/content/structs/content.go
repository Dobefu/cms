package structs

import (
	content_type_structs "github.com/Dobefu/cms/api/cmd/content_type/structs"
)

type Content struct {
	Id          int                              `json:"id"`
	ContentType content_type_structs.ContentType `json:"content_type"`
	Title       string                           `json:"title"`
	CreatedAt   string                           `json:"created_at"`
	UpdatedAt   string                           `json:"updated_at"`
	Published   bool                             `json:"published"`
}
