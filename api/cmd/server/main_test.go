package server

import (
	"database/sql"
	"net/http"
	"os"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/Dobefu/cms/api/cmd/database"
)

var db *sql.DB
var mockDb sqlmock.Sqlmock
var mux *http.ServeMux

func TestMain(m *testing.M) {
	db, mockDb, _ = sqlmock.New(sqlmock.MonitorPingsOption(true))

	originalDb := database.DB
	database.DB = db

	originalAPIKey := os.Getenv("API_KEY")
	os.Setenv("API_KEY", "test-api-key")

	mux = http.NewServeMux()
	handleRoutes(mux)

	exitCode := m.Run()

	database.DB = originalDb
	db.Close()
	os.Setenv("API_KEY", originalAPIKey)

	os.Exit(exitCode)
}
