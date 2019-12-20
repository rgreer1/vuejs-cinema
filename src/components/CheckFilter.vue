<template>
    <!--
        //template dynamically toggles assigned style class based on truthiness of data properties
        //the following will always assign class "check-filter" but only assign "active" if checked is true
    -->
    <div v-bind:class="{ 'check-filter': true, active: checked }" v-on:click="checkFilter" >
        <span class="checkbox"></span>
        <span class="check-filter-title">{{ title }}</span>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                checked: false
            }
        },
        props:[ 'title', 'category' ],
        methods:{
            // this checkFilter method gets called when a <check-filter> elemnt is clicked 
            checkFilter() {
                this.checked = !this.checked;

                // emit an event named check-filter, with some parameters (our payload)
                // <movie-filter> will listen to this event by applying directive v-on:check-filter="checkFilter"
                this.$emit('check-filter', this.category, this.title, this.checked);
            }
        }
    }
</script>