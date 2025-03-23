package content

import (
	"errors"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func CreateContent(userId int, contentType int, title string) (id int, err error) {
	if title == "" {
		return 0, errors.New("Missing title")
	}

	rows, err := database.DB.Query(
		`INSERT INTO content (content_type, title, author_id) VALUES ($1, $2, $3) RETURNING id`,
		contentType,
		title,
		userId,
	)

	if err != nil {
		return 0, user.ErrUnexpected
	}

	rows.Next()
	err = rows.Scan(&id)

	if err != nil {
		return 0, user.ErrUnexpected
	}

	return id, nil
}
