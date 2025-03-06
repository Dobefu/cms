package main

import (
	"flag"
	"os"

	"github.com/Dobefu/cms/api/cmd/logger"
	"github.com/Dobefu/cms/api/cmd/server"
)

var flagNewFlagSet = flag.NewFlagSet

var loggerFatal = logger.Fatal
var osExit = os.Exit
var serverInit = server.Init
