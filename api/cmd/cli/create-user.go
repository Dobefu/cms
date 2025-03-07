package cli

import (
	"github.com/Dobefu/cms/api/cmd/cli/utils"
)

func CreateUser(username string, email string, password string) (err error) {
	username, err = confirmValue(username, "Please enter the username of the new user")

	if err != nil {
		return err
	}

	email, err = confirmValue(email, "Please enter the email address of the new user")

	if err != nil {
		return err
	}

	password, err = confirmValue(password, "Please enter the password of the new user")

	if err != nil {
		return err
	}

	err = userCreate(username, email, password, true)

	if err != nil {
		return err
	}

	return nil
}

func confirmValue(value string, message string) (confirmedValue string, err error) {
	if value != "" {
		return value, nil
	}

	for loop := true; loop; loop = (confirmedValue == "") {
		val, err := utils.ReadLine(message)

		if err != nil {
			return "", err
		}

		confirmedValue = val
	}

	return confirmedValue, nil
}
