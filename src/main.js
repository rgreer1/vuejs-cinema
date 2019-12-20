import Vue from 'vue';
import './style.scss';
import genres from './util/genres';

import MovieList from './components/MovieList.vue';
import MovieFilter from './components/MovieFilter.vue';

import VueResource from 'vue-resource';

import moment from 'moment-timezone';

moment.tz.setDefault("UTC");
Object.defineProperty(Vue.prototype, '$moment', { get() { return this.$root.moment } }); //makes moment available to all components, not just root instance!

//note: Vue.use() only works if library is setup specifically for use with Vue. Some libraryies (eg. Moment.js) don't work this way.
Vue.use(VueResource); //installs VueResource module as an instance method of our Vue object,  method is http(). We can call this as this.$http.

//root instance
var app = new Vue({
    el: '#app',
    data: {
        genre: [],
        time: [],
        movies: [],
        moment,
        day: moment() //moment() constructor will create current datetime by default
    },
    methods: {
        //this method is called in respone to a check-filter event from <movie-list> being recieved by the root instance  
        //NB: values for category, title and checked come from the custom event "check-filter"
        checkFilter(category, title, checked){

            //NB: category can have a value of 'genre' or 'time'. It defines the type of filter (nothing to do with movie categories!)
            if(checked){
                // Note: this[category] is equavalent to this.genre or this.time . 
                // Category variable allows us to determine which type of filter at runtime
                this[category].push(title);  
            }else{
                let index = this[category].indexOf(title);
                if (index > -1) {
                    this[category].splice(index, 1); //delete (splice out 1 item) from array
                }
            }
        }
    },
    components: {
         //Vue knows to auto convert pascal cased component names into kebab case when including in components list.
        MovieList,
        MovieFilter
    },
    created() {
        this.$http.get('/api').then( response => {
            console.log(response.data);
            this.movies = response.data;
        });
    }
});
