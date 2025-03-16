CREATE TABLE IF NOT EXISTS content_types(
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY UNIQUE,
  title varchar(255) NOT NULL,
  author_id bigint NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp without time zone NOT NULL DEFAULT NOW(),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE UNIQUE INDEX ON content_types(id);
CREATE INDEX ON content_types(author_id);
