<template>
    <div class="movie">
        <div class="movie-col-left">
            <img v-bind:src="movie.Poster" />
        </div>
        <div class="movie-col-right">
            <div class="movie-title">
                <h2>{{ movie.Title }}</h2>
                <span class="movie-rating">{{ movie.Rated }}</span>
            </div>
            <div class="movie-sessions">
                <div v-for="session in filteredSessions(sessions)" class="session-time-wrapper">
                    <div class="session-time">{{ formatSessionTime(session.time) }} </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import times from '../util/times';

    export default {
        props: ['movie', 'sessions', 'day', 'time'], 
        methods: {
            formatSessionTime(raw) {
                return this.$moment(raw).format('h:mm A');
            },
            filteredSessions(sessions) {
                return sessions.filter(this.sessionPassesTimeFilter);
            },
            sessionPassesTimeFilter(session) {
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
        }
    }
</script>

<style>

</style>