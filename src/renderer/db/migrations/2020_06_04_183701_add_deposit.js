export default `
INSERT INTO transaction_types (name, sort_order) VALUES  ('Deposit', 11);

UPDATE transaction_types SET sort_order = 12 WHERE id = 10;
`;
