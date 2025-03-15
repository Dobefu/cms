# CMS

[![CI Status](https://github.com/Dobefu/cms/actions/workflows/ci.yml/badge.svg)](https://github.com/Dobefu/cms/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Dobefu_cms&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Dobefu_cms)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Dobefu_cms&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Dobefu_cms)
[![Go Report Card](https://goreportcard.com/badge/github.com/Dobefu/cms/api)](https://goreportcard.com/report/github.com/Dobefu/cms/api)

## Getting Started

- Start the database server:

  ```bash
  pnpm db:start
  ```

- Navigate to `./api` and run:

  ```bash
  go build
  ./api migrate
  ```

  This will perform migrations on an empty database, and only needs to be done once.

- Go back to the root directory and run the development server:

  ```bash
  cd ..
  pnpm dev
  ```

By default, there are no users. To create one, run `./api user:create`.

Open [http://localhost:3000](http://localhost:3000) in a browser.
