package main

import (
	"fmt"

	"github.com/Dobefu/cms/api/cmd/server"
)

func main() {
	port := 4000

	err := server.Init(port)

	if err != nil {
		fmt.Printf("Could not start server: %s\n", err)
	}
}
