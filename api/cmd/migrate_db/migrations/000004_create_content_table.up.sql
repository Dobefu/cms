CREATE TABLE IF NOT EXISTS content(
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY UNIQUE,
  content_type bigint,
  title varchar(255) NOT NULL,
  author_id bigint NOT NULL,
  published boolean NOT NULL DEFAULT FALSE,
  created_at timestamp without time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp without time zone NOT NULL DEFAULT NOW(),
  FOREIGN KEY (author_id) REFERENCES users(id),
  CONSTRAINT content_type_id FOREIGN KEY (content_type) REFERENCES content_types(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX ON content(id);
CREATE INDEX ON content(author_id);
