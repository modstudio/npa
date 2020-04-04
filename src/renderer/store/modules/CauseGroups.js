import Vue from 'vue';

const categoryTypeId = 1;

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
        const data = await Vue.db.all(`SELECT * FROM category_groups
        WHERE category_type_id = $category_type_id
        ORDER BY sort_order`, {
          $category_type_id: categoryTypeId,
        });
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async addData(context, data) {
      let result;
      try {
        await Vue.db.run(`INSERT INTO category_groups (
          category_type_id, name, note, sort_order
        ) VALUES ($category_type_id, $name, $note, 
          (select ifnull(max(sort_order), 0) + 1 from category_groups
            WHERE category_type_id = $category_type_id
          ))
        `, {
          $category_type_id: categoryTypeId,
          $name: data.name,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error insert category_groups', err);
        result = false;
      }
      return result;
    },

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE category_groups SET
          name = $name, 
          note = $note
          WHERE id = $id
        `, {
          $id: data.id,
          $name: data.name,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error update category_groups', err);
        result = false;
      }
      return result;
    },

    async archiveItem(context, id) {
      let result;
      try {
        await Vue.db.serialize(async () => {
          await Vue.db.run('BEGIN TRANSACTION');
          await Vue.db.run('UPDATE category_groups SET is_inactive = 1 WHERE id = ?', [id]);
          await Vue.db.run(
            'UPDATE categories SET is_inactive = 1 WHERE category_group_id = ?',
            [id],
          );
          await Vue.db.run('COMMIT');
        });
        result = true;
      } catch (err) {
        console.log('error archive category_groups', err);
        result = false;
      }
      return result;
    },

    async deleteItem(context, id) {
      let result;
      try {
        await Vue.db.run('DELETE FROM category_groups WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error DELETE category_groups', err);
        result = false;
      }
      return result;
    },

    async setSortOrder(context, { id, sortOrder }) {
      let result;
      try {
        await Vue.db.run(`UPDATE category_groups SET
          sort_order = $sortOrder
          WHERE id = $id
        `, {
          $id: id,
          $sortOrder: sortOrder,
        });
        result = true;
        const item = context.getters.getItem(id);
        context.commit('updateItem', { ...item, sort_order: sortOrder });
      } catch (err) {
        console.log('error update sort_order of category_groups', err);
        result = false;
      }
      return result;
    },

    async checkAssociation(context, id) {
      try {
        const result = await Vue.db.get(`SELECT count(*) as cnt
        FROM categories where category_group_id = ?`, [id]);
        return result.cnt > 0;
      } catch (err) {
        console.log('error check assoc for category_groups', err);
        return null;
      }
    },
  },
};
