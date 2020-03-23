export default `CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  category_type_id INTEGER,
  name VARCHAR(255),
  contact_id INTEGER,
  category_group_id INTEGER,
  distribution_class_id INTEGER,
  description VARCHAR(255),
  related_category_id INTEGER,
  note TEXT,
  sort_order INTEGER DEFAULT 0,
  old_id INTEGER,
  FOREIGN KEY (category_type_id)
    REFERENCES category_types (id),
  FOREIGN KEY (contact_id)
    REFERENCES contacts (id),
  FOREIGN KEY (category_group_id)
    REFERENCES category_groups (id),        
  FOREIGN KEY (distribution_class_id)
    REFERENCES distribution_classes (id),
  FOREIGN KEY (related_category_id)
    REFERENCES categories (id)  
);
`;
