
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS author (
    title TEXT,
    subtitle TEXT,
    name TEXT
);

CREATE TABLE IF NOT EXISTS articles (
	_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(50),
    subtitle VARCHAR(50),
    article  VARCHAR(1000), 
    created DATE,
    modified DATE,
	publishedStatus BOOL,
    publishedDate DATE,
    likes INT
);

CREATE TABLE IF NOT EXISTS comments (
    id INT,
    comment VARCHAR(200),
    date DATE
);

INSERT INTO author (title, subtitle, name) VALUES ('UoL Student Blog','A blog with the latest news in UoL','Student');

COMMIT;

