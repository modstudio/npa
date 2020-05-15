const categoryName = `
  case
    when categories.category_type_id = 1 AND ifnull(categories.description, '') <> ''
      THEN categories.description
    when category_contact.company_name <> '' then category_contact.company_name
    else category_contact.first_name || ' ' || category_contact.last_name
  end
`;

const relatedCategoryName = `
  case
    when related_category.category_type_id = 1 AND ifnull(related_category.description, '') <> ''
      THEN related_category.description
    when related_category_contact.company_name <> '' then related_category_contact.company_name
    else related_category_contact.first_name || ' ' || related_category_contact.last_name
  end
`;

const categorySubText = `
  case 
    when categories.category_type_id = 1 THEN 
      case
        when ifnull(categories.description, '') <> '' THEN
          case 
            when category_contact.company_name <> '' then category_contact.company_name
            else category_contact.first_name || ' ' || category_contact.last_name
          end
        else ''
      end
    when categories.category_type_id = 2 THEN related_category.description
    when categories.category_type_id = 3 THEN categories.description
    when category_contact.company_name <> '' then category_contact.first_name || ' ' || category_contact.last_name
    else ''
  end
`;

export { categoryName, relatedCategoryName, categorySubText };
