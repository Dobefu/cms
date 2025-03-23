package server

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestInitErr(t *testing.T) {
	t.Parallel()

	err := Init(65536, nil)

	assert.EqualError(t, err, "listen tcp: address 65536: invalid port")
}

func TestInitSuccess(t *testing.T) {
	t.Parallel()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	serverErr := make(chan error, 1)

	go func() {
		err := Init(4001, ctx)
		serverErr <- err
	}()

	time.Sleep(100 * time.Millisecond)
	cancel()

	assert.EqualError(t, <-serverErr, "http: Server closed")
}
