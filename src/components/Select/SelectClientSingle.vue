<template>
    <div :class="['ui', 'client', 'fluid', 'dropdown', 'search', 'selection']">
        <input type="hidden" name="client" :value="clientId">
        <i class="dropdown icon"></i>
        <input class="search">
        <div class="default text">Search for a client</div>
        <div class="menu">
            <div v-if="clientId" class="item" :data-value="clientId">{{ clientName }}</div>
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
                            let response = {
                                success: true,
                                results: []
                            }
                            let query = settings.urlData.query;
                            if(query) response = await this.$api.Clients.searchClients({query: query});
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
                    clearable: true,
                    onChange: (value, text, $choice) => {
                        this.$emit('client-selected', {clientId: value, name: text});
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
