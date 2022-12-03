import _ from 'lodash';
import Backbone from 'backbone';
import Marionette from 'marionette';
import ScrambleView from './ScrambleView';
import ScrambleCollectionView from './ScrambleCollectionView';
import ImageView from './ImageView';
import {oneLineHtml} from '../helpers/format';

const baseUrl = 'https://gamedata.services.amuniversal.com';
const clientCode = 'uupuz';
const encryptedUrl = 'U2FsdGVkX1+b5Y+X7zaEFHSWJrCGS0ZTfgh8ArjtJXrQId7t4Y1oVKwUDKd4WyEo';

const template = oneLineHtml`
    <a href="https://github.com/PhenaOfMari/jumba" class="plug icon-github"></a>
    {{#if loading}}
    <div class="loading icon-spinner"></div>
    {{else}}
    <div class="flex-row">
        <div class="left"></div>
        <div class="right flex-column">
            <div class="menu flex-row">
                <div class="menu-item icon-undo"></div>
                <input type="date" max="{{today}}" value="{{dataDate}}" required>
                <div class="menu-item icon-eye"></div>
            </div>
            <div class="image"></div>
        </div>
    </div>
    <div class="bottom"></div>
    {{/if}}`;

export default Marionette.View.extend({
    template,
    className: 'jumba-main flex-column',
    regions: {
        left: '.left',
        menu: '.menu',
        image: '.image',
        bottom: '.bottom'
    },
    events: {
        'click .icon-undo': 'render',
        'click .icon-eye': 'revealFinal',
        'change input[type=date]': 'onDateChange'
    },
    childViewEvents: {
        'clue:scramble:solved': 'clueScrambleSolved',
        'focus:final': 'focusFinal'
    },
    modelEvents: {
        change: 'render'
    },
    initialize() {
        const now = new Date();
        const year = now.getFullYear();
        const month = _.padStart(`${now.getMonth() + 1}`, 2, '0');
        const day = _.padStart(`${now.getDate()}`, 2, '0');
        const today = `${year}-${month}-${day}`;
        this.model = new Backbone.Model({
            loading: true,
            today
        });
        this.promise = this.fetchData(today);
    },
    fetchData(dataDate) {
        const {model} = this;
        model.set('loading', true);
        const date = new Date(`${dataDate} 00:00`);
        const gameCode = `tmjm${date.getDay() === 0 ? 's' : 'f'}`;
        return fetch(`${baseUrl}/c/${clientCode}/l/${encryptedUrl}/g/${gameCode}/d/${dataDate}/data.json`)
            .then(data => {
                model.set({
                    loading: false,
                    dataDate
                });
                return data.json();
            });
    },
    async onDomRefresh() {
        if (!this.model.get('loading')) {
            const data = await this.promise;
            if (_.isNull(data)) {
                return;
            }
            const clueData = data.Clues;
            const scrambles = _.chain(clueData)
                .keys()
                .groupBy(item => item.charAt(1))
                .keys()
                .map(i => ({
                    clue: clueData[`c${i}`],
                    answer: clueData[`a${i}`],
                    circledIndices: clueData[`o${i}`].split(',').map(o => parseInt(o, 10) - 1)
                }))
                .value();
            const collection = new Backbone.Collection(scrambles);
            this.showChildView('left', new ScrambleCollectionView({collection}));
            this.showChildView('image', new ImageView({imageUrl: data.Image}));
            const model = new Backbone.Model({clue: '', answer: data.Solution.s1, hidden: true});
            this.showChildView('bottom', new ScrambleView({model}));
        }
    },
    onDateChange(event) {
        this.promise = this.fetchData(event.currentTarget.value);
    },
    clueScrambleSolved(letters) {
        const bigScramble = this.getChildView('bottom');
        bigScramble.addChoices(letters);
        letters.forEach(letter => {
            bigScramble.addClue(letter);
        });
        const filteredChildren = this.getChildView('left').children
            .filter(child => !child.getChildView('answer').el
                .querySelector('.solved').classList.contains('icon-checkmark'));
        if (filteredChildren.length === 0) {
            this.revealFinal();
        }
    },
    focusFinal() {
        this.getChildView('bottom').getChildView('answer').children.find(child => child.choices).el.focus();
    },
    revealFinal() {
        this.getChildView('bottom').el.classList.remove('hidden');
    }
});
