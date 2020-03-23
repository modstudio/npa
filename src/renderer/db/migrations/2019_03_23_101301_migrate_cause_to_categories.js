export default `
INSERT INTO category_groups (category_type_id, name, note, sort_order, old_id)
  SELECT 1 as category_type_id, name, note, sort_order, id as old_id FROM cause_groups;
INSERT INTO categories (category_type_id, name, contact_id, category_group_id, 
  distribution_class_id, note, sort_order, old_id)
  SELECT 1 as category_type_id, causes.name, causes.contact_id,
    category_groups.id as category_group_id, causes.distribution_class_id, 
    causes.note, causes.sort_order, causes.id as old_id
    FROM causes JOIN category_groups on causes.cause_group_id = category_groups.old_id;
`;
