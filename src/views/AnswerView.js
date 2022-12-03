import Backbone from 'backbone';
import Marionette from 'marionette';
import AnswerSpaceView from './AnswerSpaceView';
import AnswerTextView from './AnswerTextView';

export default Marionette.CollectionView.extend({
    template: '<div class="solved"></div>',
    className: 'answer flex-row',
    childView(model) {
        return model.get('text') ? AnswerTextView : AnswerSpaceView;
    },
    childViewEvents: {
        'change:focus': 'changeFocus',
        'letter:change': 'checkAnswer'
    },
    childViewTriggers: {
        'add:clue': 'add:clue',
        'remove:clue': 'remove:clue',
        'remove:letter': 'remove:letter'
    },
    childViewOptions() {
        return {
            scrambleId: this.options.scrambleId,
            choices: this.options.choices
        };
    },
    initialize(options) {
        const {answer, circledIndices} = options;
        const tokens = answer.split('{').flatMap(el => el.split('}'));
        this.answer = tokens.reduce((string, el, i) => `${string}${i % 2 === 0 ? el : ''}`, '');
        this.circledIndices = circledIndices;
        const models = tokens.flatMap((el, i) => {
            if (i % 2 === 1) {
                return {text: el.replace(' ', '&nbsp;')};
            }
            return el.split('').map((value, j) => ({
                circled: circledIndices.includes(j),
                value
            }));
        });
        this.collection = new Backbone.Collection(models);
    },
    changeFocus(source, idxMod) {
        source.el.blur();
        const filteredChildren = this.children.filter(child => child.choices);
        const newIdx = filteredChildren.indexOf(source) + idxMod;
        if (newIdx < 0) {
            this.trigger('change:focus', -1);
        } else if (newIdx >= filteredChildren.length) {
            this.trigger('change:focus', 1);
        } else {
            filteredChildren[newIdx].el.focus();
        }
    },
    checkAnswer() {
        const {answer} = this;
        const solution = this.children.reduce((string, child) => `${string}${child?.getValue?.() ?? ''}`, '');
        if (solution === answer) {
            this.el.querySelector('.solved').classList.add('icon-checkmark');
            this.children.forEach(child => child?.setSolved?.());
            this.trigger('scramble:solved', this.circledIndices.map(i => answer.charAt(i)));
        }
    }
});
