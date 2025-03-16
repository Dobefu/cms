package content

import (
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func DeleteContentType(id int) (err error) {
	_, err = database.DB.Exec(
		`DELETE FROM content_types WHERE id = $1`,
		id,
	)

	if err != nil {
		return user.ErrUnexpected
	}

	return nil
}
