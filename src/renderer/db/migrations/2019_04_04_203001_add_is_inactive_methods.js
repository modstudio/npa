export default `ALTER TABLE transaction_methods
ADD COLUMN is_inactive INTEGER DEFAULT 0
;`;
