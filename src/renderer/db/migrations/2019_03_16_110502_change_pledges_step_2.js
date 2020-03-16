export default `
-- Here you can drop column or rename column
CREATE TABLE IF NOT EXISTS pledges_new ( 
  id INTEGER PRIMARY KEY,
  contact_id INTEGER NOT NULL,
  cause_id INTEGER NOT NULL,
  note TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (contact_id)
    REFERENCES contacts (id),
  FOREIGN KEY (cause_id)
    REFERENCES causes (id)
);
`;
