package main

import (
	"flag"
	"log"
	"os"
)

var flagNewFlagSet = flag.NewFlagSet

var loggerFatal = log.Fatal
var osExit = os.Exit
