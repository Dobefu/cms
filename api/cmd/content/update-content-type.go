package content

import (
	"errors"
)

func UpdateContentType(userId int, title string) (id int, err error) {
	if title == "" {
		return 0, errors.New("Missing title")
	}

	return 1, nil
}
