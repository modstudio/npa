import { categoryName, relatedCategoryName } from './categoryQueryHelpers';

function buildWhere(filter) {
  if (!filter) {
    return '1 = 1';
  }
  const where = ['1 = 1'];
  if (filter.type.length) {
    where.push(`transactions.transaction_type_id in (${filter.type.join()})`);
  }
  if (filter.bank.length) {
    where.push(`transactions.bank_id in (${filter.bank.join()})`);
  }
  if (filter.category.length) {
    where.push(`categories.category_type_id in (${filter.category.join()})`);
  }
  if (filter.method.length) {
    where.push(`transactions.transaction_method_id in (${filter.method.join()})`);
  }
  if (filter.contact.length) {
    where.push(`transactions.contact_id in (${filter.contact.join()})`);
  }
  if (filter.amount && filter.amount.from) {
    where.push(`transactions.amount >= ${filter.amount.from}`);
  }
  if (filter.amount && filter.amount.to) {
    where.push(`transactions.amount <= ${filter.amount.to}`);
  }
  if (filter.date && filter.date.from) {
    where.push(`transactions.date >= '${moment(filter.date.from).format('YYYY-MM-DD')}'`);
  }
  if (filter.date && filter.date.to) {
    where.push(`transactions.date <= '${moment(filter.date.to).format('YYYY-MM-DD')}'`);
  }
  if (filter.notes === 2) {
    where.push("transactions.note <> ''");
  }
  if (filter.inactive === 0) {
    where.push('(categories.id IS NULL OR categories.is_inactive = 0)');
  } else if (filter.inactive === 2) {
    where.push('(categories.id IS NULL OR categories.is_inactive = 1)');
  }

  if (filter.search) {
    const whereSearch = [];
    filter.search.split(' ').forEach((search) => {
      const whereOr = [
        `contacts.company_name like '%${search}%'`,
        `contacts.first_name like '%${search}%'`,
        `contacts.last_name like '%${search}%'`,
        `transaction_types.name like '%${search}%'`,
        `transaction_methods.name like '%${search}%'`,
        `transactions.number like '%${search}%'`,
        `${categoryName} like '%${search}%'`,
        `(transactions.transaction_type_id <> 11 AND categories.description like '%${search}%')`,
        `transactions.amount like '%${search}%'`,
      ];
      if (filter.notes === 1) {
        whereOr.push(`transactions.note like '%${search}%'`);
      }
      if (filter.category.includes(2)) {
        whereOr.push(`${relatedCategoryName} like '%${search}%'`);
      }
      whereSearch.push(`(${whereOr.join(' OR ')})`);
    });
    where.push(`(${whereSearch.join(' AND ')})`);
  }
  return where.join(' AND ');
}

function buildLimitOffset(page, pageSize = 50) {
  return `LIMIT ${pageSize} OFFSET ${pageSize * (page - 1)}`;
}

const transactionSubquery = `
  select transactions.*,
  categories.category_type_id,
    ${categoryName} as category_name,
    categories.description as category_description,
    ${relatedCategoryName} as related_category_name
  from transactions 
  LEFT JOIN categories ON transactions.category_id = categories.id
  LEFT JOIN contacts category_contact ON categories.contact_id = category_contact.id
  LEFT JOIN categories related_category 
  ON categories.related_category_id = related_category.id
  LEFT JOIN contacts related_category_contact
  ON related_category.contact_id = related_category_contact.id    
`;
const queryFrom = `
  FROM transactions 
  LEFT JOIN contacts ON transactions.contact_id = contacts.id
  JOIN transaction_types ON transactions.transaction_type_id = transaction_types.id
  LEFT JOIN transaction_methods ON transactions.transaction_method_id = transaction_methods.id
  LEFT JOIN categories ON transactions.category_id = categories.id
  LEFT JOIN contacts category_contact ON categories.contact_id = category_contact.id
  LEFT JOIN categories related_category 
    ON categories.related_category_id = related_category.id
  LEFT JOIN contacts related_category_contact
    ON related_category.contact_id = related_category_contact.id     
  -- Get transaction TO item
  LEFT JOIN (${transactionSubquery}) transfer_transaction
    ON transactions.id = transfer_transaction.related_transaction_id
  -- Get transaction from item
  LEFT JOIN (${transactionSubquery}) related_transaction
    ON transactions.related_transaction_id = related_transaction.id
`;

const querySelect = `SELECT transactions.*,
  transaction_types.name as type_name,
  transaction_methods.name as method_name,
  ${categoryName} as category_name,
  case
    when categories.category_type_id = 1 OR categories.category_type_id = 3
      then categories.description
    else ''
  end as category_description,
  categories.category_type_id,
  categories.is_inactive as category_is_inactive,        
  category_contact.id as category_contact_id,
  contacts.company_name as contact_company_name, 
  contacts.first_name as contact_first_name, contacts.last_name as contact_last_name,
  ${relatedCategoryName} as related_category_name,
  -- transaction TO
  transfer_transaction.id as transfer_transaction_id,
  transfer_transaction.category_id as transfer_transaction_category_id,
  transfer_transaction.category_name as transfer_transation_category_name,
  transfer_transaction.category_type_id as transfer_transaction_category_type_id,
  transfer_transaction.category_description as transfer_transaction_category_description,
  transfer_transaction.related_category_name as transfer_transaction_related_category_name,
  transfer_transaction.note as transfer_transaction_note,
  -- transaction FROM 
  related_transaction.category_id as related_transaction_category_id,
  related_transaction.category_name as related_transaction_category_name,
  related_transaction.category_type_id as related_transaction_category_type_id,
  related_transaction.category_description as related_transaction_category_description,
  related_transaction.related_category_name as related_transaction_related_category_name,
  related_transaction.note as related_transaction_note
`;
export { buildWhere, buildLimitOffset, queryFrom, querySelect };
