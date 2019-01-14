<template>
    <div :class="['ui', 'client', 'fluid', 'dropdown', 'search', 'selection']">
        <input type="hidden" name="client" :value="clientId">
        <i class="dropdown icon"></i>
        <input class="search">
        <div class="default text">Select a client</div>
        <div class="menu">
            <div v-if="clientId" class="item" :key="index" :data-value="clientId">{{ clientName }}</div>
        </div>
    </div>
</template>


<script>
var $ = window.$;
import config from '@/helpers/config'
export default {
    name: 'SelectClientSingle',
    props: ['clientId', 'clientName'],
    methods: {
        async init(){
            $(() => {
                $('.ui.dropdown.client')
                .dropdown({
                    apiSettings: {
                        responseAsync: async (settings, callback) => {
                            let query = settings.urlData.query;
                            if(!query) return false;
                            $('ui.dropdown.client').addClass('loading');
                            let response = await this.$api.Clients.searchClients({query: query});
                            $('ui.dropdown.client').removeClass('loading');
                            callback(response);
                        }                  
                    },
                    searchFields: [
                        'FirstName',
                        'PreferredName',
                        'LastName'
                    ],
                    fields: {
                        name: 'Name',
                        value: 'ClientID'
                    },
                    fullTextSearch: true,
                    minCharacters: 3,
                    onChange: (value, text, $choice) => {
                        console.log('test');
                        
                        this.$emit('client-selected', {episodeId:value, title: text});
                    }
                });
            });
        }
    },
    created(){
        this.init();
    }
}
</script>
