package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/Dobefu/cms/api/cmd/color"
	"github.com/Dobefu/cms/api/cmd/logger"
)

type subCommand struct {
	desc string
}

var (
	verbose = flag.Bool("verbose", false, "Enable verbose logging")
	quiet   = flag.Bool("quiet", false, "Only log warnings and errors")
)

func main() {
	flag.Parse()

	args := flag.Args()

	if len(args) < 1 {
		listSubCommands(1)
		return
	}

	err := runSubCommand(args)

	if err != nil {
		loggerFatal(err.Error())
	}
}

func runSubCommand(args []string) error {
	flag := flagNewFlagSet(args[0], flag.ContinueOnError)
	var err error

	switch args[0] {
	case "server":
		port := flag.Uint("port", 4000, "The port to use for the web server")

		registerGlobalFlags(flag)
		err = flag.Parse(args[1:])

		if err != nil {
			break
		}

		applyGlobalFlags()
		err = serverInit(*port)

		if err != nil {
			fmt.Printf("could not start the server: %s\n", err)
		}

	default:
		applyGlobalFlags()
		listSubCommands(1)
	}

	return err
}

func registerGlobalFlags(fset *flag.FlagSet) {
	flag.VisitAll(func(f *flag.Flag) {
		fset.Var(f.Value, f.Name, f.Usage)
	})
}

func applyGlobalFlags() {
	if *verbose {
		logger.SetLogLevel(logger.LOG_VERBOSE)
	}

	if *quiet {
		logger.SetLogLevel(logger.LOG_WARNING)
	}
}

func listSubCommands(exitCode int) {
	cmds := map[string]subCommand{
		"server": {
			desc: "Run the API server",
		},
	}

	fmt.Fprintf(flag.CommandLine.Output(), "Usage of %s:\n", os.Args[0])

	for idx, cmd := range cmds {
		color.PrintfColor(color.FgLightCyan, color.BgDefault, "  %s:\n", idx)
		fmt.Printf("    %s\n", cmd.desc)
	}

	osExit(exitCode)
}
