package user

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/logger"
)

func UpdateSessionToken(userId int) (token string, err error) {
	token = generateSessionToken(userId)

	_, err = database.DB.Exec(
		`
      INSERT INTO sessions (user_id, token) VALUES ($1, $2)
      ON CONFLICT(user_id) DO UPDATE
        SET token = excluded.token, updated_at = $3
        WHERE sessions.user_id = excluded.user_id
    `,
		userId,
		token,
		time.Now().UTC(),
	)

	if err != nil {
		logger.Error(err.Error())
		return "", err
	}

	return token, nil
}

func generateSessionToken(userId int) (token string) {
	randomBytes := make([]byte, 64)
	_, _ = rand.Read(randomBytes)

	randomBytes = fmt.Appendf(randomBytes, "%d", userId)

	hasher := sha256.New()
	hasher.Write(randomBytes)

	return base64.StdEncoding.EncodeToString(hasher.Sum(randomBytes))
}
