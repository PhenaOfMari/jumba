import Marionette from 'marionette';

export default Marionette.Behavior.extend({
    events: {
        dragstart: 'onDrag'
    },
    onDomRefresh() {
        this.el.setAttribute('draggable', true);
    },
    onDrag(event) {
        const {view} = this;
        const format = view.dragDataFormat ?? 'text/plain';
        const data = view.getDragData?.();
        event.originalEvent.dataTransfer.setData(format, data);
    }
});
