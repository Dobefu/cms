package v1

import (
	"fmt"
	"net/http"
)

func Login(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "{}")
}
