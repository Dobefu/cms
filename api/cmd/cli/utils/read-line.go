package utils

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func ReadLine(question string) (string, error) {
	reader := bufio.NewReader(os.Stdin)
	fmt.Printf("%s:\n", question)

	key, err := reader.ReadString('\n')

	if err != nil {
		return "", err
	}

	value := strings.ReplaceAll(key, "\n", "")

	return value, nil
}
