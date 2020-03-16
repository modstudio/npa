export default `
CREATE TABLE loans_new (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER NOT NULL,
  description VARCHAR(255),
  note TEXT,
  sort_order INTEGER DEFAULT 0,  
  FOREIGN KEY (contact_id)
    REFERENCES contacts (id)
);
`;
