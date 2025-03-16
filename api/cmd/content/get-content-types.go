package content

import (
	content_structs "github.com/Dobefu/cms/api/cmd/content/structs"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func GetContentTypes() (contentTypes []content_structs.ContentType, err error) {
	rows, err := database.DB.Query(`SELECT id,title FROM content_types`)

	if err != nil {
		return contentTypes, user.ErrUnexpected
	}

	for rows.Next() {
		var id int
		var title string

		err = rows.Scan(&id, &title)

		if err != nil {
			return contentTypes, user.ErrUnexpected
		}

		contentTypes = append(contentTypes, content_structs.ContentType{
			Id:    id,
			Title: title,
		})
	}

	return contentTypes, nil
}
