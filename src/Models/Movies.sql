CREATE TABLE Movies(
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(89) NOT NULL UNIQUE,
  genre VARCHAR(89) NOT NULL,
  ageRestriction VARCHAR(89) NOT NULL,
  imageUrl VARCHAR(89) NOT NULL,
  isAvaliable boolean
);