export default `
INSERT INTO categories (category_type_id, contact_id,
  note, old_id)
SELECT 4 as category_type_id, contact_id,
  note,
  id as old_id
  FROM pikadons;
`;
