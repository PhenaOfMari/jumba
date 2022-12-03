import Marionette from 'marionette';

export default Marionette.Behavior.extend({
    events: {
        dragenter: 'onDragEnter',
        dragover: 'onDragOver',
        drop: 'onDrop'
    },
    onDragEnter(event) {
        event.preventDefault();
    },
    onDragOver(event) {
        event.preventDefault();
    },
    onDrop(event) {
        const {view} = this;
        const format = view.dropDataFormat ?? 'text/plain';
        const data = event.originalEvent.dataTransfer.getData(format);
        view.onDrop(data);
    }
});
