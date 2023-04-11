-- Active: 1679165266479@@127.0.0.1@3306
CREATE DATABASE database_click;
USE database_click;

CREATE TABLE users(
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(250) NOT NULL

); 

DESCRIBE users;

-- TABLA PUBLICACIONES

CREATE TABLE posts(
    id_post INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT(11)NOT NULL,
    text TEXT NOT NULL,
    url VARCHAR (255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

DESCRIBE posts; 