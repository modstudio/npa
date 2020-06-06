export default `
UPDATE transaction_types SET sort_order = sort_order + 1 WHERE id >= 2;
UPDATE transaction_types SET sort_order = 2 WHERE id = 13;
`;
