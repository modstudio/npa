import Vue from 'vue';

const loanTransactionTypeIds = [3, 4];
const pikadonTransactionTypeIds = [5, 6];
const pledgeTransactionTypeIds = [8, 9];
const causeTransactionTypeIds = [1, 2, 7];
const debitTransactionTypeIds = [2, 7, 3, 6];
const creditTransactionTypeIds = [1, 4, 5, 9];

function getAmountSign(data) {
  return debitTransactionTypeIds.includes(data.transaction_type_id)
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
        causes.name as cause_name,
        loan.name as loan_name, loan.description as loan_description,
        pikadon.name as pikadon_name,
        pledge.name as pledge_name, pledge.cause_name as pledge_cause_name,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name
        FROM transactions LEFT JOIN contacts ON transactions.contact_id = contacts.id
          JOIN transaction_types ON transactions.transaction_type_id = transaction_types.id
          LEFT JOIN transaction_methods ON transactions.transaction_method_id = transaction_methods.id
          LEFT JOIN causes ON transactions.cause_id = causes.id
          LEFT JOIN (SELECT loans.id, loans.description,
            case 
            when company_name <> '' then company_name
            else first_name || last_name
            end as name
            FROM loans JOIN contacts ON loans.contact_id = contacts.id) loan 
            ON transactions.loan_id = loan.id
          LEFT JOIN (SELECT pikadons.id,
            case 
            when company_name <> '' then company_name
            else first_name || last_name
            end as name
            FROM pikadons JOIN contacts ON pikadons.contact_id = contacts.id) pikadon 
            ON transactions.pikadon_id = pikadon.id
          LEFT JOIN (SELECT pledges.id,
            case 
            when company_name <> '' then company_name
            else first_name || last_name
            end as name,
            causes.name as cause_name
            FROM pledges JOIN contacts ON pledges.contact_id = contacts.id
              JOIN causes ON pledges.cause_id = causes.id
            ) pledge 
            ON transactions.pledge_id = pledge.id
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
          date, transaction_type_id, transaction_method_id, number, cause_id,
          loan_id, pikadon_id, pledge_id, contact_id, amount, note, created_at, updated_at
        ) VALUES ($date, $transaction_type_id, $transaction_method_id, $number, $cause_id,
          $loan_id, $pikadon_id, $pledge_id, $contact_id, $amount, $note,
          DATETIME('now'), DATETIME('now')
        )
        `, {
          $date: moment(data.date).format('YYYY-MM-DD'),
          $transaction_type_id: data.transaction_type_id,
          $transaction_method_id: data.transaction_method_id,
          $number: data.number,
          $cause_id: data.cause_id,
          $loan_id: data.loan_id,
          $pikadon_id: data.pikadon_id,
          $pledge_id: data.pledge_id,
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
          cause_id = $cause_id,
          loan_id = $loan_id,
          pikadon_id = $pikadon_id,
          pledge_id = $pledge_id,
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
          $cause_id: data.cause_id,
          $loan_id: data.loan_id,
          $pikadon_id: data.pikadon_id,
          $pledge_id: data.pledge_id,
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
