package init_env

import (
	"github.com/Dobefu/csb/cmd/logger"
)

func Main(envPath string) {
	err := godotenvLoad(envPath)

	if err != nil {
		logger.Fatal("No %s file found. Please copy it from the .env.example and enter your credentials", envPath)
	}
}
