-- Contact Manager
-- Group 24
CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

CREATE TABLE `Users` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `FirstName` VARCHAR(50) NOT NULL DEFAULT '',
  `LastName` VARCHAR(50) NOT NULL DEFAULT '',
  `Login` VARCHAR(50) NOT NULL DEFAULT '',
  `Password` VARCHAR(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

CREATE TABLE `Contacts` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `FirstName` VARCHAR(50) NOT NULL DEFAULT '',
  `LastName` VARCHAR(50) NOT NULL DEFAULT '',
  `Phone` VARCHAR(50) NOT NULL DEFAULT '',
  `Email` VARCHAR(50) NOT NULL DEFAULT '',
  `UserID` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`UserID`) REFERENCES `Users`(`ID`) ON DELETE CASCADE
) ENGINE = InnoDB;


-- User Permissions
CREATE USER 'TheBeast'@'%' IDENTIFIED BY 'WeLoveCOP4331';
GRANT ALL PRIVILEGES ON COP4331.* TO 'TheBeast'@'%';

-- Load test data
insert into Users (FirstName,LastName,Login,Password) VALUES ('Rick','Leinecker','RickL','COP4331');
insert into Users (FirstName,LastName,Login,Password) VALUES ('Sam','Hill','SamH','Test');

insert into Contacts (FirstName, LastName, Phone, Email, UserID) values ('Eva', 'Hocking', '123-4567-8910', 'eva@example.com', 1);
insert into Contacts (FirstName, LastName, Phone, Email, UserID) values ('Mason', 'Miles', '123-4567-0000', 'mason@example.com', 1);
insert into Contacts (FirstName, LastName, Phone, Email, UserID) values ('Jacob', 'Roberts', '123-4567-1111', 'jacob@example.com', 1);
insert into Contacts (FirstName, LastName, Phone, Email, UserID) values ('Diab', 'Ali', '123-4567-3333', 'diab@example.com', 2);
insert into Contacts (FirstName, LastName, Phone, Email, UserID) values ('Devon', 'Villalona', '123-4567-2222', 'devon@example.com', 2);

-- indexing
CREATE INDEX idx_userid ON Contacts (UserID);
CREATE INDEX idx_name ON Contacts (FirstName, LastName);

DELIMITER //

CREATE PROCEDURE AddContact (
  IN p_FirstName VARCHAR(50),
  IN p_LastName VARCHAR(50),
  IN p_Phone VARCHAR(50),
  IN p_Email VARCHAR(50),
  IN p_UserID INT
)
BEGIN
  INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID)
  VALUES (p_FirstName, p_LastName, p_Phone, p_Email, p_UserID);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE SearchContacts (
  IN p_UserID INT,
  IN p_SearchTerm VARCHAR(50)
)
BEGIN
  SELECT * FROM Contacts
  WHERE UserID = p_UserID
    AND (FirstName LIKE CONCAT('%', p_SearchTerm, '%')
      OR LastName LIKE CONCAT('%', p_SearchTerm, '%'));
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE UpdateContact (
  IN p_ID INT,
  IN p_FirstName VARCHAR(50),
  IN p_LastName VARCHAR(50),
  IN p_Phone VARCHAR(50),
  IN p_Email VARCHAR(50)
)
BEGIN
  UPDATE Contacts
  SET FirstName = p_FirstName,
      LastName = p_LastName,
      Phone = p_Phone,
      Email = p_Email
  WHERE ID = p_ID;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE DeleteContact (
  IN p_UserID INT,
  IN p_ID INT

)
BEGIN
  DELETE FROM Contacts WHERE ID = p_ID AND UserID = p_UserID;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE LoginUser (
  IN p_Login VARCHAR(50),
  IN p_Password VARCHAR(50)
)
BEGIN
  SELECT ID, FirstName, LastName FROM Users
  WHERE Login = p_Login AND Password = p_Password;
END //

DELIMITER ;



