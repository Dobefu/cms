CREATE TABLE IF NOT EXISTS state(
  name varchar(255) NOT NULL PRIMARY KEY UNIQUE,
  value varchar(255) NOT NULL
);
