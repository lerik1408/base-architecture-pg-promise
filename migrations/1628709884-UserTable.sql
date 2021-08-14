-- update
CREATE TABLE "user" (
    "id" serial PRIMARY KEY,
    "fname" varchar(225) NOT NULL,
    "lname" varchar(225) NOT NULL,
    "isActive" bool DEFAULT true
);
-- downgrade
DROP TABLE "user";