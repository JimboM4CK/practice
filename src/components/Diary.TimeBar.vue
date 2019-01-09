<template>
    <div v-if="time" class="time-bar"></div>
</template>

<script>
var $ = window.$;

export default {
    name: 'TimeBar',
    props: ['time', 'slotMinutes', 'startHour'],
    methods: {
        updateLocation(){
            $(() => {
                let time_split = this.time.split(':');
                let hour = parseInt(time_split[0]);
                let minute = parseInt(time_split[1]);
                let slotsPerHour = 60/this.slotMinutes;
                let slotHeight = $('.diary-row').first().height();
                let hourHeight = ((hour - this.startHour) * slotsPerHour) * slotHeight;
                let minuteHeight = minute / 60 * slotHeight * slotsPerHour;
                let top = hourHeight + minuteHeight;
                $('.time-bar').css('top', Math.round(top-1,1));
            });
        }, 
    },
    watch: {
        time: 'updateLocation'
    },
    created(){
        this.updateLocation();
    }
}
</script>
