DROP DATABASE IF EXISTS essayTourDB; 
CREATE DATABASE essayTourDB;
DROP USER IF EXISTS essayTourAdmin; 
CREATE USER essayTourAdmin with password 'essayAdminPass'; 
\c essayTourDB;
CREATE EXTENSION pgcrypto; 

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users 
(
    user_id serial, 
    inst_id_fk NOT NULL references instructions(inst_id),
    email varchar(40) NOT NULL, 
    password varchar(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE(username)
);

DROP TABLE IF EXISTS documents;
CREATE TABLE IF NOT EXISTS documents
(
    doc_id serial,
    user_id_fk serial NOT NULL references users(user_id),
    doc_name varchar(140) NOT NULL,
    doc_location text NOT NULL,
    PRIMARY KEY (doc_id)
);

DROP TABLE IF EXISTS instructions;
CREATE TABLE IF NOT EXISTS instructions
(
    inst_id serial,
    inst_name varchar(50) NOT NULL,
    inst_type varchar(20) NOT NULL, 
    inst_location text NOT NULL,
    PRIMARY KEY (inst_id)
);

DROP TABLE IF EXISTS locations;
CREATE TABLE IF NOT EXISTS locations
(
    loc_id serial,
    doc_id_fk serial NOT NULL references documents(doc_id),
    loc_name varchar(50) NOT NULL,
    map_location_fk int NOT NULL references users(id),
    PRIMARY KEY (loc_id)
);

GRANT select, insert on users, messages, subscription, rooms to chat;
GRANT ALL on sequence users_id_seq, messages_id_seq, subscription_id_seq, rooms_id_seq to chat;

insert into users (username, password) VALUES ('test', crypt('testpass', gen_salt('bf')));
insert into users (username, password) VALUES ('test2', crypt('testpass2', gen_salt('bf')));

INSERT INTO messages (name_fk, message, room) VALUES ('test', 'first message', default);
INSERT INTO messages (name_fk, message, room) VALUES ('test', 'second message', default);
INSERT INTO messages (name_fk, message, room) VALUES ('test2', 'first message second user', default);
INSERT INTO messages (name_fk, message, room) VALUES ('test2', 'second message second user', default);

INSERT INTO rooms (roomName) VALUES ('General');
