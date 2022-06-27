CREATE TABLE BOOKINGS(
    id BIGSERIAL PRIMARY KEY,
    booker INTEGER REFERENCES Account(id) NOT NULL,
    movie INTEGER REFERENCES Movies(id) NOT NULL,
    checkedOut DATE NOT NULL,
    isExpired boolean NOT NULL
);


box office green button from dstv