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
import config from '@/helpers/config'
export default {
    name: 'SelectClient',
    props: ['data'],
    methods: {
        async init(){
            console.log(`${config.apiUrl}/client/search/{query}`);
            $('.ui.search.client')
            .search({
                type: 'title',
                apiSettings: {
                    url: `${config.apiUrl}/client/search/{query}`                    
                },
                minCharacters: 3,
                fullTextSearch: true
            });
        }
    },
    created(){
        this.init();
    }
}
</script>
