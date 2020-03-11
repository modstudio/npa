<template>
  <ValidationProvider :name="label" :rules="rules" v-slot="{ errors }">
    <div class="form-group form-group--enter" :class="formGroupClass">
        <input :type="fieldType" class="form-control form-control--enter"
            :min="min"
            :name="name"
            :class="{'is-invalid': errors[0], ...additionalClass}"
            :placeholder="placeholder"
            :value="value"
            :disabled="disabled"
            :readonly="readonly"
            :autocomplete="autocomplete"
            @input="onInput"
            @change="$emit('change', $event.target.value)"
            @blur="$emit('blur')"
            aria-invalid="false"
        >

        <label v-if="label">
            {{ label }}
        </label>

        <span class="state-icon" v-show="fieldIsDirty">
            <span v-if="isShowEye" class="password" :class="{'pw-hide': fieldType==='text'}">
              <span v-show="fieldType==='password'"
                v-on:click="fieldType='text'"><i class="icon-eye"></i></span>
              <span v-show="fieldType==='text'"
                v-on:click="fieldType='password'"><i class="icon-eye-off"></i></span>
            </span>
            <i v-if="errors[0]" class="icon-warning"></i>
            <i v-else-if="isIconOk && !fieldIsInvalid" class="icon-ok color-primary-500"></i>
        </span>

        <span class="state state--error" v-show="errors[0]">
            {{ errors[0] }}
        </span>
    </div>
  </ValidationProvider>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    name: {
      type: String,
      default: 'name',
    },
    label: {
      type: String,
      default: '',
    },
    rules: {
      type: [Object, String],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    additionalClass: {
      type: Object,
      default: null,
    },
    formGroupClass: {
      type: [Object, String],
      default: null,
    },
    min: {
      type: Number,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    scope: {
      type: String,
      default: '',
    },
    isIconOk: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    isShowEye: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    fieldWithScope() {
      return this.scope ? `${this.scope}.${this.name}` : this.name;
    },
    fieldIsDirty() {
      const fields = this.scope ? this.fields[`$${this.scope}`] : this.fields;
      return fields && fields[this.name] && fields[this.name].dirty;
    },
    fieldIsInvalid() {
      const fields = this.scope ? this.fields[`$${this.scope}`] : this.fields;
      return fields && fields[this.name] && fields[this.name].invalid;
    },
  },

  data() {
    return {
      fieldType: this.type,
    };
  },

  methods: {
    onInput($event) {
      this.$emit('input', $event.target.value);
    },
  },

};
</script>

<style>

</style>
