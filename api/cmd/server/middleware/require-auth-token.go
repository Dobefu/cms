package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func RequireApiKey(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKey := os.Getenv("API_KEY")
		apiKeyHeader := r.Header.Get("X-Api-Key")

		var errorMsg string

		if apiKey != apiKeyHeader {
			errorMsg = "Invalid API key"
		}

		if apiKeyHeader == "" {
			errorMsg = "No API key provided"
		}

		if errorMsg != "" {
			w.WriteHeader(401)

			response, _ := json.Marshal(map[string]any{
				"data":  nil,
				"error": errorMsg,
			})

			fmt.Fprint(w, string(response))
			return
		}

		next.ServeHTTP(w, r)
	})
}
