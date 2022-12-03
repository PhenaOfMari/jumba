import Marionette from 'marionette';
import JumbaView from './views/JumbaView';

export default Marionette.Application.extend({
    region: {
        el: 'body'
    },
    onStart() {
        this.showView(new JumbaView());
    }
});
