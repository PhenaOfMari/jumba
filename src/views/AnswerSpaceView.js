import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'marionette';
import Droppable from '../behaviors/Droppable';
import LetterView from './LetterView';

export default Marionette.View.extend({
    template: '{{#if circled}}<div class="circled"></div>{{/if}}<div class="focused"></div><div class="answer-character"></div>',
    className: 'answer-space',
    attributes: {
        tabIndex: 0
    },
    behaviors: [Droppable],
    regions: {
        answerCharacter: '.answer-character'
    },
    events: {
        'keydown': 'onKeydown'
    },
    initialize(options) {
        this.dropDataFormat = options.scrambleId;
        this.choices = options.choices;
    },
    onDrop(data) {
        if (_.isEmpty(data)) {
            return;
        }
        const {id, model} = JSON.parse(data);
        this.trigger('remove:letter', id);
        this.setLetter(model.value);
    },
    onKeydown(event) {
        event.preventDefault();
        const {key} = event.originalEvent;
        if (['Backspace', 'Delete'].includes(key)) {
            this.trigger('change:focus', this, -1);
            this.setLetter();
        } else {
            const value = key.toUpperCase();
            if (this.choices.includes(value)) {
                this.trigger('change:focus', this, 1);
                this.trigger('remove:clue', value);
                this.setLetter(value);
            }
        }
    },
    setLetter(value) {
        const child = this.getChildView('answerCharacter');
        if (!_.isUndefined(child)) {
            this.trigger('add:clue', child.model.get('value'));
        }
        this.overwriteLetter(value);
    },
    overwriteLetter(value) {
        if (_.isUndefined(value)) {
            this.getChildView('answerCharacter')?.destroy();
        } else {
            this.showChildView('answerCharacter', new LetterView({
                scrambleId: this.options.scrambleId,
                model: new Backbone.Model({value})
            }));
        }
        this.trigger('letter:change');
    },
    removeLetter(id) {
        if (id === this.getChildView('answerCharacter')?.model.cid) {
            this.overwriteLetter();
        }
    },
    getValue() {
        return this.getChildView('answerCharacter')?.model.get('value') ?? '';
    },
    setSolved() {
        this.el.setAttribute('tabindex', null);
        const child = this.getChildView('answerCharacter');
        child._behaviors.at(0).destroy();
        child.el.draggable = false;
        child.el.classList.remove('pointer');
    }
});
