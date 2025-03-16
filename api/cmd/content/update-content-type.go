package content

import (
	"errors"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func UpdateContentType(id int, userId int, title string) (err error) {
	if title == "" {
		return errors.New("Missing title")
	}

	_, err = database.DB.Exec(
		`UPDATE content_types SET (title, author_id) = ($2, $3) WHERE id = $1`,
		id,
		title,
		userId,
	)

	if err != nil {
		return user.ErrUnexpected
	}

	return nil
}
