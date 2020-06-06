export default `
UPDATE transaction_types SET sort_order = 0 WHERE id = 11;
UPDATE transaction_types SET sort_order = 1 WHERE id = 13;
UPDATE transaction_types SET sort_order = 2 WHERE id = 1;
`;
