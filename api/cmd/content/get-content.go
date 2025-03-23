package content

import (
	content_structs "github.com/Dobefu/cms/api/cmd/content/structs"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func GetContent() (content []content_structs.Content, err error) {
	rows, err := database.DB.Query(`SELECT id,content_type,title,created_at,updated_at FROM content ORDER BY title ASC`)

	if err != nil {
		return content, user.ErrUnexpected
	}

	for rows.Next() {
		var id, contentType int
		var title, createdAt, updatedAt string

		err = rows.Scan(&id, &contentType, &title, &createdAt, &updatedAt)

		if err != nil {
			return content, user.ErrUnexpected
		}

		content = append(content, content_structs.Content{
			Id:        id,
			Title:     title,
			CreatedAt: createdAt,
			UpdatedAt: updatedAt,
		})
	}

	return content, nil
}
