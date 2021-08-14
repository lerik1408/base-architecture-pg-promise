-- update
ALTER TABLE  "user" ADD COLUMN username varchar(225) UNIQUE;
-- downgrade
ALTER TABLE "user" DROP COLUMN username;