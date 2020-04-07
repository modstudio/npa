module.exports = {
  data() {
    return {
      dragAndDropCapable: false,
    };
  },

  mounted() {
    /*
            Determine if drag and drop functionality is capable in the browser
        */
    this.dragAndDropCapable = this.determineDragAndDropCapable();

    /*
        If drag and drop capable, then we continue to bind events to our elements.
        */
    if (this.dragAndDropCapable) {
      /*
                Listen to all of the drag events and bind an event listener to each
                for the fileform.
            */
      ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach((evt) => {
        /*
                For each event add an event listener that prevents the default action
                (opening the file in the browser) and stop the propagation of the event (so
                no other elements open the file in the browser)
                */
        this.$refs.fileform.addEventListener(evt, (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, false);
      });
    }
  },

  methods: {
    /*
            Determines if the drag and drop functionality is in the
            window
        */
    determineDragAndDropCapable() {
      /*
            Create a test element to see if certain events
            are present that let us do drag and drop.
            */
      const div = document.createElement('div');

      /*
            Check to see if the `draggable` event is in the element
            or the `ondragstart` and `ondrop` events are in the element. If
            they are, then we have what we need for dragging and dropping files.

            We also check to see if the window has `FormData` and `FileReader` objects
            present so we can do our AJAX uploading
            */
      return (('draggable' in div)
                    || ('ondragstart' in div && 'ondrop' in div))
                && 'FormData' in window
                && 'FileReader' in window;
    },
  },
};
