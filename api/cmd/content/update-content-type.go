package content

import (
	"errors"
)

func UpdateContentType(title string) (err error) {
	if title == "" {
		return errors.New("Missing title")
	}

	return nil
}
