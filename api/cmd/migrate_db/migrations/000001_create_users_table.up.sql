CREATE TABLE IF NOT EXISTS users(
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY UNIQUE,
  username varchar(255) NOT NULL UNIQUE,
  email varchar(254) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  status boolean NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp without time zone NOT NULL DEFAULT NOW(),
  last_login timestamp without time zone
);

CREATE UNIQUE INDEX ON users(id, username, email);
