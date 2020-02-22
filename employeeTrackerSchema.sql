DROP DATABASE IF EXISTS trackerDB;
CREATE database trackerDB;

USE trackerDB;

CREATE TABLE employee(
  id INT NOT NULL
  AUTO_INCREMENT,
  first_name VARCHAR (30) NOT NULL,
  last_name VARCHAR (30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY(id)
);

  CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
  );

  CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
  );


SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;


-- CREATE TABLE categories(
--     categoryId INT AUTO_INCREMENT PRIMARY KEY,
--     categoryName VARCHAR(100) NOT NULL
-- ) ENGINE=INNODB;
 
-- CREATE TABLE products(
--     productId INT AUTO_INCREMENT PRIMARY KEY,
--     productName varchar(100) not null,
--     categoryId INT,
--     CONSTRAINT fk_category
--     FOREIGN KEY (categoryId) 
--         REFERENCES categories(categoryId)
-- ) ENGINE=INNODB;

-- --inner join syntax
-- select * from 'firsttable' INNER JOIN 'othertable' ON firsttable.sharedCol = othertable.sharedCol;
--     -- get what matches

-- --left join
-- select * from 'firsttable' LEFT JOIN 'othertable' ON firsttable.sharedCol = othertable.sharedCol;
--     -- get what matches and all from 'firsttable'- its on left side of join

-- --right join
-- select * from 'firsttable' right JOIN 'othertable' ON firsttable.sharedCol = othertable.sharedCol;
--     -- get what matches and all from 'othertable'- its on right side of join


-- --full join
-- select * from 'firsttable' full JOIN 'othertable' ON firsttable.sharedCol = othertable.sharedCol;
--     -- get what matches and all from both tables

-- --alias tables

-- select ft.*, ot.someColumn
-- FROM 'firsttable' as ft 
-- LEFT JOIN 'othertable' as ot ON ft.sharedCol = ot.sharedCol;


-- --filter tables - where
-- select * 
-- select ft.*, ot.someColumn -- choose what shows up from each table
-- FROM 'firsttable' as ft 
-- LEFT JOIN 'othertable' as ot ON ft.sharedCol = ot.sharedCol
-- WHERE ot.someColumn="colValue". --only shows datat with "colValue".
    
    -- CASCADE delets parent and child row, default does not let you delete pasrenet (RESTRICT)

    3 table join list all empoloyess by DESCRIPTION
    1. dept alphabetical
    

