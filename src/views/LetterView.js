import Marionette from 'marionette';
import Draggable from '../behaviors/Draggable';

export default Marionette.View.extend({
    template: '{{value}}',
    className: 'letter pointer',
    behaviors: [Draggable],
    initialize(options) {
        this.dragDataFormat = options.scrambleId;
    },
    getDragData() {
        const {model} = this;
        return JSON.stringify({
            id: model.cid,
            model: model.toJSON()
        });
    }
});
