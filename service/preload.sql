CREATE TABLE IF NOT EXISTS test_list (
    id integer not null primary key,
    name text not null unique,
    date datetime not null default current_date,
    grade int,
    class int
);

CREATE TABLE IF NOT EXISTS subject (
    id integer not null primary key,
    subject text not null unique,
    subject_name text not null unique,
    full_score int not null default 100,
    state bool not null default false,
    color text not null default '250,150,170'
);

CREATE TABLE IF NOT EXISTS correct_book(
    id integer not null primary key,
    date datetime not null default current_timestamp,
    subject text not null,
    question text not null unique,
    answer text not null,
    test text,
    lose_analyze text
);


INSERT INTO subject (subject, subject_name, full_score) VALUES ('ch','语文',150),
                                                               ('ma','数学',150),
                                                               ('en','英语',150),
                                                               ('ph','物理',100),
                                                               ('che','化学',100),
                                                               ('bi','生物',100),
                                                               ('hi','历史',100),
                                                               ('po','政治',100),
                                                               ('ge','地理',100);

ALTER TABLE test_list ADD COLUMN ch int;
ALTER TABLE test_list ADD COLUMN ma int;
ALTER TABLE test_list ADD COLUMN en int;
ALTER TABLE test_list ADD COLUMN ph int;
ALTER TABLE test_list ADD COLUMN che int;
ALTER TABLE test_list ADD COLUMN bi int;
ALTER TABLE test_list ADD COLUMN hi int;
ALTER TABLE test_list ADD COLUMN po int;
ALTER TABLE test_list ADD COLUMN ge int;
