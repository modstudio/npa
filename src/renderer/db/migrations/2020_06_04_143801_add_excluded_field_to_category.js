export default `ALTER TABLE categories
ADD COLUMN is_excluded_from_full_export INTEGER DEFAULT 0
;`;
