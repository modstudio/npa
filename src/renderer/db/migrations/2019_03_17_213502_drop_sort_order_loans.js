export default `
-- disable foreign key constraint check
PRAGMA foreign_keys=off;
CREATE TABLE IF NOT EXISTS loans_new ( 
  id INTEGER PRIMARY KEY,
  contact_id INTEGER NOT NULL,
  description VARCHAR(255),
  note TEXT,
  FOREIGN KEY (contact_id)
    REFERENCES contacts (id)
);
INSERT INTO loans_new (id, contact_id, description, note)
SELECT id, contact_id, description, note FROM loans;
-- drop the table
DROP TABLE loans;
ALTER TABLE loans_new RENAME TO loans;
PRAGMA foreign_keys=on;
`;
