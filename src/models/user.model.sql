
CREATE TABLES users(id int PRIMARY KEY AUTO_INCREMENT NOT NULL,
                  firstname varchar(30) NOT NULL, 
                  lastname varchar(30) NOT NULL,
                  othernames varchar(30) NOT NULL,
                  email varchar(30) NOT NULL UNIQUE,
                  phonenumber varchar(30) NOT NULL,
                  password varchar(30) NOT NULL,
                  isVerified boolean NOT NULL DEFAULT 0,
                  role enum('user', 'admin') NOT NULL DEFAULT false,
                  );