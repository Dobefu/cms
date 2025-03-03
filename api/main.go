package main

import (
	"github.com/Dobefu/cms/api/cmd/server"
)

func main() {
	port := 4000

	server.Init(port)
}
