export default `
INSERT INTO categories (category_type_id, contact_id, related_category_id, 
  note, old_id)
SELECT 2 as category_type_id, pledges.contact_id,
  cat.id as related_category_id, pledges.note,
  pledges.id as old_id
  FROM pledges JOIN categories cat ON pledges.cause_id = cat.old_id;
`;
