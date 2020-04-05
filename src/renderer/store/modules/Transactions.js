import Vue from 'vue';

const loanTransactionTypeIds = [3, 4];
const pikadonTransactionTypeIds = [5, 6];
const pledgeTransactionTypeIds = [8, 9];
const causeTransactionTypeIds = [1, 2, 7];
const debitTransactionTypeIds = [2, 7, 3, 6];
const creditTransactionTypeIds = [1, 4, 5, 9];
const startingBalanceTransactionTypeId = 10;
const pledgePaymentId = 9;

function getAmountSign(data) {
  return debitTransactionTypeIds.includes(data.transaction_type_id)
    || (data.transaction_type_id === startingBalanceTransactionTypeId
      && data.debit_credit === 'debit')
    ? -Math.abs(data.amount) : data.amount;
}

function buildWhere(filter) {
  const where = ['1 = 1'];
  if (filter.type.length) {
    where.push(`transaction_type_id in (${filter.type.join()})`);
  }
  if (filter.category.length) {
    where.push(`categories.category_type_id in (${filter.category.join()})`);
  }
  if (filter.method.length) {
    where.push(`transaction_method_id in (${filter.method.join()})`);
  }
  if (filter.contact.length) {
    where.push(`contact_id in (${filter.contact.join()})`);
  }
  if (filter.contact.length) {
    where.push(`contact_id in (${filter.contact.join()})`);
  }
  if (filter.amount && filter.amount.from) {
    where.push(`amount >= ${filter.amount.from}`);
  }
  if (filter.amount && filter.amount.to) {
    where.push(`amount <= ${filter.amount.to}`);
  }
  if (filter.date && filter.date.from) {
    where.push(`date >= '${moment(filter.date.from).format('YYYY-MM-DD')}'`);
  }
  if (filter.date && filter.date.to) {
    where.push(`date <= '${moment(filter.date.to).format('YYYY-MM-DD')}'`);
  }
  if (filter.notes === 2) {
    where.push("transactions.note <> ''");
  }
  if (filter.inactive === 0) {
    where.push('categories.is_inactive = 0');
  } else if (filter.inactive === 2) {
    where.push('categories.is_inactive = 1');
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
        `category_name like '%${search}%'`,
        `(transaction_type_id <> 11 AND categories.description like '%${search}%')`,
        `transactions.amount like '%${search}%'`,
      ];
      if (filter.notes === 1) {
        whereOr.push(`transactions.note like '%${search}%'`);
      }
      if (filter.category.includes(2)) {
        whereOr.push(`related_category.name like '%${search}%'`);
      }
      whereSearch.push(`(${whereOr.join(' OR ')})`);
    });
    where.push(`(${whereSearch.join(' AND ')})`);
  }
  return where.join(' AND ');
}

