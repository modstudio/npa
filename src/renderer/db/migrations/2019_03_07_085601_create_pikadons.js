export default `CREATE TABLE pikadons (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER NOT NULL,
  NOTE TEXT,
  FOREIGN KEY (contact_id)
    REFERENCES contacts (id)
);`;
