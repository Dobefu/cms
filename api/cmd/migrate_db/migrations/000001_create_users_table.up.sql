CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users(
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY UNIQUE,
  username citext NOT NULL UNIQUE CONSTRAINT username_length CHECK (CHAR_LENGTH(username) <= 64),
  email citext NOT NULL UNIQUE CONSTRAINT email_length CHECK (CHAR_LENGTH(email) <= 254),
  password varchar(255) NOT NULL,
  status boolean NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp without time zone NOT NULL DEFAULT NOW(),
  last_login timestamp without time zone
);

CREATE UNIQUE INDEX ON users(id, username, email);
