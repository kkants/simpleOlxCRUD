CREATE TABLE users
(
  id INT NOT NULL
  AUTO_INCREMENT,
   username VARCHAR
  (225) UNIQUE NOT NULL,
   password VARCHAR
  (255) NOT NULL,
   email VARCHAR
  (255) UNIQUE NOT NULL,
   PRIMARY KEY
  (id)
 );

  CREATE TABLE items
  (
    id INT NOT NULL
    AUTO_INCREMENT,
   created_at INT NOT NULL,
   title VARCHAR
    (255) NOT NULL,
   img VARCHAR
    (255) NULL,
   price DECIMAL
    (10,2),
   user_id INT,
   PRIMARY KEY
    (id),
   FOREIGN KEY
    (user_id) REFERENCES users
    (id) ON
    DELETE CASCADE
 );