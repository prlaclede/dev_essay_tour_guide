DROP DATABASE IF EXISTS essaytourdb; 
CREATE DATABASE essaytourdb;
DROP USER IF EXISTS essaytouradmin; 
CREATE USER essaytouradmin with password 'essaytourpass'; 
\c essaytourdb;
CREATE EXTENSION pgcrypto; 

DROP TABLE IF EXISTS accounts;
CREATE TABLE IF NOT EXISTS accounts
(
    id serial, 
    account_name varchar(20) NOT NULL,
    PRIMARY KEY(id),
    UNIQUE(account_name)
);

DROP TABLE IF EXISTS instructions;
CREATE TABLE IF NOT EXISTS instructions
(
    id serial,
    name varchar(20) NOT NULL, 
    location text NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS markers;
CREATE TABLE IF NOT EXISTS markers
(
    id serial,
    name varchar(50) NOT NULL,
    address varchar(200) NOT NULL, 
    lat decimal NOT NULL, 
    long decimal NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users 
(
    id serial, 
    email varchar(40) NOT NULL, 
    password varchar(300) NOT NULL,
    first_name varchar(20), 
    last_name varchar(20),
    pending boolean default true,
    account_type_id_fk serial NOT NULL references accounts(id), 
    instr_id_fk serial NOT NULL references instructions(id),
    PRIMARY KEY (id),
    UNIQUE(email)
);

DROP TABLE IF EXISTS essays;
CREATE TABLE IF NOT EXISTS essays
(
    id serial,
    title varchar(140) NOT NULL,
    location text NOT NULL,
    pending boolean default true,
    marker_id_fk serial NOT NULL references markers(id),
    user_id_fk serial NOT NULL references users(id),
    PRIMARY KEY (id)
);

GRANT select, insert on users, markers, instructions, essays, accounts to essayTourAdmin;
GRANT ALL on sequence users_id_seq, markers_id_seq, instructions_id_seq, essays_id_seq, accounts_id_seq to essayTourAdmin;

INSERT INTO accounts (account_name) VALUES ('admin');
INSERT INTO accounts (account_name) VALUES ('user');
INSERT INTO accounts (account_name) VALUES ('guest');

INSERT INTO instructions (name, location) VALUES ('Admin Instructions', 'www.admin.placeholder.com');
INSERT INTO instructions (name, location) VALUES ('User Instructions', 'www.user.placeholder.com');
INSERT INTO instructions (name, location) VALUES ('Guest Instructions', 'www.guest.placeholder.com');

INSERT INTO markers (name, address, lat, long) VALUES ('Kenmore Park', 'Kenmore Ave, Fredericksburg, VA 22401', 38.306095, -77.469753);

INSERT INTO users (email, password, account_type_id_fk, instr_id_fk) VALUES ('admin', crypt('adminp@$$', gen_salt('bf')), 1, 1);

INSERT INTO essays (title, location, marker_id_fk, user_id_fk) VALUES ('Kenmore Park Essay', 'www.essay.placeholder.com', 1, 1);
