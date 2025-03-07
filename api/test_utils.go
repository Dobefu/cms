package main

import (
	"flag"
	"os"

	"github.com/Dobefu/cms/api/cmd/cli"
	"github.com/Dobefu/cms/api/cmd/database"
	"github.com/Dobefu/cms/api/cmd/logger"
	"github.com/Dobefu/cms/api/cmd/migrate_db"
	"github.com/Dobefu/cms/api/cmd/server"
)

var databaseConnect = database.Connect
var dbPing = func() error { return database.DB.Ping() }
var flagNewFlagSet = flag.NewFlagSet

var loggerFatal = logger.Fatal
var osExit = os.Exit
var serverInit = server.Init
var migrateDbMain = migrate_db.Main
var cliCreateUser = cli.CreateUser
