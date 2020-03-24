export default `
-- disable foreign key constraint check
PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

CREATE TABLE transactions_new (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL,
  transaction_type_id INTEGER NOT NULL,
  transaction_method_id INTEGER,
  number VARCHAR(255),
  category_id INTEGER,
  transfer_category_id INTEGER,
  contact_id INTEGER,
  amount REAL NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (transaction_type_id)
    REFERENCES transaction_types (id),
  FOREIGN KEY (transaction_method_id)
    REFERENCES transaction_methods (id),  
  FOREIGN KEY (category_id)
    REFERENCES categories (id),
  FOREIGN KEY (transfer_category_id)
    REFERENCES categories (id),    
  FOREIGN KEY (contact_id)
    REFERENCES contacts (id)
);
INSERT INTO transactions_new (date, transaction_type_id, transaction_method_id, number,
  category_id, contact_id, amount, note, created_at, updated_at)
  SELECT date, transaction_type_id, transaction_method_id, number,
  category_id, contact_id, amount, note, created_at, updated_at
  FROM transactions;
-- drop the table
DROP TABLE transactions;
ALTER TABLE transactions_new RENAME TO transactions;

COMMIT;
PRAGMA foreign_keys=on;
`;
