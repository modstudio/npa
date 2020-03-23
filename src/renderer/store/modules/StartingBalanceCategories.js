import Vue from 'vue';

export default {
  namespaced: true,
  // -----------------------------------------------------------------
  state: {
    causeData: [],
    loanData: [],
    piakdonData: [],
    pledgeData: [],
  },
  // -----------------------------------------------------------------
  getters: {
    data: (state) => {
      const data = [];
      if (state.causeData.length) {
        data.push({
          label: 'Cause',
          data: state.causeData.map(item => ({
            value: item.id,
            label: item.name,
            ...item,
          })),
        });
      }
      if (state.loanData.length) {
        data.push({
          label: 'Loan',
          data: state.loanData.map(item => ({
            value: item.id,
            label: (item.contact_company_name ? item.contact_company_name
              : `${item.contact_first_name} ${item.contact_last_name}`),
            subtext: (item.contact_company_name
              ? `${item.contact_first_name} ${item.contact_last_name}` : ''),
            name: `${item.contact_company_name} ${item.contact_first_name} ${item.contact_last_name}`,
            ...item,
          })),
        });
      }
      if (state.pledgeData.length) {
        data.push({
          label: 'Pledge',
          data: state.pledgeData.map(item => ({
            value: item.id,
            label: (item.contact_company_name ? item.contact_company_name
              : `${item.contact_first_name} ${item.contact_last_name}`),
            subtext: (item.contact_company_name
              ? `${item.contact_first_name} ${item.contact_last_name} ` : '')
              + item.cause_name,
            name: `${item.contact_company_name} ${item.contact_first_name} ${item.contact_last_name}`,
            ...item,
          })),
        });
      }
      if (state.pikadonData.length) {
        data.push({
          label: 'Pikadon',
          data: state.pikadonData.map(item => ({
            value: item.id,
            label: (item.contact_company_name ? item.contact_company_name
              : `${item.contact_first_name} ${item.contact_last_name}`),
            subtext: (item.contact_company_name
              ? `${item.contact_first_name} ${item.contact_last_name}` : ''),
            name: `${item.contact_company_name} ${item.contact_first_name} ${item.contact_last_name}`,
            ...item,
          })),
        });
      }
      return data;
    },
  },
  // -----------------------------------------------------------------
  mutations: {
    setCauseData(state, data) {
      state.causeData = data;
    },
    setLoanData(state, data) {
      state.loanData = data;
    },
    setPikadonData(state, data) {
      state.pikadonData = data;
    },
    setPledgeData(state, data) {
      state.pledgeData = data;
    },
  },
  // -----------------------------------------------------------------
  actions: {
    async getData(context, transactionId = 0) {
      try {
        const causeData = await Vue.db.all(`SELECT categories.*, 
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name,
        category_groups.sort_order
        FROM categories join contacts ON categories.contact_id = contacts.id
        join category_groups ON categories.category_group_id = category_groups.id
        where not EXISTS (select * from transactions where transaction_type_id = 10
          AND category_id = categories.id
          AND id <> $transactionId )
          AND categories.category_type_id = 1   
        ORDER BY category_groups.sort_order, categories.sort_order`, { $transactionId: transactionId });
        context.commit('setCauseData', causeData);

        const loanData = await Vue.db.all(`SELECT categories.*,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name
        FROM categories JOIN contacts ON categories.contact_id = contacts.id
        where not EXISTS (select * from transactions where transaction_type_id = 10
          AND category_id = categories.id
          AND id <> $transactionId )
          AND categories.category_type_id = 3
        ORDER BY case 
        when company_name <> '' then company_name
        else first_name || last_name
        end`, { $transactionId: transactionId });
        context.commit('setLoanData', loanData);

        const pikadonData = await Vue.db.all(`SELECT categories.*,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name
        FROM categories JOIN contacts ON categories.contact_id = contacts.id
        where not EXISTS (select * from transactions where transaction_type_id = 10
          AND category_id = categories.id
          AND id <> $transactionId )
          AND categories.category_type_id = 4        
        ORDER BY case 
        when company_name <> '' then company_name
        else first_name || last_name
        end`, { $transactionId: transactionId });
        context.commit('setPikadonData', pikadonData);

        const pledgeData = await Vue.db.all(`SELECT categories.*,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name,
        related_category.name as cause_name
        FROM categories JOIN contacts ON categories.contact_id = contacts.id
        JOIN categories related_category
          ON categories.related_category_id = related_category.id
        where not EXISTS (select * from transactions where transaction_type_id = 10
          AND category_id = categories.id
          AND id <> $transactionId )
          AND categories.category_type_id = 2
        ORDER BY case 
        when company_name <> '' then company_name
        else first_name || last_name
        end`, { $transactionId: transactionId });
        context.commit('setPledgeData', pledgeData);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },
  },
};
