export default `
ALTER TABLE cities
    ADD COLUMN sort_order INTEGER DEFAULT 0;
ALTER TABLE cities
    ADD COLUMN is_inactive INTEGER DEFAULT 0;
UPDATE cities SET sort_order = id;
`;
