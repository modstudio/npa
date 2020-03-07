export default `CREATE TABLE transaction_types (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255)
);
INSERT INTO transaction_types (name) 
VALUES 
  ('Transfer'),
  ('Donation'),
  ('Distribution'),
  ('Loan given'),
  ('Loan payment'),
  ('Pikadon received'),
  ('Pikadon returned'),
  ('Expense'),
  ('Pledge'),
  ('Pledge payment'),
  ('Starting Balance');
`;
