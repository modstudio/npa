export default `
INSERT INTO category_types (name) values ('General Donation');

INSERT INTO transaction_types (name, sort_order) VALUES  ('General Donation', 12);

UPDATE transaction_types SET sort_order = 13 WHERE id = 10;
`;
