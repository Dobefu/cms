package content

import (
	"database/sql"
	"errors"

	content_structs "github.com/Dobefu/cms/api/cmd/content/structs"
	content_type_structs "github.com/Dobefu/cms/api/cmd/content_type/structs"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func GetContentEntry(id int) (content content_structs.Content, err error) {
	row := database.DB.QueryRow(
		`
			SELECT c.id,ct.title,ct.created_at,ct.updated_at,c.title,c.created_at,c.updated_at,c.published
			FROM content AS c
			INNER JOIN content_types AS ct
			ON c.content_type = ct.id
			WHERE c.id = $1
			LIMIT 1
		`,
		id,
	)

	var contentType content_type_structs.ContentType

	err = row.Scan(
		&content.Id,
		&contentType.Title,
		&contentType.CreatedAt,
		&contentType.UpdatedAt,
		&content.Title,
		&content.CreatedAt,
		&content.UpdatedAt,
		&content.Published,
	)

	contentType.Id = content.Id
	content.ContentType = contentType

	if err != nil {
		if err == sql.ErrNoRows {
			return content, errors.New("Cannot find the content entry")
		}

		return content, user.ErrUnexpected
	}

	return content, nil
}
