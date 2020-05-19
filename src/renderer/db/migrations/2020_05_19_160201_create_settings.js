export default `CREATE TABLE settings (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  value VARCHAR(255)
);
CREATE UNIQUE INDEX name_unique on settings (name);

INSERT INTO settings (name, value)  VALUES ('is_auto_create_donation_for_pledge', '1');
`;
