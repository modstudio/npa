import Vue from 'vue';
import { buildWhere, buildLimitOffset, queryFrom, querySelect } from './queryHelpers/transactionQueryHelpers';
import { categoryName, relatedCategoryName } from './queryHelpers/categoryQueryHelpers';

const loanTransactionTypeIds = [3, 4];
const pikadonTransactionTypeIds = [5, 6];
const pledgeTransactionTypeIds = [8, 9];
const causeTransactionTypeIds = [1, 2, 7];
const debitTransactionTypeIds = [2, 7, 3, 6];
const creditTransactionTypeIds = [1, 4, 5, 9];
const startingBalanceTransactionTypeId = 10;
const pledgePaymentId = 9;

function parseAmount(amount) {
  return Number.parseFloat(amount.replace(',', ''));
}

function getAmountSign(data) {
  const amount = parseAmount(data.amount);
  return debitTransactionTypeIds.includes(data.transaction_type_id)
    || (data.transaction_type_id === startingBalanceTransactionTypeId
      && data.debit_credit === 'debit')
    ? -Math.abs(amount) : amount;
}

export default {
  namespaced: true,
  // -----------------------------------------------------------------
  state: {
    data: [],
    page: 1,
    infiniteId: +new Date(),
    cacheData: [],
    filters: null,
    totalRows: null,
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
    setCacheData(state, data) {
      state.cacheData = data;
    },
    setTotalRows(state, value) {
      state.totalRows = value;
    },
    setFilters(state, value) {
      state.filters = value;
    },
    setPage(state, value) {
      state.page = value;
    },
    resetInfiniter(state) {
      state.page = 1;
      state.data = [];
      state.cacheData = [];
      state.infiniteId += 1;
    },
    incrementInfiniter(state) {
      state.infiniteId += 1;
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
    async getDataPage(context, params) {
      const where = buildWhere(context.state.filters);
      const queryOrder = ` ORDER BY date ${params.sortOrder}, created_at ${params.sortOrder}`;
      try {
        // get Total Rows
        const totalRows = await Vue.db.get(`SELECT COUNT(*) as cnt
          ${queryFrom} WHERE ${where}`);
        context.commit('setTotalRows', totalRows.cnt);
        let data = [];
        if (context.state.cacheData.length) {
          data = context.state.cacheData;
        } else {
          // Get Data
          const queryLimit = buildLimitOffset(context.state.page);
          data = await Vue.db.all(`
            ${querySelect}
            ${queryFrom}
            WHERE ${where}
            ${queryOrder}
            ${queryLimit}
          `);
        }
        context.commit('setData', [...context.state.data, ...data]);
        if (data.length) {
          // Get cache data:
          const nextPage = context.state.page + 1;
          const cacheQueryLimit = buildLimitOffset(nextPage);
          const cacheData = await Vue.db.all(`
            ${querySelect}
            ${queryFrom}
            WHERE ${where}
            ${queryOrder}
            ${cacheQueryLimit}
          `);
          context.commit('setCacheData', cacheData);
          context.commit('setPage', nextPage);
        } else {
          context.commit('setCacheData', []);
        }
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
        const amount = parseAmount(data.amount);
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
            $amount: -amount,
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
            $amount: amount,
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
        const amount = parseAmount(data.amount);
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
            $amount: -amount,
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
            $amount: amount,
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

    async runReport(context) {
      const where = buildWhere(context.state.filters);
      try {
        const data = await Vue.db.all(`
        SELECT categories.category_type_id,
        category_types.name as category_type_name,
        category_id,
        ${categoryName} as category_name,
        ${relatedCategoryName} as related_category_name,
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
          LEFT JOIN contacts related_category_contact
            ON related_category.contact_id = related_category_contact.id            
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
