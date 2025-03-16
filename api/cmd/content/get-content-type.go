package content

import (
	content_structs "github.com/Dobefu/cms/api/cmd/content/structs"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func GetContentType(id int) (contentType content_structs.ContentType, err error) {
	row := database.DB.QueryRow(
		`SELECT id,title FROM content_types WHERE id = $1 LIMIT 1`,
		id,
	)

	err = row.Scan(&contentType.Id, &contentType.Title)

	if err != nil {
		return contentType, user.ErrUnexpected
	}

	return contentType, nil
}
