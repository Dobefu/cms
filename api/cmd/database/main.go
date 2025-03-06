package database

import (
	"database/sql"
	"errors"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() (err error) {
	connString, err := getConnectionDetails()

	if err != nil {
		return err
	}

	db, err := sqlOpen("postgres", connString)

	if err != nil {
		return err
	}

	DB = db
	return nil
}

func getConnectionDetails() (connString string, err error) {
	connString = os.Getenv("DB_CONN")

	if connString == "" {
		return "", errors.New("DB_CONN is not set")
	}

	return connString, nil
}
