export default `
    INSERT INTO cities (city, state, zip, country)
    select city, max(state) as state, max(zip) as zip, country from contacts where city is not null AND city  <> '' group by city, country;
`;
