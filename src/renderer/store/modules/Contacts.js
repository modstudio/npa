import Vue from 'vue';

export default {
  namespaced: true,
  // -----------------------------------------------------------------
  state: {
    contacts: [],
  },
  // -----------------------------------------------------------------
  getters: {
    contacts: state => state.contacts,
  },
  // -----------------------------------------------------------------
  mutations: {
    setData(state, data) {
      state.contacts = data;
    },
  },
  // -----------------------------------------------------------------
  actions: {
    async getData(context) {
      try {
        const data = await Vue.db.all(`SELECT * FROM contacts 
        ORDER BY case 
        when company_name <> '' then company_name
        else first_name || last_name
        end`);
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async addContact(context, contact) {
      let result;
      try {
        await Vue.db.run(`INSERT INTO contacts (
          company_name, first_name, last_name, phone_number, phone_ext, address, city, state, zip, country
        ) VALUES ($company_name, $first_name, $last_name, $phone_number, $phone_ext, $address, $city, $state, $zip, $country)
        `, {
          $company_name: contact.company_name,
          $first_name: contact.first_name,
          $last_name: contact.last_name,
          $phone_number: contact.phone_number,
          $phone_ext: contact.$phone_ext,
          $address: contact.address,
          $city: contact.city,
          $state: contact.state,
          $zip: contact.zip,
          $country: contact.country,
        });
        result = true;
      } catch (err) {
        console.log('error insert contact', err);
        result = false;
      }
      return result;
    },

    async updateContact(context, contact) {
      let result;
      try {
        await Vue.db.run(`UPDATE contacts SET
          company_name = $company_name, 
          first_name = $first_name,
          last_name = $last_name, 
          phone_number = $phone_number, 
          phone_ext = $phone_ext, 
          address = $address, 
          city = $city, 
          state = $state,
          zip = $zip, 
          country = $country
          WHERE id = $id
        `, {
          $id: contact.id,
          $company_name: contact.company_name,
          $first_name: contact.first_name,
          $last_name: contact.last_name,
          $phone_number: contact.phone_number,
          $phone_ext: contact.phone_ext,
          $address: contact.address,
          $city: contact.city,
          $state: contact.state,
          $zip: contact.zip,
          $country: contact.country,
        });
        result = true;
      } catch (err) {
        console.log('error update contact', err);
        result = false;
      }
      return result;
    },

    async deleteContact(context, id) {
      let result;
      try {
        await Vue.db.run('DELETE FROM contacts WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error DELETE contact', err);
        result = false;
      }
      return result;
    },
  },
};
