export default `CREATE TABLE banks (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  note TEXT,
  is_inactive INTEGER DEFAULT 0,
  is_excluded_from_full_export INTEGER DEFAULT 0
);
`;
