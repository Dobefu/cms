package main

import (
	"flag"
	"os"

	"github.com/Dobefu/cms/api/cmd/logger"
)

var flagNewFlagSet = flag.NewFlagSet

var loggerFatal = logger.Fatal
var osExit = os.Exit
