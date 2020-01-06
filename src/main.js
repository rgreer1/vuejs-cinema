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

import { checkFilter } from './util/bus'; //import our bus.js from /util folder

//define a "global event bus" as a seperate "empty" Vue instance that will allow events to be picked up by any compoenent across the app 
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

        //add event listener to gobal event bus that listens to check-filter events
        this.$bus.$on('check-filter', checkFilter.bind(this)); //call bind method of checkFilter function to set context of "this" within checkFilter
    },
    router //destructured assignment!
});
