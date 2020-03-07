export default `CREATE TABLE causes (
  id INTEGER PRIMARY KEY,
  cause_group_id INTEGER NOT NULL,
  contact_id INTEGER NOT NULL,
  distribution_class_id INTEGER NOT NULL,
  name VARCHAR(255),
  note TEXT,
  FOREIGN KEY (cause_group_id)
    REFERENCES cause_groups (id)
  FOREIGN KEY (contact_id)
    REFERENCES contacts (id)
  FOREIGN KEY (distribution_class_id)
    REFERENCES distribution_classes (id)
);`;
