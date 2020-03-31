module.exports = {
  data() {
    return {
      jewishLoc: null,
    };
  },

  mounted() {
    this.jewishLoc = $.bililite.flexcal.tol10n('he-jewish');
  },

  methods: {
    // Format Date to Jewish use flexcal
    formatDate(d, format = 'dddd MM YYYY') {
      const date = typeof (d) === 'string' ? moment(d).toDate() : d;
      return $.bililite.flexcal.format(date, format, this.jewishLoc);
    },
  },
};
