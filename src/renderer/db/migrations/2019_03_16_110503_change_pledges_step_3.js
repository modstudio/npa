export default `
-- copy data from the table to the new_table
INSERT INTO pledges_new (id, contact_id, cause_id, note, sort_order)
SELECT id, contact_id, cause_id, NOTE as note, sort_order
FROM pledges;
`;
