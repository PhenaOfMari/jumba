import './css/index.css';
import _ from 'lodash';
import Marionette from 'marionette';
import Handlebars from 'handlebars';
import App from './App';

function handlebarsRenderer(template, data) {
    if (_.isUndefined(template)) {
        return '';
    }
    if (_.isFunction(template)) {
        return template(data);
    }
    return Handlebars.compile(template)(data);
}

Marionette.View.setRenderer(handlebarsRenderer);
Marionette.CollectionView.setRenderer(handlebarsRenderer);

document.addEventListener('DOMContentLoaded', () => {
    new App().start();
});
