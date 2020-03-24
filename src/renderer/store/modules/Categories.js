import Vue from 'vue';

export default {
  namespaced: true,
  // -----------------------------------------------------------------
  state: {
    startingBalanceData: [],
    data: [],
  },
  // -----------------------------------------------------------------
  getters: {
    startingBalanceData: state => state.startingBalanceData,
    data: state => state.data,
  },
  // -----------------------------------------------------------------
  mutations: {
    setStartingBalanceData(state, data) {
      state.startingBalanceData = data;
    },
    setData(state, data) {
      state.data = data;
    },
  },
  // -----------------------------------------------------------------
  actions: {
    getStartingBalanceCategories(context, transactionId = 0) {
      const where = `
        not EXISTS (select * from transactions where transaction_type_id = 10
        AND category_id = categories.id
        AND id <> ${transactionId} )
      `;
      context.dispatch('getData', { mutationName: 'setStartingBalanceData', where });
    },

    async getData(context, payload = { mutationName: 'setData', where: '1 = 1' }) {
      const { mutationName, where } = payload;
      try {
        const data = await Vue.db.all(`SELECT categories.id,
        categories.category_type_id,
        category_types.name as category_type_name,
        case 
          when categories.category_type_id = 1 THEN categories.name
          else case 
                when contacts.company_name <> '' then contacts.company_name
                else contacts.first_name || contacts.last_name
              end
        end as category_name,
        case 
          when categories.category_type_id = 1 THEN ''
          when contacts.company_name <> '' then contacts.first_name || contacts.last_name
          else ''
        end as category_subtext,
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
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name,
        category_groups.sort_order
        FROM categories 
        JOIN category_types ON categories.category_type_id = category_types.id
        JOIN contacts ON categories.contact_id = contacts.id
        LEFT JOIN category_groups ON categories.category_group_id = category_groups.id
        LEFT JOIN categories related_category 
        ON categories.related_category_id = related_category.id
        LEFT JOIN contacts related_category_contact
          ON related_category.contact_id = related_category_contact.id        
        where ${where} 
        ORDER BY categories.category_type_id,
          category_groups.sort_order, categories.sort_order, 
          case 
            when contacts.company_name <> '' then contacts.company_name
            else contacts.first_name || contacts.last_name
          end
        `);
        context.commit(mutationName, data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },
  },
};
