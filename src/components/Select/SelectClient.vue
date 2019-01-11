<template>
    <div :class="['ui', 'search', 'client']">
        <div class="ui icon input">
            <input class="prompt" type="text" placeholder="Search clients...">
            <i class="search icon"></i>
        </div>
        <div class="results"></div>
    </div>
</template>

<script>
var $ = window.$;

export default {
    name: 'SelectClient',
    props: ['data'],
    methods: {
        init(){
            console.log(this.$api);
            $('.ui.search.client')
            .search({
                type: 'title',
                apiSettings: {
                    minCharacters : 3,
                    response: this.$api.searchClients('{query}')
                },
                fullTextSearch: true
            });
        }
    },
    created(){
        this.init();
    }
}
</script>
