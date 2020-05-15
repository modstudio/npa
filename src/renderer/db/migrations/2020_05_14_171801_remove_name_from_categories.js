export default `
-- disable foreign key constraint check
PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

CREATE TABLE categories_new (
  id INTEGER PRIMARY KEY,
  category_type_id INTEGER,
  contact_id INTEGER,
  category_group_id INTEGER,
  distribution_class_id INTEGER,
  description VARCHAR(255),
  related_category_id INTEGER,
  note TEXT,
  sort_order INTEGER DEFAULT 0,
  is_inactive INTEGER DEFAULT 0,
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

INSERT INTO categories_new (id, category_type_id, contact_id, category_group_id,
  distribution_class_id, description, related_category_id, note, sort_order, is_inactive)
SELECT id, category_type_id, contact_id, category_group_id,
  distribution_class_id, description, related_category_id, note, sort_order, is_inactive
FROM categories;

DROP TABLE categories;
ALTER TABLE categories_new RENAME TO categories;

COMMIT;
PRAGMA foreign_keys=on;
`;
