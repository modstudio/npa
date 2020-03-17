export default `
-- disable foreign key constraint check
PRAGMA foreign_keys=off;
CREATE TABLE pikadons_new (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER NOT NULL,
  note TEXT,
  FOREIGN KEY (contact_id)
    REFERENCES contacts (id)
);
-- drop the table
DROP TABLE pikadons;
ALTER TABLE pikadons_new RENAME TO pikadons;
PRAGMA foreign_keys=on;
`;
