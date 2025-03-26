package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/Dobefu/cms/api/cmd/color"
	"github.com/Dobefu/cms/api/cmd/init_env"
	"github.com/Dobefu/cms/api/cmd/logger"
)

type subCommand struct {
	desc string
}

var (
	verbose = flag.Bool("verbose", false, "Enable verbose logging")
	quiet   = flag.Bool("quiet", false, "Only log warnings and errors")
	envPath = flag.String("env-file", ".env", "The location of the .env file. Defaults to .env")
)

func initDB() {
	err := databaseConnect()

	if err != nil {
		loggerFatal("Could not connect to the database: %s", err.Error())
	}

	err = dbPing()

	if err != nil {
		loggerFatal("Could not ping the database: %s", err.Error())
	}
}

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
		err = serverInit(*port, nil)

		if err != nil {
			fmt.Printf("could not start the server: %s\n", err)
		}

	case "migrate":
		reset := flag.Bool("reset", false, "Migrate from a clean database. Warning: this will delete existing data")

		registerGlobalFlags(flag)
		err = flag.Parse(args[1:])

		if err != nil {
			break
		}

		applyGlobalFlags()
		err = migrateDbMain(*reset)

		if err != nil {
			fmt.Printf("database migration failed: %s\n", err)
		}

	case "user:create":
		username := flag.String("username", "", "The username")
		email := flag.String("email", "", "The email address of the user")
		password := flag.String("password", "", "The password of the user")

		registerGlobalFlags(flag)
		err = flag.Parse(args[1:])

		if err != nil {
			break
		}

		applyGlobalFlags()
		err = cliCreateUser(*username, *email, *password)

		if err != nil {
			fmt.Printf("user creation failed: %s\n", err)
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

	init_env.Main(*envPath)
	initDB()
}

func listSubCommands(exitCode int) {
	cmds := map[string]subCommand{
		"server": {
			desc: "Run the API server",
		},
		"migrate": {
			desc: "Migrate the database",
		},
		"user:create": {
			desc: "Create a new user",
		},
	}

	fmt.Fprintf(flag.CommandLine.Output(), "Usage of %s:\n", os.Args[0])

	for idx, cmd := range cmds {
		color.PrintfColor(color.FgLightCyan, color.BgDefault, "  %s\n", idx)
		fmt.Printf("    %s\n", cmd.desc)
	}

	osExit(exitCode)
}
