package content

import (
	content_structs "github.com/Dobefu/cms/api/cmd/content/structs"
	content_type_structs "github.com/Dobefu/cms/api/cmd/content_type/structs"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func GetContent() (content []content_structs.Content, err error) {
	rows, err := database.DB.Query(
		`
      SELECT
      c.id,ct.title,ct.created_at,ct.updated_at,c.title,c.created_at,c.updated_at
      FROM content AS c
      INNER JOIN content_types AS ct
      ON c.content_type = ct.id
      ORDER BY c.title ASC
    `,
	)

	if err != nil {
		return content, user.ErrUnexpected
	}

	for rows.Next() {
		var id int
		var title, createdAt, updatedAt string

		var contentType content_type_structs.ContentType

		err = rows.Scan(&id, &contentType.Title, &contentType.CreatedAt, &contentType.UpdatedAt, &title, &createdAt, &updatedAt)

		contentType.Id = id

		if err != nil {
			return content, user.ErrUnexpected
		}

		content = append(content, content_structs.Content{
			Id:          id,
			ContentType: contentType,
			Title:       title,
			CreatedAt:   createdAt,
			UpdatedAt:   updatedAt,
		})
	}

	return content, nil
}
