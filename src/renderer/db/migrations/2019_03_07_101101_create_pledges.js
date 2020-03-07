export default `CREATE TABLE pledges (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER NOT NULL,
  cause_id INTEGER NOT NULL,
  NOTE TEXT,
  FOREIGN KEY (contact_id)
    REFERENCES contacts (id),
  FOREIGN KEY (cause_id)
    REFERENCES causes (id)
);`;
