package content

import (
	"errors"
	"time"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func UpdateContent(id int, userId int, title string) (err error) {
	if title == "" {
		return errors.New("Missing title")
	}

	_, err = database.DB.Exec(
		`UPDATE content SET (title, author_id, updated_at, published) = ($2, $3, $4, $5) WHERE id = $1`,
		id,
		title,
		userId,
		time.Now(),
		true,
	)

	if err != nil {
		return user.ErrUnexpected
	}

	return nil
}
