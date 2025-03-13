package utils

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"github.com/Dobefu/cms/api/cmd/color"
)

func ReadLine(question string) (string, error) {
	reader := bufio.NewReader(os.Stdin)

	color.PrintfColor(color.FgGreen, color.BgBlack, " %s", question)
	fmt.Printf(":\n ➤ ")

	key, err := reader.ReadString('\n')

	if err != nil {
		return "", err
	}

	value := strings.ReplaceAll(key, "\n", "")

	return value, nil
}
