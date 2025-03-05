#!/usr/bin/env bash

# Exit on error.
set -e

# Navigate to the root of the project.
cd "$(dirname "$0")/.."

# Run the tests.
go test "./..." -coverprofile="coverage.out" -covermode=count

# Filter out test_utils.go from the coverage report.
grep -v "test_utils.go" coverage.out > coverage.tmp
mv coverage.tmp coverage.out

# Display the coverage statistics and generate an HTML report.
go tool cover -func coverage.out
go tool cover -html=coverage.out
