package migrate_db

import (
	"fmt"
	"strings"

	"github.com/Dobefu/cms/api/cmd/database"
)

func Main(reset bool) error {
	var err error

	if reset {
		loggerInfo("Reverting existing migrations")
		err = down()

		if err != nil {
			return err
		}
	}

	loggerInfo("Performing migrations")
	err = up()

	if err != nil {
		return err
	}

	return nil
}

func down() error {
	version, _, err := getMigrationState()

	if err != nil {
		return err
	}

	if version == 0 {
		loggerInfo("Nothing to revert")
		return nil
	}

	files, err := getFs().ReadDir("migrations")

	if err != nil {
		return err
	}

	migrationIndex := len(files) / 2

	for i := len(files) - 1; i >= 0; i-- {
		file := files[i]
		name := file.Name()

		if strings.Split(name, ".")[1] != "down" {
			continue
		}

		migrationIndex = migrationIndex - 1

		if migrationIndex >= version {
			continue
		}

		loggerInfo("Running migration: %s", name)
		err = runMigration(name, migrationIndex)

		if err != nil {
			return err
		}
	}

	err = setMigrationState(migrationIndex, false)

	if err != nil {
		return err
	}

	return nil
}

func up() error {
	version, _, err := getMigrationState()

	if err != nil {
		return err
	}

	files, err := getFs().ReadDir("migrations")

	if err != nil {
		return err
	}

	migrationIndex := 0

	for _, file := range files {
		name := file.Name()

		if strings.Split(name, ".")[1] != "up" {
			continue
		}

		migrationIndex += 1

		if migrationIndex <= version {
			continue
		}

		loggerInfo("Running migration: %s", name)
		err = runMigration(name, migrationIndex)

		if err != nil {
			return err
		}
	}

	err = setMigrationState(migrationIndex, false)

	if err != nil {
		return err
	}

	return nil
}

func createMigrationsTable() error {
	_, err := database.DB.Exec(`
    CREATE TABLE IF NOT EXISTS migrations(
      version bigint NOT NULL PRIMARY KEY,
      dirty boolean NOT NULL
    );
  `)

	if err != nil {
		return err
	}

	return nil
}

func getMigrationState() (int, bool, error) {
	err := createMigrationsTable()

	if err != nil {
		return 0, true, err
	}

	row := database.DB.QueryRow("SELECT version,dirty FROM migrations LIMIT 1")

	var version int
	var dirty bool

	err = row.Scan(&version, &dirty)

	// If nothing is found, the table is empty.
	// This is fine, since an initial migration will produce this result.
	// When this happens, default values should be returned.
	if err != nil {
		return 0, false, nil
	}

	return version, dirty, nil
}

func setMigrationState(version int, dirty bool) error {
	err := createMigrationsTable()

	if err != nil {
		return err
	}

	_, err = database.DB.Exec("TRUNCATE migrations")

	if err != nil {
		return err
	}

	_, err = database.DB.Exec("INSERT into migrations (version, dirty) VALUES ($1, $2)", version, dirty)

	if err != nil {
		return err
	}

	return nil
}

func runMigration(filename string, index int) error {
	queryBytes, err := getFs().ReadFile(fmt.Sprintf("migrations/%s", filename))

	if err != nil {
		_ = setMigrationState(index, true)
		return err
	}

	_, err = database.DB.Exec(string(queryBytes))

	if err != nil {
		_ = setMigrationState(index, true)
		return err
	}

	return nil
}
