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
            value: `cause_id:${item.id}`,
            label: item.name,
            ...item,
          })),
        });
      }
      if (state.loanData.length) {
        data.push({
          label: 'Loan',
          data: state.loanData.map(item => ({
            value: `loan_id:${item.id}`,
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
            value: `pledge_id:${item.id}`,
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
            value: `pikadon_id:${item.id}`,
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
        const causeData = await Vue.db.all(`SELECT causes.*, 
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name,
        cause_groups.sort_order
        FROM causes join contacts ON causes.contact_id = contacts.id
        join cause_groups ON causes.cause_group_id = cause_groups.id
        where not EXISTS (select * from transactions where transaction_type_id = 10
          AND cause_id = causes.id
          AND id <> $transactionId )        
        ORDER BY cause_groups.sort_order, causes.sort_order`, { $transactionId: transactionId });
        context.commit('setCauseData', causeData);

        const loanData = await Vue.db.all(`SELECT loans.*,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name
        FROM loans JOIN contacts ON loans.contact_id = contacts.id
        where not EXISTS (select * from transactions where transaction_type_id = 10
          AND loan_id = loans.id
          AND id <> $transactionId )
        ORDER BY case 
        when company_name <> '' then company_name
        else first_name || last_name
        end`, { $transactionId: transactionId });
        context.commit('setLoanData', loanData);

        const pikadonData = await Vue.db.all(`SELECT pikadons.*,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name
        FROM pikadons JOIN contacts ON pikadons.contact_id = contacts.id
        where not EXISTS (select * from transactions where transaction_type_id = 10
          AND pikadon_id = pikadons.id
          AND id <> $transactionId )        
        ORDER BY case 
        when company_name <> '' then company_name
        else first_name || last_name
        end`, { $transactionId: transactionId });
        context.commit('setPikadonData', pikadonData);

        const pledgeData = await Vue.db.all(`SELECT pledges.*,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name,
        causes.name as cause_name
        FROM pledges JOIN contacts ON pledges.contact_id = contacts.id
        JOIN causes ON pledges.cause_id = causes.id
        where not EXISTS (select * from transactions where transaction_type_id = 10
          AND pledge_id = pledges.id
          AND id <> $transactionId )        
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
