<template>
  <div v-show="isShown">
    <right-side-bar-component
      header-image-url="./static/images/register.svg"
      header-image-style="background-size: auto;"
      init-event-name="open-dist-class-page"
      @hidepanel="$emit('hidepanel')"
    >
      <template slot="header">{{ headerName }}</template>
      <template slot="headerBadge">{{ currentItem ? currentItem.id : '' }}</template>
      <div>
        <div class="info-sidebar__body" ref="form" v-show="!isDeleteMode">
          <div class="info-sidebar__block-header">
              <h4>City</h4>
          </div>
            <ValidationObserver ref="observer">
              <!-- City -->
              <text-input-component
                v-model="form.city"
                :rules="{required: true, uniqueCity: [form.country, form.id]}"
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
                :rules="{required: true, uniqueCity: [form.country, form.id]}"
                @change="onChangeCountry"
              ></select-countries-component>           
            </ValidationObserver>
        </div>

        <item-delete-dialog-component v-if="isDeleteMode"
          :item="currentItem"
          item-name="City"
          store-action-name="Cities/deleteItem"
          archive-action-name="Cities/archiveItem"
          make-active-action-name="Cities/activateItem"
          :has-association="hasAssociation"
          @close-dialog="isDeleteMode = false"
          @item-deleted="onDeleteItem"
        ></item-delete-dialog-component>
      </div>
      <div class="info-sidebar__footer" v-show="!isDeleteMode">
        <footer-buttons-component
          v-if="!isDeleteMode && !isAddNewDialog"
          :is-new-mode="isNewMode"
          :is-saving-and-new-process="isSavingAndNewProcess"
          :is-saving-and-close-process="isSavingAndCloseProcess"
          :has-association="hasAssociation"
          :isInactive="isInactive"
          @save-and-new="saveAndNew"
          @save-and-close="saveAndClose"
          @delete="deleteAction"
          @cancel="$emit('hidepanel')"
        ></footer-buttons-component>
        <!-- Add new item mode -->
        <div class="d-flex justify-content-end align-items-center" v-if="isAddNewDialog">
            <action-button
              button-name="Cancel"
              additional-class="btn-secondary w-156"
              @click="$emit('hidepanel')"
            ></action-button>
            <action-button
              button-name="Save and Resume"
              loading-name="Saving"
              additional-class="w-156 ml-4"
              @click="saveAndClose"
              :form-busy="isSavingAndCloseProcess"
            ></action-button>
        </div>
      </div>
    </right-side-bar-component>
  </div>  
</template>

<script>
import ItemDeleteDialogComponent from '../../common/right-side-bar/ItemDeleteDialogComponent';
import SelectCountriesComponent from '../../common/countries-component/SelectCountriesComponent';
import SelectStatesComponent from '../../common/states-component/SelectStatesComponent';
import sideBarPanelMixin from '../../mixins/side-bar-panel';
import states from '../../common/states-component/states';

export default {
  components: {
    SelectCountriesComponent,
    SelectStatesComponent,
    ItemDeleteDialogComponent,
  },

  mixins: [sideBarPanelMixin],

  computed: {
    headerName() {
      return this.isNewMode ? 'New City' : `${this.name}`;
    },

    name() {
      return this.currentItem ? this.currentItem.name : '';
    },

    countryHasStates() {
      return this.form.country in states;
    },
  },

  data() {
    return {
      checkAssociationActionName: 'Cities/checkAssociation',
    };
  },

  methods: {
    newForm() {
      return {
        id: null,
        city: '',
        state: '',
        zip: '',
        country: 'US',
      };
    },

    onChangeCountry() {
      this.form.state = null;
    },

    async saveItem() {
      const result = await this.$store.dispatch('Cities/addData', this.form);
      return result;
    },

    async updateItem() {
      const result = await this.$store.dispatch('Cities/updateData', this.form);
      return result;
    },
  },
};
</script>

<style>

</style>