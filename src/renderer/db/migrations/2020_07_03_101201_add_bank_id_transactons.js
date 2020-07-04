export default `
  ALTER TABLE transactions
    ADD COLUMN bank_id INTEGER REFERENCES banks(id);
`;
