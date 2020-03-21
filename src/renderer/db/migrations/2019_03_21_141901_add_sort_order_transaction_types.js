export default `
  ALTER TABLE transaction_types
    ADD COLUMN sort_order INTEGER DEFAULT 0;
  UPDATE transaction_types set sort_order = case
    when id <= 2 then id
    when id = 7 then 3
    when id > 2 then id + 1
    end;
`;
