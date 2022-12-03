import Marionette from 'marionette';

export default Marionette.View.extend({
    tagName: 'img',
    initialize(options) {
        const {imageUrl} = options;
        this.el.setAttribute('src', imageUrl);
    }
});
