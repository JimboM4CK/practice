<template>
    <div :class="['ui', 'client', 'fluid', 'dropdown', 'search', 'multiple', 'selection']">
        <input type="hidden" name="client" :value="clientIdString">
        <i class="dropdown icon"></i>
        <input class="search">
        <div class="default text">Search...</div>
        <div class="menu">
            <template v-for="(index, client) in clients">
                <div class="item" :key="index" :data-value="client.ClientID">{{ client.Name }}</div>
            </template>
        </div>
    </div>
</template>


<script>
var $ = window.$;
import config from '@/helpers/config'
export default {
    name: 'SelectClient',
    props: ['max', 'clients'],
    computed: {
        clientIdString: function(){
            let clientIds = [];
            if(typeof this.clients === 'undefined' || !this.clients.length) return '';
            this.clients.forEach(client => {
                clientIds.push(client.ClientID);
            });
            return clientIds.join(',');
        }
    },
    methods: {
        async init(){
            $(() => {
                $('.ui.dropdown.client')
                .dropdown({
                    apiSettings: {
                        responseAsync: async (settings, callback) => {
                            let query = settings.urlData.query;
                            if(!query) return false;
                            let response = await this.$api.Clients.searchClients({query: query});
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
                    maxSelections: this.max
                });
            });
        }
    },
    created(){
        this.init();
    }
}
</script>
