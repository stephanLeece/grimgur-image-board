DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tags;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    image VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    likes int,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    imageid int NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    imageid int NOT NULL,
    tag VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
