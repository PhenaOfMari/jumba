import _ from 'lodash';
import Marionette from 'marionette';
import ClueView from './ClueView';
import AnswerView from './AnswerView';

export default Marionette.View.extend({
    template: '<div class="clue"></div><div class="answer"></div>',
    className() {
        return `scramble${this.model.get('hidden') ? ' hidden' : ''}`;
    },
    regions: {
        clue: {
            el: '.clue',
            replaceElement: true
        },
        answer: {
            el: '.answer',
            replaceElement: true
        }
    },
    childViewEvents: {
        'add:clue': 'addClue',
        'change:focus': 'changeFocus',
        'remove:clue': 'removeClue',
        'remove:letter': 'removeLetter'
    },
    childViewTriggers: {
        'scramble:solved': 'scramble:solved'
    },
    onDomRefresh() {
        const {model} = this;
        const clues = model.get('clue').split('');
        const clueOptions = {
            scrambleId: this.cid,
            clues
        };
        const answerOptions = {
            scrambleId: this.cid,
            answer: model.get('answer'),
            choices: clues,
            circledIndices: model.get('circledIndices') ?? []
        };
        this.showChildView('clue', new ClueView(clueOptions));
        this.showChildView('answer', new AnswerView(answerOptions));
    },
    addChoices(letters) {
        this.getChildView('answer').children.forEach(child => {
            const choices = child?.choices;
            if (!_.isUndefined(choices)) {
                child.choices = choices.concat(letters);
            }
        });
    },
    addClue(value) {
        this.getChildView('clue').collection.add({value});
    },
    changeFocus(idxMod) {
        this.trigger('change:focus', this, idxMod);
    },
    removeClue(value) {
        const clueCollection = this.getChildView('clue').collection;
        const model = clueCollection.find({value});
        if (!_.isUndefined(model)) {
            clueCollection.remove(model);
            return;
        }
        const child = this.getChildView('answer').children
            .find(child => child.getChildView('answerCharacter')?.model.get('value') === value);
        if (!_.isUndefined(child)) {
            child.overwriteLetter();
        }
    },
    removeLetter(id) {
        this.getChildView('clue').collection.remove(id);
        this.getChildView('answer').children.forEach(child => child?.removeLetter?.(id));
    }
});
