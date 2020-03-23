export default `CREATE TABLE category_groups (
  id INTEGER PRIMARY KEY,
  category_type_id INTEGER,
  name VARCHAR(255),
  note TEXT,
  sort_order INTEGER DEFAULT 0,
  old_id INTEGER,
  FOREIGN KEY (category_type_id)
    REFERENCES category_types (id)
);
`;
