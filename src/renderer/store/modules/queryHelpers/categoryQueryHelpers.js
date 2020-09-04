const categoryName = `
  case
    when categories.category_type_id = 1 AND categories.is_multiple_recipient = 1
      THEN 'Multiple'
    when category_contact.company_name <> '' then category_contact.company_name
    else category_contact.first_name || ' ' || category_contact.last_name
  end
`;

const relatedCategoryName = `
  case
    when related_category.category_type_id = 1 AND related_category.is_multiple_recipient = 1
      THEN 'Multiple'
    when related_category_contact.company_name <> '' then related_category_contact.company_name
    else related_category_contact.first_name || ' ' || related_category_contact.last_name
  end
`;

const categorySubText = `
  case 
    when categories.category_type_id = 1 OR categories.category_type_id = 3
      THEN categories.description
    when categories.category_type_id = 2 THEN ${relatedCategoryName}
    when category_contact.company_name <> '' then category_contact.first_name || ' ' || category_contact.last_name
    else ''
  end
`;

export { categoryName, relatedCategoryName, categorySubText };
