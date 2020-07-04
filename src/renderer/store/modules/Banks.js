import Vue from 'vue';

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
        const metricSubquery = `
          SELECT bank_id, 
          sum(case when amount < 0 and transaction_type_id <> 2 THEN amount ELSE 0 END) as debit,
          sum(case when amount > 0 and transaction_type_id <> 2 THEN amount ELSE 0 END) as kredit
          FROM transactions
          GROUP BY bank_id        
          `;
        const data = await Vue.db.all(`
          SELECT *,
          metrics.debit as metric_debit,
          metrics.kredit as metric_kredit,
          metrics.debit + metrics.kredit as metric_balance
          FROM banks
          LEFT JOIN (${metricSubquery}) metrics
            ON banks.id = metrics.bank_id
          ORDER BY id
        `);
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async addData(context, data) {
      let result;
      try {
        const stm = await Vue.db.run(`INSERT INTO banks (
          name, note, is_excluded_from_full_export
        ) VALUES ($name, $note, $is_excluded_from_full_export)
        `, {
          $name: data.name,
          $note: data.note,
          $is_excluded_from_full_export: data.is_excluded_from_full_export,
        });
        result = stm.lastID;
      } catch (err) {
        console.log('error insert banks', err);
        result = false;
      }
      return result;
    },

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE banks SET
          name = $name, 
          note = $note,
          is_excluded_from_full_export = $is_excluded_from_full_export
          WHERE id = $id
        `, {
          $id: data.id,
          $name: data.name,
          $note: data.note,
          $is_excluded_from_full_export: data.is_excluded_from_full_export,
        });
        result = true;
      } catch (err) {
        console.log('error update banks', err);
        result = false;
      }
      return result;
    },

    async archiveItem(context, id) {
      let result;
      try {
        await Vue.db.run('UPDATE banks SET is_inactive = 1 WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error archive banks', err);
        result = false;
      }
      return result;
    },

    async activateItem(context, id) {
      let result;
      try {
        await Vue.db.run('UPDATE banks SET is_inactive = 0 WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error activate banks', err);
        result = false;
      }
      return result;
    },

    async deleteItem(context, id) {
      let result;
      try {
        await Vue.db.run('DELETE FROM banks WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error DELETE banks', err);
        result = false;
      }
      return result;
    },

    async checkAssociation(context, id) {
      try {
        const result = await Vue.db.get(`SELECT count(*) as cnt
        FROM transactions where bank_id = ?`, [id]);
        return result.cnt > 0;
      } catch (err) {
        console.log('error check assoc for banks', err);
        return null;
      }
    },
  },
};
