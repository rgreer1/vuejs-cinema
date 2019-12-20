<template>
    <div id="movie-filter">
        <h2>Filter results</h2>
        <h3>By time of day</h3>
        <div class="filter-group">
            <check-filter v-for="time in times" category="time" v-bind:title="time" v-on:check-filter="checkFilter"></check-filter>
        </div>
        <h3>By genre</h3>
        <div class="filter-group">
            <check-filter v-for="genre in genres" category="genre" v-bind:title="genre" v-on:check-filter="checkFilter"></check-filter>
        </div>
    </div>
</template>

<script>
    import genres from '../util/genres';
    import times from '../util/times';

    import CheckFilter from './CheckFilter.vue'; //note same path as parent

    export default {
        data() {            //equivalent to data: function () {
            return {
                genres,
                times
            };
        },
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
            CheckFilter
        }
    }
</script>

<style>

</style>