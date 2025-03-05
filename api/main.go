package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/Dobefu/cms/api/cmd/color"
	"github.com/Dobefu/cms/api/cmd/server"
)

type subCommand struct {
	desc string
}

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
	if len(args) < 1 {
		listSubCommands()
		return nil
	}

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
	// TODO
}

func listSubCommands() {
	cmds := map[string]subCommand{
		"server": {
			desc: "Run a webserver with API endpoints",
		},
	}

	fmt.Fprintf(flag.CommandLine.Output(), "Usage of %s:\n", os.Args[0])

	for idx, cmd := range cmds {
		color.PrintfColor(color.FgLightCyan, color.BgDefault, "  %s:\n", idx)
		fmt.Printf("    %s\n", cmd.desc)
	}

	osExit(1)
}
