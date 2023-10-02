CREATE TABLE users (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    extension VARCHAR(10) NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_data LONGBLOB NOT NULL
);