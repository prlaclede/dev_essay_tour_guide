DROP DATABASE IF EXISTS essaytourdb; 
CREATE DATABASE essaytourdb;
DROP USER essaytouradmin; 
CREATE USER essaytouradmin IDENTIFIED BY 'essaytourpass'; 
USE essaytourdb;

DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    account_name VARCHAR(20) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS instructions;
CREATE TABLE instructions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL, 
    drive_id VARCHAR(140) NOT NULL
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
    email VARCHAR(40) NOT NULL UNIQUE, 
    password VARCHAR(300),
    first_name VARCHAR(20), 
    last_name VARCHAR(20),
    account_type_id_fk INT NOT NULL REFERENCES accounts(id), 
    instr_id_fk INT NOT NULL REFERENCES instructions(id)
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


GRANT ALL ON * TO essaytouradmin;

INSERT INTO accounts (account_name) VALUES ('admin');
INSERT INTO accounts (account_name) VALUES ('user');
INSERT INTO accounts (account_name) VALUES ('guest');

INSERT INTO instructions (name, drive_id) VALUES ('Admin Instructions', '...');
INSERT INTO instructions (name, drive_id) VALUES ('User Instructions', '...');
INSERT INTO instructions (name, drive_id) VALUES ('Guest Instructions', '...');

INSERT INTO markers (address, latitude, longitude) VALUES ('Fredericksburg, VA 22401', 38.306095, -77.469753);
INSERT INTO markers (address, latitude, longitude) VALUES ('...', 38.301511, -77.474094);
INSERT INTO markers (address, latitude, longitude) VALUES ('...', 38.302521, -77.467195);
INSERT INTO markers (address, latitude, longitude) VALUES ('...', 38.305831, -77.468792);
INSERT INTO markers (address, latitude, longitude) VALUES ('...', 38.304945, -77.463134);
INSERT INTO markers (address, latitude, longitude) VALUES ('...', 38.303929, -77.460035);


INSERT INTO users (email, password, first_name, last_name, pending, account_type_id_fk, instr_id_fk) 
    VALUES ('admin@admin.com', MD5('adminp@$$'), 'Ally', 'Gator', false,  1, 1);
INSERT INTO users (email, password, first_name, last_name, pending, account_type_id_fk, instr_id_fk) 
    VALUES ('basic@email.com', MD5('basicpass'), 'Mac', "N'Cheese", false,  2, 2);
INSERT INTO users (email, password, first_name, last_name, pending, account_type_id_fk, instr_id_fk) 
    VALUES ('jack@email.com', MD5('jackpass'), 'Jack', "O'lantran", false,  2, 2);
INSERT INTO users (email, first_name, last_name, pending, account_type_id_fk, instr_id_fk) 
    VALUES ('test@test.com', 'test', "tester", true,  2, 2);

INSERT INTO essays (title, drive_id, doc_link, marker_id_fk, user_id_fk) VALUES ('Kenmore Park Essay', '...', '...', 1, 1);
INSERT INTO essays (title, drive_id, doc_link, marker_id_fk, user_id_fk) VALUES ('UMW essay', '...', '...', 2, 1);
INSERT INTO essays (title, drive_id, doc_link, marker_id_fk, user_id_fk) VALUES ('Confederate Essay', '...', '...', 3, 1);
INSERT INTO essays (title, drive_id, doc_link, marker_id_fk, user_id_fk) VALUES ('Mary Wash Monument Essay', '...', '...', 4, 1);
INSERT INTO essays (title, drive_id, doc_link, marker_id_fk, user_id_fk) VALUES ('Mary Wash House Essay', '...', '...', 5, 1);
INSERT INTO essays (title, drive_id, doc_link, marker_id_fk, user_id_fk) VALUES ("Great eats in F'Burg", '...', '...', 6, 1);

