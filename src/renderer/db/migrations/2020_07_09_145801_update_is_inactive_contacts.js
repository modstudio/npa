export default `
UPDATE contacts SET is_inactive = 0 WHERE is_inactive is null;
`;