export default {
  namespaced: true,
  // -----------------------------------------------------------------
  state: {
    data: [],
    reportData: [],
  },
  // -----------------------------------------------------------------
  getters: {
    data: state => state.data,
    getItem: state => id => _.find(state.data, { id }),
    isLoan: () => transactionTypeId => loanTransactionTypeIds.includes(transactionTypeId),
    isPikadon: () => transactionTypeId => pikadonTransactionTypeIds.includes(transactionTypeId),
    isPledge: () => transactionTypeId => pledgeTransactionTypeIds.includes(transactionTypeId),
    isCause: () => transactionTypeId => causeTransactionTypeIds.includes(transactionTypeId),
    isDebit: () => transactionTypeId => debitTransactionTypeIds.includes(transactionTypeId),
    isCredit: () => transactionTypeId => creditTransactionTypeIds.includes(transactionTypeId),
    isPledgePayment: () => transactionTypeId =>
      transactionTypeId === pledgePaymentId,
    isStartingBalance: () => transactionTypeId =>
      transactionTypeId === startingBalanceTransactionTypeId,
    transaction: state => transactionId => _.find(state.data, { id: transactionId }),
    reportForCategoryType: state => categoryTypeId => state.data
      .filter(item => item.category_type_id === categoryTypeId),
  },
  // -----------------------------------------------------------------
  mutations: {
    setData(state, data) {
      state.data = data;
    },
    updateItem(state, data) {
      const index = state.data.findIndex(item => item.id === data.id);
      if (index !== -1) {
        state.data.splice(index, 1, { ...data });
      }
    },
    setReportData(state, data) {
      state.reportData = data;
    },
  },
  // -----------------------------------------------------------------
  actions: {
    async getData(context) {
      const transactionSubquery = `
        select transactions.*,
        categories.category_type_id,
          case 
                when categories.category_type_id = 1 THEN categories.name
                else case 
                      when category_contact.company_name <> '' then category_contact.company_name
                      else category_contact.first_name || ' ' || category_contact.last_name
                    end
              end as category_name,
          categories.description as category_description,
              related_category.name as related_category_name
        from transactions 
        JOIN categories ON transactions.category_id = categories.id
        JOIN contacts category_contact ON categories.contact_id = category_contact.id
        LEFT JOIN categories related_category 
        ON categories.related_category_id = related_category.id      
      `;
      try {
        const data = await Vue.db.all(`SELECT transactions.*,
        transaction_types.name as type_name,
        transaction_methods.name as method_name,
        case 
          when categories.category_type_id = 1 THEN categories.name
          else case 
                when category_contact.company_name <> '' then category_contact.company_name
                else category_contact.first_name || ' ' || category_contact.last_name
              end
        end as category_name,
        case
          when categories.category_type_id = 3 then categories.description
          else ''
        end as category_description,
        categories.category_type_id,
        categories.is_inactive as category_is_inactive,        
        category_contact.id as category_contact_id,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name,
        related_category.name as related_category_name,
        -- transaction TO
        transfer_transaction.id as transfer_transaction_id,
        transfer_transaction.category_id as transfer_transaction_category_id,
        transfer_transaction.category_name as transfer_transation_category_name,
        transfer_transaction.category_type_id as transfer_transaction_category_type_id,
        transfer_transaction.category_description as transfer_transaction_category_description,
        transfer_transaction.related_category_name as transfer_transaction_related_category_name,
        -- transaction FROM 
        related_transaction.category_id as related_transaction_category_id,
        related_transaction.category_name as related_transaction_category_name,
        related_transaction.category_type_id as related_transaction_category_type_id,
        related_transaction.category_description as related_transaction_category_description,
        related_transaction.related_category_name as related_transaction_related_category_name
        FROM transactions 
          LEFT JOIN contacts ON transactions.contact_id = contacts.id
          JOIN transaction_types ON transactions.transaction_type_id = transaction_types.id
          LEFT JOIN transaction_methods ON transactions.transaction_method_id = transaction_methods.id
          JOIN categories ON transactions.category_id = categories.id
          JOIN contacts category_contact ON categories.contact_id = category_contact.id
          LEFT JOIN categories related_category 
            ON categories.related_category_id = related_category.id
          -- Get transaction TO item
          LEFT JOIN (${transactionSubquery}) transfer_transaction
            ON transactions.id = transfer_transaction.related_transaction_id
          -- Get transaction from item
          LEFT JOIN (${transactionSubquery}) related_transaction
            ON transactions.related_transaction_id = related_transaction.id                     
        ORDER BY date DESC, created_at, id`);
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async addData(context, data) {
      let result;
      try {
        await Vue.db.run(`INSERT INTO transactions (
          date, transaction_type_id, transaction_method_id, number, category_id,
          contact_id, amount, note, created_at, updated_at
        ) VALUES ($date, $transaction_type_id, $transaction_method_id, $number, $category_id,
          $contact_id, $amount, $note, DATETIME('now'), DATETIME('now')
        )
        `, {
          $date: moment(data.date).format('YYYY-MM-DD'),
          $transaction_type_id: data.transaction_type_id,
          $transaction_method_id: data.transaction_method_id,
          $number: data.number,
          $category_id: data.category_id,
          $contact_id: data.contact_id,
          $amount: getAmountSign(data),
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error insert transactions', err);
        result = false;
      }
      return result;
    },

    async addTransfer(context, data) {
      let result;
      try {
        await Vue.db.serialize(async () => {
          await Vue.db.run('BEGIN TRANSACTION');
          const stm = await Vue.db.run(`INSERT INTO transactions (
            date, transaction_type_id, category_id,
            amount, created_at, updated_at
          ) VALUES ($date, $transaction_type_id, $category_id,
            $amount, DATETIME('now'), DATETIME('now')
          )
          `, {
            $date: moment(data.date).format('YYYY-MM-DD'),
            $transaction_type_id: data.transaction_type_id,
            $category_id: data.category_id,
            $amount: -data.amount,
          });
          await Vue.db.run(`INSERT INTO transactions (
            date, transaction_type_id, category_id, related_transaction_id,
            amount, created_at, updated_at
          ) VALUES ($date, $transaction_type_id, $category_id, $related_transaction_id,
            $amount, DATETIME('now'), DATETIME('now')
          )
          `, {
            $date: moment(data.date).format('YYYY-MM-DD'),
            $transaction_type_id: data.transaction_type_id,
            $category_id: data.transfer_category_id,
            $related_transaction_id: stm.lastID,
            $amount: data.amount,
          });
          await Vue.db.run('COMMIT');
        });
        result = true;
      } catch (err) {
        console.log('error insert transactions', err);
        result = false;
      }
      return result;
    },

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE transactions SET
          date = $date,
          transaction_type_id = $transaction_type_id,
          transaction_method_id = $transaction_method_id,
          number = $number,
          category_id = $category_id,
          contact_id = $contact_id,
          amount = $amount,
          note = $note, 
          updated_at = DATETIME('now')
          WHERE id = $id
        `, {
          $id: data.id,
          $date: moment(data.date).format('YYYY-MM-DD'),
          $transaction_type_id: data.transaction_type_id,
          $transaction_method_id: data.transaction_method_id,
          $number: data.number,
          $category_id: data.category_id,
          $contact_id: data.contact_id,
          $amount: getAmountSign(data),
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error update transactions', err);
        result = false;
      }
      return result;
    },

    async updateTransfer(context, data) {
      let result;
      try {
        await Vue.db.serialize(async () => {
          await Vue.db.run('BEGIN TRANSACTION');
          const fromTransactionId = data.related_transaction_id
            ? data.related_transaction_id : data.id;
          const toTransactionId = data.transfer_transaction_id
            ? data.transfer_transaction_id : data.id;
          await Vue.db.run(`UPDATE transactions SET
            date = $date,
            category_id = $category_id,
            amount = $amount,
            updated_at = DATETIME('now')
            WHERE id = $id
          `, {
            $id: fromTransactionId,
            $date: moment(data.date).format('YYYY-MM-DD'),
            $category_id: data.category_id,
            $amount: -data.amount,
          });
          await Vue.db.run(`UPDATE transactions SET
            date = $date,
            category_id = $category_id,
            amount = $amount,
            updated_at = DATETIME('now')
            WHERE id = $id
          `, {
            $id: toTransactionId,
            $date: moment(data.date).format('YYYY-MM-DD'),
            $category_id: data.transfer_category_id,
            $amount: data.amount,
          });
          await Vue.db.run('COMMIT');
        });
        result = true;
      } catch (err) {
        console.log('error insert transactions', err);
        result = false;
      }
      return result;
    },


    async deleteTransfer(context, transactionId) {
      let result;
      const transation = context.getters.transaction(transactionId);
      try {
        await Vue.db.serialize(async () => {
          await Vue.db.run('BEGIN TRANSACTION');
          const fromTransactionId = transation.related_transaction_id
            ? transation.related_transaction_id : transation.id;
          const toTransactionId = transation.transfer_transaction_id
            ? transation.transfer_transaction_id : transation.id;
          await Vue.db.run('DELETE FROM transactions WHERE id = ?', [toTransactionId]);
          await Vue.db.run('DELETE FROM transactions WHERE id = ?', [fromTransactionId]);
          await Vue.db.run('COMMIT');
        });
        result = true;
      } catch (err) {
        console.log('error insert transactions', err);
        result = false;
      }
      return result;
    },

    async deleteItem(context, id) {
      let result;
      try {
        await Vue.db.run('DELETE FROM transactions WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error DELETE transactions', err);
        result = false;
      }
      return result;
    },

    async runReport(context, filter) {
      const where = buildWhere(filter);
      try {
        const data = await Vue.db.all(`
        SELECT categories.category_type_id,
        category_types.name as category_type_name,
        category_id,
        case 
          when categories.category_type_id = 1 THEN categories.name
          else case 
                when category_contact.company_name <> '' then category_contact.company_name
                else category_contact.first_name || ' ' || category_contact.last_name
              end
        end as category_name,
        related_category.name as related_category_name,
        categories.description as category_description,
        categories.category_type_id,
        round(sum(amount), 2) as sum_amount
        FROM transactions
          LEFT JOIN contacts ON transactions.contact_id = contacts.id
          JOIN transaction_types ON transactions.transaction_type_id = transaction_types.id
          LEFT JOIN transaction_methods ON transactions.transaction_method_id = transaction_methods.id
          JOIN categories ON transactions.category_id = categories.id
          JOIN contacts category_contact ON categories.contact_id = category_contact.id
          JOIN category_types ON categories.category_type_id = category_types.id
          LEFT JOIN categories related_category 
            ON categories.related_category_id = related_category.id
          WHERE ${where}
          group by category_id
          order BY categories.category_type_id, category_name           
        `);
        context.commit('setReportData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },
  },
};
