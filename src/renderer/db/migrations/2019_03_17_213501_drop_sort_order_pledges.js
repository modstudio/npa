export default `
-- disable foreign key constraint check
PRAGMA foreign_keys=off;
CREATE TABLE IF NOT EXISTS pledges_new ( 
  id INTEGER PRIMARY KEY,
  contact_id INTEGER NOT NULL,
  cause_id INTEGER NOT NULL,
  note TEXT,
  FOREIGN KEY (contact_id)
    REFERENCES contacts (id),
  FOREIGN KEY (cause_id)
    REFERENCES causes (id)
);
INSERT INTO pledges_new (id, contact_id, cause_id, note)
SELECT id, contact_id, cause_id, note FROM pledges;
-- drop the table
DROP TABLE pledges;
ALTER TABLE pledges_new RENAME TO pledges;
PRAGMA foreign_keys=on;
`;
