package content

import (
	"database/sql"
	"errors"

	content_structs "github.com/Dobefu/cms/api/cmd/content/structs"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func GetContent(id int) (content content_structs.Content, err error) {
	row := database.DB.QueryRow(
		`SELECT id,title,created_at,updated_at FROM content WHERE id = $1 LIMIT 1`,
		id,
	)

	err = row.Scan(
		&content.Id,
		&content.Title,
		&content.CreatedAt,
		&content.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return content, errors.New("Cannot find the content")
		}

		return content, user.ErrUnexpected
	}

	return content, nil
}
