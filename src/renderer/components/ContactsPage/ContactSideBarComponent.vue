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
            <text-info-component
              v-model="form.id"
              label="Id Number"
            ></text-info-component>
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

      <div class="info-sidebar__footer" v-show="!isDeleteMode">
        <div class="d-flex justify-content-end align-items-center">
          <button type="button" v-if="isNewMode"
            class="btn btn-link mr-auto"
            @click="cancel">
              Cancel
          </button>
          <button type="button" v-else
            @click="deleteAction"
            class="btn btn-icon btn-icon--w-text mr-auto">
              <i class="icon icon-trash-can"></i><span>Delete</span>
          </button>

          <action-button
            button-name="Save and New"
            loading-name="Saving"
            additional-class="btn-secondary w-156"
            @click="saveAndNew"
            :form-busy="isSavingAndNewProcess"
          >
          </action-button>
          <action-button
            button-name="Save and Close"
            loading-name="Saving"
            additional-class="w-156 ml-4"
            @click="saveAndClose"
            :form-busy="isSavingAndCloseProcess"
          >
          </action-button>
        </div>
      </div>

      <contact-delete-dialog-component v-show="isDeleteMode"
        :item="currentItem"
        @close-dialog="isDeleteMode = false"
        @item-deleted="onDeleteContact"
      ></contact-delete-dialog-component>      
    </right-side-bar-component>
  </div>
</template>

<script>
import SelectCountriesComponent from '../common/countries-component/SelectCountriesComponent';
import SelectStatesComponent from '../common/states-component/SelectStatesComponent';
import ContactDeleteDialogComponent from './ContactDeleteDialogComponent';
import states from '../common/states-component/states';

export default {
  props: {
    currentItem: {
      type: Object,
      default: null,
    },
    isShown: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: null,
    },
  },

  watch: {
    isShown() {
      this.initForm();
    },

    currentItem() {
      this.initForm();
    },
  },

  components: {
    SelectCountriesComponent,
    SelectStatesComponent,
    ContactDeleteDialogComponent,
  },

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
      form: null,
      isSavingAndNewProcess: false,
      isSavingAndCloseProcess: false,
      isDeleteMode: false,
    };
  },

  created() {
    this.initForm();
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
      };
    },

    async saveAndNew() {
      this.isSavingAndNewProcess = true;
      const result = await this.save();
      this.isSavingAndNewProcess = false;
      if (result) {
        this.$emit('update-contacts');
        if (this.isNewMode) {
          this.initForm();
        } else {
          this.$emit('add-new');
        }
      }
    },

    async saveAndClose() {
      this.isSavingAndCloseProcess = true;
      const result = await this.save();
      this.isSavingAndCloseProcess = false;
      if (result) {
        this.$emit('update-contacts');
        this.$emit('hidepanel');
      }
    },

    async save() {
      const isValidateSuccess = await this.$refs.observer.validate();
      if (!isValidateSuccess) {
        this.$root.scrollToFirstError(this.$refs.form, true);
        return false;
      }
      if (this.isNewMode) {
        const result = await this.$store.dispatch('Contacts/addContact', this.form);
        return result;
      }
      const result = await this.$store.dispatch('Contacts/updateContact', this.form);
      return result;
    },

    onChangeCountry() {
      this.form.state = null;
    },

    cancel() {
      this.$emit('hidepanel');
    },

    deleteAction() {
      this.isDeleteMode = true;
    },

    onDeleteContact() {
      this.$emit('update-contacts');
      this.$emit('hidepanel');
      this.isDeleteMode = false;
    },
  },
};
</script>

<style>

</style>
