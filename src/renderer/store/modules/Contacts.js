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
    activeContacts: state => state.contacts.filter(item => item.is_inactive === 0),
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
          company_name, first_name, last_name, phone_number, phone_ext, address,
          city, state, zip, country, id_number
        ) VALUES ($company_name, $first_name, $last_name, $phone_number, $phone_ext, $address, 
          $city, $state, $zip, $country, $id_number)
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
          $id_number: contact.id_number,
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
          country = $country,
          id_number = $id_number
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
          $id_number: contact.id_number,
        });
        result = true;
      } catch (err) {
        console.log('error update contact', err);
        result = false;
      }
      return result;
    },

    async archiveContact(context, id) {
      let result;
      try {
        await Vue.db.run('UPDATE contacts SET is_inactive = 1 WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error archive contact', err);
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

    async checkAssociation(context, id) {
      try {
        let result = await Vue.db.get(`SELECT count(*) as cnt
        FROM categories where contact_id = ?`, [id]);
        if (result.cnt > 0) {
          return true;
        }
        result = await Vue.db.get(`SELECT count(*) as cnt
        FROM transactions where contact_id = ?`, [id]);
        return result.cnt > 0;
      } catch (err) {
        console.log('error check assoc for distribution_classes', err);
        return null;
      }
    },
  },
};
