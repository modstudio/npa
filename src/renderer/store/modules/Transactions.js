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

export default {
  namespaced: true,
  // -----------------------------------------------------------------
  state: {
    data: [],
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
  },
  // -----------------------------------------------------------------
  actions: {
    async getData(context) {
      try {
        const data = await Vue.db.all(`SELECT transactions.*,
        transaction_types.name as type_name,
        transaction_methods.name as method_name,
        case 
          when categories.category_type_id = 1 THEN categories.name
          else case 
                when category_contact.company_name <> '' then category_contact.company_name
                else category_contact.first_name || category_contact.last_name
              end
        end as category_name,
        case
          when categories.category_type_id = 3 then categories.description
          else ''
        end as category_description,
        categories.category_type_id,
        category_contact.id as category_contact_id,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name,
        related_category.name as related_category_name,
        -- transaction TO
        transfer_transactions.id as transfer_transaction_id,
        transfer_transactions.category_id as transfer_transaction_category_id,
        case 
        when transfer_categories.category_type_id = 1 THEN transfer_categories.name
        else case 
              when transfer_category_contact.company_name <> '' then transfer_category_contact.company_name
              else transfer_category_contact.first_name || transfer_category_contact.last_name
            end
        end as transfer_category_name,
        -- transaction FROM 
        related_transactions.category_id as related_transaction_category_id,
        case 
        when related_categories.category_type_id = 1 THEN related_categories.name
        else case 
              when related_category_contact.company_name <> '' then related_category_contact.company_name
              else related_category_contact.first_name || related_category_contact.last_name
            end
        end as related_category_name        
        FROM transactions LEFT JOIN contacts ON transactions.contact_id = contacts.id
          JOIN transaction_types ON transactions.transaction_type_id = transaction_types.id
          LEFT JOIN transaction_methods ON transactions.transaction_method_id = transaction_methods.id
          JOIN categories ON transactions.category_id = categories.id
          JOIN contacts category_contact ON categories.contact_id = category_contact.id
          LEFT JOIN categories related_category 
            ON categories.related_category_id = related_category.id
          -- Get transaction TO item
          LEFT JOIN transactions transfer_transactions
            ON transactions.id = transfer_transactions.related_transaction_id
          LEFT JOIN categories transfer_categories
            ON transfer_transactions.category_id = transfer_categories.id
          LEFT JOIN contacts transfer_category_contact 
            ON transfer_categories.contact_id = transfer_category_contact.id
          -- Get transaction from item
          LEFT JOIN transactions related_transactions
            ON transactions.related_transaction_id = related_transactions.id
          LEFT JOIN categories related_categories
            ON related_transactions.category_id = related_categories.id
          LEFT JOIN contacts related_category_contact 
            ON related_categories.contact_id = related_category_contact.id                      
        ORDER BY date, created_at, id`);
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
  },
};
