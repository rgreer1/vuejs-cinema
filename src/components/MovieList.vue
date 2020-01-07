<template>
    <div id="movie-list">
        <div v-if="filteredMovies.length">
            <!-- using props to pass movie, sessions and day so each movie-item can render movie info -->
            <movie-item v-for="movie in filteredMovies" v-bind:movie="movie.movie">
                <div class="movie-sessions">
                    <!-- note: binding a session.id key to each movie-sessions div makes each div unique to fix problme with tooltips not being attached to correct div when changing tab-->
                    <div 
                        v-for="session in filteredSessions(movie.sessions)" 
                        class="session-time-wrapper tooltip-wrapper"
                        v-tooltip="{ seats: session.seats }"
                        v-bind:key="session.id"
                    >
                        <div class="session-time">{{ formatSessionTime(session.time) }} </div>
                    </div>
                </div>
            </movie-item>
        </div>
        <div v-else-if="movies.length" class="no-results">
            {{ noResults }}
        </div>
        <div v-else class="no-results">
            Loading...
        </div>
    </div>
</template>

<script>
    import genres from '../util/genres';
    import times from '../util/times'
    import MovieItem from './MovieItem.vue';

    export default {
        //following simple properties allow <movie-list> to recieve values passed in via v-bind directives on the element
        props: [ 'genre', 'time', 'movies', 'day' ],
        methods: {
            formatSessionTime(raw) {
                return this.$moment(raw).format('h:mm A');
            },
            filteredSessions(sessions) {
                return sessions.filter(this.sessionPassesTimeFilter);
            },
            moviePassesGenreFilter(movie) {
                if (!this.genre.length){
                    return true;
                } else {
                    let movieGenre = movie.movie.Genre.split(", "); //return an array of strings from the comma separeted string.
                    let matched = true;
                    this.genre.forEach(genre => {
                        if (movieGenre.indexOf(genre) === -1) {
                            matched = false;
                        }
                    });

                    return matched;
                }
            },
            sessionPassesTimeFilter(session) {
                //this.day is an instance of moment. 
                //session.time is just a time string, need to call moment contructor to make this a moment object.

                if(!this.day.isSame(this.$moment(session.time), 'day')){
                    //current time and session time are not same weekday
                    return false;
                } else if (this.time.length === 0 || this.time.length === 2 ){
                    //none or both time of day filters checked!
                    return true;
                } else if (this.time[0] === times.AFTER_6PM ) {
                    //after 6pm checked
                    return this.$moment(session.time).hour() >= 18; //session passes if after 6pm
                } else {
                    //before 6pm checked
                    return this.$moment(session.time).hour() < 18; //session passes if before 6pm
                }
            }
        },

        //following computed property allows <movie-list> to progromatically determine the movies that passed the filters
        computed: {
            filteredMovies() {
                //array filter executes given filter function moviePassesGenreFilter() for each array element then returns all elements that passed 
                return this.movies
                    .filter( this.moviePassesGenreFilter )
                    .filter( movie => movie.sessions.find(this.sessionPassesTimeFilter) );
            },
            noResults(){
                let times = this.time.join(', '); //join each element in time array using given separator
                let genres = this.genre.join(', ');

                //Note: ES6 Template literals (backticks) let you include js expression inside a string. 
                //Each expression must be encolsed by ${ }
                return `No results for ${times}${times.length && genres.length ? ', ' : ''}${genres}`; 
            }
        },
        components: {
            MovieItem
        }
    }
</script>

<style>

</style>