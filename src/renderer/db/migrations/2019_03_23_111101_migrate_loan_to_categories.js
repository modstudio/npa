export default `
INSERT INTO categories (category_type_id, contact_id, description, 
  note, old_id)
SELECT 3 as category_type_id, loans.contact_id,
  loans.description, loans.note,
  loans.id as old_id
  FROM loans;
`;
