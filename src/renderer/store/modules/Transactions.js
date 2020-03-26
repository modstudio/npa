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
          when categories.category_type_id = 2
            THEN case 
                when related_category_contact.company_name <> '' 
                  then related_category_contact.company_name
                else related_category_contact.first_name || related_category_contact.last_name
              end
          when categories.category_type_id = 3 then categories.description
          else ''
        end as category_description,
        categories.category_type_id,
        category_contact.id as category_contact_id,
        case 
          when transfer_categories.category_type_id = 1 THEN transfer_categories.name
          else case 
                when transfer_category_contact.company_name <> '' then transfer_category_contact.company_name
                else transfer_category_contact.first_name || transfer_category_contact.last_name
              end
        end as transfer_category_name,
        transfer_categories.category_type_id as transfer_category_type_id,
        transfer_category_contact.id as transfer_category_contact_id,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name,
        related_category.name as related_category_name
        FROM transactions LEFT JOIN contacts ON transactions.contact_id = contacts.id
          JOIN transaction_types ON transactions.transaction_type_id = transaction_types.id
          LEFT JOIN transaction_methods ON transactions.transaction_method_id = transaction_methods.id
          JOIN categories ON transactions.category_id = categories.id
          JOIN contacts category_contact ON categories.contact_id = category_contact.id
          LEFT JOIN categories related_category 
            ON categories.related_category_id = related_category.id
          LEFT JOIN contacts related_category_contact
            ON related_category.contact_id = related_category_contact.id
          LEFT JOIN categories transfer_categories
            ON transactions.transfer_category_id = transfer_categories.id
          LEFT JOIN contacts transfer_category_contact 
            ON transfer_categories.contact_id = transfer_category_contact.id
        ORDER BY date`);
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
          transfer_category_id, contact_id, amount, note, created_at, updated_at
        ) VALUES ($date, $transaction_type_id, $transaction_method_id, $number, $category_id,
          $transfer_category_id, $contact_id, $amount, $note,
          DATETIME('now'), DATETIME('now')
        )
        `, {
          $date: moment(data.date).format('YYYY-MM-DD'),
          $transaction_type_id: data.transaction_type_id,
          $transaction_method_id: data.transaction_method_id,
          $number: data.number,
          $category_id: data.category_id,
          $transfer_category_id: data.transfer_category_id,
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

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE transactions SET
          date = $date,
          transaction_type_id = $transaction_type_id,
          transaction_method_id = $transaction_method_id,
          number = $number,
          category_id = $category_id,
          transfer_category_id = $transfer_category_id,
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
          $transfer_category_id: data.transfer_category_id,
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
