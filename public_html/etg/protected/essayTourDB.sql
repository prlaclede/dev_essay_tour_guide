DROP DATABASE IF EXISTS essay_tour_db ; 
CREATE DATABASE essay_tour_db ;
DROP USER essay_tour_user; 
CREATE USER essay_tour_user IDENTIFIED BY 'essaytourpass'; 
USE essay_tour_db ;

DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    account_name VARCHAR(20) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS markers;
CREATE TABLE markers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pending boolean NOT NULL DEFAULT true,
    address VARCHAR(200) NOT NULL, 
    latitude DOUBLE(8,6) NOT NULL, 
    longitude DOUBLE(8,6) NOT NULL
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pending boolean DEFAULT true,
    token VARCHAR(300),
    email VARCHAR(40) NOT NULL UNIQUE, 
    password VARCHAR(300),
    first_name VARCHAR(20), 
    last_name VARCHAR(20),
    account_type_id_fk INT NOT NULL REFERENCES accounts(id)
);

DROP TABLES IF EXISTS admin_code;
CREATE TABLE admin_code (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(300)
);

DROP TABLE IF EXISTS essays;
CREATE TABLE essays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pending boolean NOT NULL DEFAULT true,
    title VARCHAR(140) NOT NULL,
    drive_id VARCHAR(140) NOT NULL,
    doc_link VARCHAR(300) NOT NULL, 
    marker_id_fk INT NOT NULL REFERENCES markers(id),
    user_id_fk INT NOT NULL REFERENCES users(id)
);


GRANT ALL PRIVILEGES ON essay_tour_db.* TO essay_tour_user;

INSERT INTO accounts (account_name) VALUES ('admin');
INSERT INTO accounts (account_name) VALUES ('user');

INSERT INTO users (email, password, first_name, last_name, pending, account_type_id_fk) 
    VALUES ('admin@admin.com', '5bb1cae532fc996d5cbd3f78715d213a9f875cf765d7e37348834b70f97e55a5', 'Ally', 'Gator', false,  1);



