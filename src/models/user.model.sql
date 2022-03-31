CREATE TABLES user((id) ,INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                  firstName VARCHAR(30) NOT NULL, 
                  lastName VARCHAR(30) NOT NULL,
                  email VARCHAR(30) NOT NULL UNIQUE,
                  phoneNumber VARCHAR(30) NOT NULL,
                  password VARCHARr(30) NOT NULL,
                  isVerified BOOLEAN NOT NULL DEFAULT 0,
                  role ENUM('user','admin') NOT NULL DEFAULT "user",
                  );