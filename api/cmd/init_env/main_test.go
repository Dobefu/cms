package init_env

import (
	"errors"
	"testing"

	"github.com/Dobefu/csb/cmd/logger"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func setupInitEnvTest() func() {
	godotenvLoad = func(filenames ...string) error {
		if filenames[0] == "bogus" {
			return errors.New("cannot find the file")
		}

		return nil
	}

	logger.SetExitOnFatal(false)

	return func() {
		godotenvLoad = godotenv.Load
		logger.SetExitOnFatal(true)
	}
}

func TestInitEnvSuccess(t *testing.T) {
	cleanup := setupInitEnvTest()
	defer cleanup()

	Main(".env")
	assert.NoError(t, godotenvLoad(".env"))
}

func TestInitEnvErrFileNotFound(t *testing.T) {
	cleanup := setupInitEnvTest()
	defer cleanup()

	Main("bogus")
	assert.EqualError(t, godotenvLoad("bogus"), "cannot find the file")
}
