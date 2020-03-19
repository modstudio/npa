export default `CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL,
  transaction_type_id INTEGER NOT NULL,
  transaction_method_id INTEGER,
  number VARCHAR(255),
  cause_id INTEGER,
  loan_id INTEGER,
  pikadon_id INTEGER,
  pledge_id INTEGER,
  contact_id INTEGER,
  amount REAL NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (transaction_type_id)
    REFERENCES transaction_types (id),
  FOREIGN KEY (transaction_method_id)
    REFERENCES transaction_methods (id),  
  FOREIGN KEY (contact_id)
    REFERENCES contacts (id),
  FOREIGN KEY (loan_id)
    REFERENCES loans (id),
  FOREIGN KEY (pikadon_id)
    REFERENCES pikadons (id), 
  FOREIGN KEY (pledge_id)
    REFERENCES pledges (id),              
  FOREIGN KEY (cause_id)
    REFERENCES causes (id)
);`;
