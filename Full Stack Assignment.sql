CREATE TABLE WAUser (
    user_id INTEGER PRIMARY KEY,
    given_name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    display_pic VARBINARY,
);

CREATE TABLE WAGroup (
    group_id INTEGER PRIMARY KEY,
    phone_number TEXT NOT NULL,
    contact_name TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE WAGroupMembers (
    group_id INTEGER REFERENCES Group (group_id),
    user_id INTEGER REFERENCES User (user_id),
    added_at TIMESTAMP NOT NULL,
    removed_at TIMESTAMP,
    PRIMARY KEY (group_id, user_id)
);

CREATE TABLE WAMessage (
    message_id INTEGER PRIMARY KEY,
    group_id INTEGER REFERENCES Group (group_id),
    user_id INTEGER REFERENCES User (user_id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP NOT NULL
);
