export default `CREATE TABLE category_types (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255)
);
INSERT INTO category_types (name) 
VALUES 
  ('Cause'),
  ('Pledge'),
  ('Loan'),
  ('Pikadon');
`;
