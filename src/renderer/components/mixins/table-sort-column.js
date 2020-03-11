/**
 * Mixin for table with sortable column
 */
module.exports = {
  /**
   *
   * The component's data.
   */
  data() {
    return {
      sortField: 'name',
      sortOrder: 'asc',
      refNameSortCol: [],
    };
  },

  mounted() {
    this.setSortClasses();
  },

  methods: {
    setSortField(fieldName) {
      if (this.sortField === fieldName) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = fieldName;
        this.sortOrder = 'asc';
      }
      this.sortData();
    },

    setSortClasses() {
      const refName = `sort${_.upperFirst(this.sortField)}`;
      const className = `sorted-${this.sortOrder === 'asc' ? 'down' : 'up'}`;
      this.refNameSortCol.forEach((item) => {
        this.$refs[item].classList.remove('sorted-up');
        this.$refs[item].classList.remove('sorted-down');
      });
      this.$refs[refName].classList.add(className);
    },

    sortData() {
      this.setSortClasses();

      // Sorting logic
    },

  },
};
