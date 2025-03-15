CREATE TABLE IF NOT EXISTS sessions(
  user_id bigint PRIMARY KEY UNIQUE NOT NULL,
  token varchar(255) NOT NULL,
  updated_at timestamp without time zone NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX ON sessions(user_id);
