package migrate_db

import (
	"embed"
	"io/fs"

	"github.com/Dobefu/cms/api/cmd/logger"
)

type FS interface {
	fs.FS
	ReadDir(string) ([]fs.DirEntry, error)
	ReadFile(string) ([]byte, error)
}

//go:embed migrations/*
var content embed.FS

var loggerInfo = logger.Info
var getFs = func() FS { return content }
