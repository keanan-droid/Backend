CREATE TABLE Accounts(
  id BIGSERIAL PRIMARY KEY,
  firstname VARCHAR(89) NOT NULL,
  surname VARCHAR(89) NOT NULL,
  id_number VARCHAR(100) NOT NULL,
  age VARCHAR(100) NOT NULL,
  phonenumber VARCHAR(89) NOT NULL,
  role ROLE NOT NULL
);

CREATE TYPE ROLE AS ENUM(
    'admin',
    'user'
);