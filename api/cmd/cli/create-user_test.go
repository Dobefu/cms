package cli

import (
	"os"
	"testing"

	"github.com/Dobefu/cms/api/cmd/user"
	"github.com/stretchr/testify/assert"
)

func setupTestCreateUser(t *testing.T, stdin string) (cleanup func()) {
	tmpfile, err := os.CreateTemp("", "TestCreateUser")
	assert.Equal(t, nil, err)

	oldStdin := os.Stdin
	os.Stdin = tmpfile
	userCreate = func(username string, email string, password string, status bool) (err error) {
		return nil
	}

	_, err = tmpfile.WriteAt([]byte(stdin), 0)
	assert.NoError(t, err)

	_, err = tmpfile.Seek(0, 0)
	assert.NoError(t, err)

	return func() {
		os.Remove(tmpfile.Name())
		os.Stdin = oldStdin
		userCreate = user.Create
	}
}

func TestCreateUserErrUsername(t *testing.T) {
	cleanup := setupTestCreateUser(t, "")
	defer cleanup()

	err := CreateUser("", "", "")
	assert.Error(t, err)
}

func TestCreateUserErrEmail(t *testing.T) {
	cleanup := setupTestCreateUser(t, "")
	defer cleanup()

	err := CreateUser("Username", "", "")
	assert.Error(t, err)
}

func TestCreateUserErrPassword(t *testing.T) {
	cleanup := setupTestCreateUser(t, "")
	defer cleanup()

	err := CreateUser("Username", "email@example.com", "")
	assert.Error(t, err)
}

func TestCreateUserErrCreate(t *testing.T) {
	cleanup := setupTestCreateUser(t, "")
	defer cleanup()

	userCreate = func(username string, email string, password string, status bool) (err error) {
		return assert.AnError
	}

	err := CreateUser("Username", "email@example.com", "test-password")
	assert.Error(t, err)
}

func TestCreateUser(t *testing.T) {
	cleanup := setupTestCreateUser(t, "test-password\n")
	defer cleanup()

	err := CreateUser("Username", "email@example.com", "")
	assert.NoError(t, err)
}
