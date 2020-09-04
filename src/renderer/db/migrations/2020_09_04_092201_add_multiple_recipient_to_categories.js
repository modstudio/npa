export default `
ALTER TABLE categories
    ADD COLUMN is_multiple_recipient INTEGER DEFAULT 0;
`;
