import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'marionette';
import Droppable from '../behaviors/Droppable';
import LetterView from './LetterView';

export default Marionette.CollectionView.extend({
    className: 'clue flex-row',
    childView: LetterView,
    childViewOptions() {
        return {
            scrambleId: this.options.scrambleId
        };
    },
    behaviors: [Droppable],
    initialize(options) {
        this.dropDataFormat = options.scrambleId;
        const {clues} = options;
        const models = clues.map(value => ({value}));
        this.collection = new Backbone.Collection(models);
    },
    onDrop(data) {
        if (_.isEmpty(data)) {
            return;
        }
        const {id, model} = JSON.parse(data);
        this.trigger('remove:letter', id);
        this.collection.add(model);
    }
});
