package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/Dobefu/cms/api/cmd/color"
	"github.com/Dobefu/cms/api/cmd/logger"
	"github.com/Dobefu/cms/api/cmd/server"
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
		listSubCommands()
		return
	}

	err := runSubCommand(args)

	if err != nil {
		loggerFatal(err.Error())
	}
}

func runSubCommand(args []string) error {
	flag := flagNewFlagSet(args[0], flag.ExitOnError)
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
		err = server.Init(*port)

		if err != nil {
			fmt.Printf("Could not start server: %s\n", err)
		}

	default:
		listSubCommands()
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

func listSubCommands() {
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

	osExit(1)
}
