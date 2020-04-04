<template>
  <div v-show="isShown">
    <right-side-bar-component
      header-image-url="./static/images/contacts.svg"
      header-image-style="background-size: auto;"
      init-event-name="open-contacts-page"
      @hidepanel="$emit('hidepanel')"
    >
      <template slot="header">{{ headerName }}</template>
      <template slot="headerBadge">{{ currentItem ? currentItem.id : '' }}</template>
      <div>
        <div class="info-sidebar__body" ref="form" v-show="!isDeleteMode">
          <div class="info-sidebar__block-header">
              <h4>Contact</h4>
          </div>
            <ValidationObserver ref="observer">
              <!-- Company Name -->
              <text-input-component
                v-model="form.company_name"
                :rules="{required: !form.first_name || !form.last_name}"
                label="Company name"
              ></text-input-component>
              <!-- First Name -->
              <text-input-component
                v-model="form.first_name"
                :rules="{required: !form.company_name}"
                label="First name"
              ></text-input-component>
              <!-- Last Name -->
              <text-input-component
                v-model="form.last_name"
                :rules="{required: !form.company_name}"
                label="Last name"
              ></text-input-component>
              <!-- Id Number -->
              <text-input-component
                v-model="form.id_number"
                label="ID Number"
              ></text-input-component>
              <hr>
              <div class="row gutter-8">
                  <div class="col-12 col-md-10">
                      <!-- Phone Number -->
                      <tel-input-component
                          v-model="form.phone_number"
                          label="Phone Number"
                          autocomplete="tel"
                      ></tel-input-component>
                  </div>
                  <div class="col-12 col-md-2">
                      <text-input-component
                          v-model="form.phone_ext"
                          name="phone_ext"
                          label="Ext."
                          autocomplete="tel-extension"
                      ></text-input-component>
                  </div>
              </div>
              <!-- Address -->
              <text-input-component
                v-model="form.address"
                label="Address"
              ></text-input-component>
              <!-- City -->
              <text-input-component
                v-model="form.city"
                label="City"
              ></text-input-component>
              <div class="row gutter-8">
                  <div class="col-12 col-sm-6" v-show="countryHasStates">
                      <!-- State -->
                      <select-states-component
                        v-model="form.state"
                        :country="form.country"
                      ></select-states-component>
                  </div>
                  <div class="col-12" :class="{'col-sm-6': countryHasStates}">
                      <!-- Organization ZIP -->
                      <text-input-component
                        v-model="form.zip"
                        type="tel"
                        :rules="{postcode: form.country }"
                        :label="form.country === 'US' ? 'Zip' : 'Postal Code'"
                      ></text-input-component>
                  </div>
              </div>
              <!-- Country -->
              <select-countries-component
                v-model="form.country"
                @change="onChangeCountry"
              ></select-countries-component>
            </ValidationObserver>
        </div>

        <item-delete-dialog-component v-if="isDeleteMode"
          :item="currentItem"
          item-name="Contact"
          store-action-name="Contacts/deleteContact"
          archive-action-name="Contacts/archiveContact"
          :has-association="hasAssociation"
          @close-dialog="isDeleteMode = false"
          @item-deleted="onDeleteItem"
        ></item-delete-dialog-component>
      </div>
      <div class="info-sidebar__footer" v-show="!isDeleteMode">
        <footer-buttons-component
          v-if="!isDeleteMode"
          :is-new-mode="isNewMode"
          :is-saving-and-new-process="isSavingAndNewProcess"
          :is-saving-and-close-process="isSavingAndCloseProcess"
          :has-association="hasAssociation"
          @save-and-new="saveAndNew"
          @save-and-close="saveAndClose"
          @delete="deleteAction"
          @cancel="$emit('hidepanel')"
        ></footer-buttons-component>
      </div>
    </right-side-bar-component>
  </div>
</template>

<script>
import SelectCountriesComponent from '../common/countries-component/SelectCountriesComponent';
import SelectStatesComponent from '../common/states-component/SelectStatesComponent';
import ItemDeleteDialogComponent from '../common/right-side-bar/ItemDeleteDialogComponent';
import states from '../common/states-component/states';
import sideBarPanelMixin from '../mixins/side-bar-panel';

export default {
  components: {
    SelectCountriesComponent,
    SelectStatesComponent,
    ItemDeleteDialogComponent,
  },

  mixins: [sideBarPanelMixin],

  computed: {
    headerName() {
      return this.isNewMode ? 'New Contact' : `${this.name}`;
    },

    name() {
      if (!this.currentItem) {
        return '';
      }
      if (this.currentItem.company_name) {
        return this.currentItem.company_name;
      }
      return `${this.currentItem.first_name} ${this.currentItem.last_name}`;
    },

    countryHasStates() {
      return this.form.country in states;
    },

    isNewMode() {
      return this.mode === 'new';
    },
  },

  data() {
    return {
      checkAssociationActionName: 'Contacts/checkAssociation',
    };
  },

  methods: {
    initForm() {
      if (this.$refs.observer) {
        this.$refs.observer.reset();
      }
      if (this.$refs.form) {
        this.$root.scrollUp(this.$refs.form);
      }
      this.form = this.newForm();
      if (!this.isNewMode && this.currentItem) {
        this.form = { ...this.currentItem };
        this.form.phone_number = this.form.phone_number || '';
        this.checkAssociation();
      }
    },

    newForm() {
      return {
        id: null,
        company_name: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        phone_ext: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
        id_numbers: null,
      };
    },


    onChangeCountry() {
      this.form.state = null;
    },

    async saveItem() {
      const result = await this.$store.dispatch('Contacts/addContact', this.form);
      return result;
    },

    async updateItem() {
      const result = await this.$store.dispatch('Contacts/updateContact', this.form);
      return result;
    },
  },
};
</script>

<style>

</style>
