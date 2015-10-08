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
    location TEXT NOT NULL
);

DROP TABLE IF EXISTS markers;
CREATE TABLE markers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(200) NOT NULL, 
    latitude MEDIUMINT NOT NULL, 
    longitude MEDIUMINT NOT NULL
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(40) NOT NULL UNIQUE, 
    password VARCHAR(300),
    first_name VARCHAR(20), 
    last_name VARCHAR(20),
    pending boolean DEFAULT true,
    account_type_id_fk INT NOT NULL REFERENCES accounts(id), 
    instr_id_fk INT NOT NULL REFERENCES instructions(id)
);

DROP TABLE IF EXISTS essays;
CREATE TABLE essays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(140) NOT NULL,
    location TEXT NOT NULL,
    pending boolean DEFAULT true,
    marker_id_fk INT NOT NULL REFERENCES markers(id),
    user_id_fk INT NOT NULL REFERENCES users(id)
);


GRANT ALL ON * TO essaytouradmin;

INSERT INTO accounts (account_name) VALUES ('admin');
INSERT INTO accounts (account_name) VALUES ('user');
INSERT INTO accounts (account_name) VALUES ('guest');

INSERT INTO instructions (name, location) VALUES ('Admin Instructions', 'www.admin.placeholder.com');
INSERT INTO instructions (name, location) VALUES ('User Instructions', 'www.user.placeholder.com');
INSERT INTO instructions (name, location) VALUES ('Guest Instructions', 'www.guest.placeholder.com');

INSERT INTO markers (name, address, latitude, longitude) 
    VALUES ('Kenmore Park', 'Kenmore Ave, Fredericksburg, VA 22401', 38.306095, -77.469753);
INSERT INTO markers (name, address, latitude, longitude) VALUES ('UMW', '...', 38.301511, -77.474094);

INSERT INTO users (email, password, first_name, last_name, pending, account_type_id_fk, instr_id_fk) 
    VALUES ('admin@admin.com', AES_ENCRYPT('adminp@$$', 'passpls'), 'Ally', 'Gator', false,  1, 1);
    
INSERT INTO users (email, pending, account_type_id_fk, instr_id_fk) VALUES ('tempUser@tmp.tmp', true,  2, 2);
INSERT INTO users (email, password, first_name, last_name, pending, account_type_id_fk, instr_id_fk) VALUES ('proto@type.com', crypt('protopass', gen_salt('bf')), 'proto', 'type', false, 2, 2);

INSERT INTO essays (title, location, marker_id_fk, user_id_fk) VALUES ('Kenmore Park Essay', 'www.essay.placeholder.com', 1, 1);
