<template>
    <div id="overview">
        <div class="main">
            <movie-list v-bind:genre="genre" v-bind:time="time" v-bind:movies="movies" v-bind:day="day"></movie-list>
            <movie-filter></movie-filter>
        </div>
    </div>
</template>

<script>

    import MovieList from './MovieList.vue';
    import MovieFilter from './MovieFilter.vue';
    export default {
        props: [ 'genre', 'time', 'movies', 'day' ],
        components: {
            //Vue knows to auto convert pascal cased component names into kebab case when including in components list.
            MovieList,
            MovieFilter
        },
        
    }
</script>