import Vue from 'vue';
import './style.scss';
import genres from './util/genres';

//root instance
var app = new Vue({
    el: '#app',
    data: {
        genre: [],
        time: []
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
        'movie-list': {
            template: `<div id="movie-list">
                            <div v-for="movie in movies" class="movie" >{{ movie.title }} </div>
                       </div>`,
            data: function () {
                //in components, data must be a function
                return {
                    movies: [
                        { title: 'Pulp Fiction' },
                        { title: 'Home Alone' },
                        { title: 'Austin Powers' }
                    ]
                }
            },
            //following properties allow <movie-list> to recieve values passed in via v-bind directives on the element
            props: [ 'genre', 'time' ]
        },
        'movie-filter': {
            data() {            //equivalent to data: function () {
                return {
                    genres
                };
            },
            //list of filter items for a given type of filter this case our filter type is "genre"
            template: `<div id="movie-filter">
                            <h2>Filter results</h2>
                            <div class="filter-group">
                                 <check-filter v-for="genre in genres" v-bind:title="genre" v-on:check-filter="checkFilter"></check-filter>
                            </div>
                       </div>`,
            methods:{
                // his checkFilter method gets called when a check-filter event is recieved by <movie-filter> 
                //NB: values for category, title and checked come from the custom event "check-filter"
                checkFilter(category, title, checked) {

                    // emit an event named 'check-filter' passing parameters indicating item type, name and status
                    // parent component of movie-filter (to be defined) will listen to this event 
                    // by applying directive v-on:check-filter="checkFilter"
                    this.$emit('check-filter', category, title, checked);
                }
            },
            components: {
                'check-filter': {
                    data() {
                        return {
                            checked: false
                        }
                    },
                    props:[ 'title' ],

                    //dynamically toggle assigned style class based on truthiness of data properties
                    //the following will always assign class "check-filter" but only assign "active" if checked is true
                    template: `<div v-bind:class="{ 'check-filter': true, active: checked }" v-on:click="checkFilter" >
                                    <span class="checkbox"></span>
                                    <span class="check-filter-title">{{ title }}</span>
                                </div>`,
                    methods:{
                        // this checkFilter method gets called when a <check-filter> elemnt is clicked 
                        checkFilter() {
                            this.checked = !this.checked;

                            // emit an event named check-filter, with some parameters (our payload)
                            // <movie-filter> will listen to this event by applying directive v-on:check-filter="checkFilter"
                            this.$emit('check-filter', 'genre', this.title, this.checked);
                        }
                    }
                }
            }
        }
    }
});
