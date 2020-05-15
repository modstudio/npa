export default `UPDATE categories
  SET description = name, name = null
  WHERE category_type_id = 1
;`;
