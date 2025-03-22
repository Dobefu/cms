package content_type

import (
	content_type_structs "github.com/Dobefu/cms/api/cmd/content_type/structs"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func GetContentType(id int) (contentType content_type_structs.ContentType, err error) {
	row := database.DB.QueryRow(
		`SELECT id,title,created_at,updated_at FROM content_types WHERE id = $1 LIMIT 1`,
		id,
	)

	err = row.Scan(
		&contentType.Id,
		&contentType.Title,
		&contentType.CreatedAt,
		&contentType.UpdatedAt,
	)

	if err != nil {
		return contentType, user.ErrUnexpected
	}

	return contentType, nil
}
