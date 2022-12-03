import Marionette from 'marionette';
import ScrambleView from './ScrambleView';

export default Marionette.CollectionView.extend({
    childView: ScrambleView,
    childViewEvents: {
        'change:focus': 'changeFocus'
    },
    childViewTriggers: {
        'scramble:solved': 'clue:scramble:solved'
    },
    changeFocus(source, idxMod) {
        const filteredChildren = this.children
            .filter(child => !child.getChildView('answer').el
                .querySelector('.solved').classList.contains('icon-checkmark'));
        if (filteredChildren.length === 1) {
            this.trigger('focus:final');
            return;
        }
        const newIdx = filteredChildren.indexOf(source) + idxMod;
        if (newIdx >= 0 && newIdx < filteredChildren.length) {
            const spaces = filteredChildren[newIdx].getChildView('answer').children;
            const focusIdx = idxMod < 0 ? spaces.length - 1 : 0;
            spaces.findByIndex(focusIdx).el.focus();
        }
    }
});
