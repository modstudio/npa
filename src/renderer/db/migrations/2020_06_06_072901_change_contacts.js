export default `
-- disable foreign key constraint check
PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

CREATE TABLE contacts_new (
    id INTEGER PRIMARY KEY,
    company_name VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(25),
    address VARCHAR(255),
    city_id INTEGER,
    phone_ext VARCHAR(25),
    id_number VARCHAR(255),
    is_inactive INTEGER,
  FOREIGN KEY (city_id)
    REFERENCES cities (id)    
);

INSERT INTO contacts_new (id, company_name, first_name, last_name, phone_number, address,
    city_id, phone_ext, id_number, is_inactive)
  SELECT id, company_name, first_name, last_name, phone_number, address,
  (SELECT id FROM cities WHERE city = contacts.city) as city_id,
  phone_ext, id_number, is_inactive
  FROM contacts;

-- drop the table
DROP TABLE contacts;
ALTER TABLE contacts_new RENAME TO contacts;

COMMIT;
PRAGMA foreign_keys=on;
`;
