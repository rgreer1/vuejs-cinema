import Vue from 'vue';
import './style.scss';

//import conponents defined in our project
import routes from './util/routes';

//import compomnnts defined by node modules included by our package.json
import moment from 'moment-timezone';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router'; 

moment.tz.setDefault("UTC");
Object.defineProperty(Vue.prototype, '$moment', { get() { return this.$root.moment } }); //makes moment a public property so available to all components, not just root instance!

//notes regarding Vue.use():
//  - only works if library is setup specifically for use with Vue. Some libraryies (eg. Moment.js) don't work this way.
//  - installs module as an instance method of our Vue object (so we can reference as this.$modulename)
Vue.use(VueResource); 
Vue.use(VueRouter);

//import some utility functions from (our unhelpfully named) bus.js in the /util folder. 
//These functions will be called in response to events recieved from event bus.
import { checkFilter } from './util/bus'; 
import { setDay } from './util/bus';

//define "event bus" as an empty global Vue instance called "bus". 
//This allows components to emit events globally by calling "this.$bus.$emit()", while interested components can listen by calling "this.$bus.$on()" 
const bus = new Vue();
Object.defineProperty(Vue.prototype, '$bus', { get() { return this.$root.bus }}); //makes bus a public property of the root instance so available to all components

const router = new VueRouter({ routes });

//root instance
const app = new Vue({
    el: '#app',
    data: {
        genre: [],
        time: [],
        movies: [],
        moment,
        day: moment(), //moment() constructor will create current datetime by default,
        bus
    },
    methods: {
      
    },
    components: {
         //Vue knows to auto convert pascal cased component names into kebab case when including in components list.
    },

    //lifecycle hooks 
    created() {
        this.$http.get('/api').then( response => {
            console.log(response.data);
            this.movies = response.data;
        });

        //add event listeners to gobal event bus that listens for check-filter and set-day events
        this.$bus.$on('check-filter', checkFilter.bind(this)); //call bind method of checkFilter function to set context of "this" within checkFilter
        this.$bus.$on('set-day', setDay.bind(this)); //custom callback function with day as parameter
    },
    router //an example of a destructured assignment!
});

import { addClass, removeClass } from './util/helpers';

let mouseOverHandler = function(event) {
    let span = event.target.parentNode.getElementsByTagName('SPAN')[0]; //get first span within target element's parent
    addClass(span, 'tooltip-show');
};

let mouseOutHandler = function(event) {
    let span = event.target.parentNode.getElementsByTagName('SPAN')[0]; //get first span within target element's parent 
    removeClass(span, 'tooltip-show');
};


//define a custom "v-tooltip" directive. Attaches a <span> that shows/hides in response to mouse events.
Vue.directive('tooltip', {

    //following lifecycle function executes when directive first bound to element.
    bind(el, bindings) {
        let span = document.createElement('SPAN');
        let text = document.createTextNode('Seats available: 200');
        span.appendChild(text); //insert text inside span
        addClass(span, 'tooltip');
        el.appendChild(span); //insert span inside incoming element

        //attach mouse event listeners to div (for non-mobile devices)
        let div = el.getElementsByTagName('DIV')[0]; //get first div inside incoming element
        div.addEventListener('mouseover', mouseOverHandler);
        div.addEventListener('mouseout', mouseOutHandler);

        //attach touch event listeners to div (for mobile devices)
        div.addEventListener('touchstart', mouseOverHandler);
        div.addEventListener('touchend', mouseOutHandler);

    },
    unbind(el) {
        //free up resources by removing event listeners (when tooltip element removed from DOM?)
        let div = el.getElementsByTagName('DIV')[0]; //get first div inside incoming element
        div.removeEventListener('mouseover', mouseOverHandler);
        div.removeEventListener('mouseout', mouseOutHandler);
        div.removeEventListener('touchstart', mouseOverHandler);
        div.removeEventListener('touchend', mouseOutHandler);
}



});
