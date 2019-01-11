<template>
    <div class="ui popup vertical menu context-menu" style="visibility:hidden; padding:0;">
        <template v-for="(section, index) in menu">
            <a class="item" :data-action="section.action" :key="index" v-on:click="menuItemClick">{{ section.title }}</a>
        </template>
    </div>
</template>

<script>
export default {
    name: 'ContextMenu',
    props: ['type'],
    data(){
        return {
            menu: null
        }
    },
    methods: {
        menuItemClick(event){
            this.$store.commit('setDiaryAction', {action: event.target.dataset.action});
        },
        fetchMenuItems(type){
            this.menu = this[type]();
        },
        diaryRowEmpty(){
            let menu = [];
            menu.push({title: 'Single booking', action: 'SingleBooking'});
            menu.push({title: 'Group booking', action: 'GroupBooking'});
            menu.push({title: 'Reserve', action: 'Reserve'});
            return menu;
        },
        diaryRowReserved(){
            let menu = [];
            menu.push({title: 'Clear selection', action: 'ClearSelection'});
            menu.push({title: 'Clear reservation', action: 'ClearReservation'});
            return menu;
        },
    },
    created(){
        //this.fetchMenuItems(this.type)
    },
    watch: {
        type(){
            this.fetchMenuItems(this.type);
        }
    }
}
</script>
