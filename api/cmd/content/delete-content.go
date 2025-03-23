package content

import (
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/user"
)

func DeleteContent(id int) (err error) {
	_, err = database.DB.Exec(
		`DELETE FROM content WHERE id = $1`,
		id,
	)

	if err != nil {
		return user.ErrUnexpected
	}

	return nil
}
