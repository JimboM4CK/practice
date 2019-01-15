<template>
    <div :class="['ui', 'episode', 'fluid', 'dropdown', 'selection', !episodesFound ? 'disabled' : '']">
        <input type="hidden" name="episode" :value="episode.episodeId">
        <i class="dropdown icon"></i>
        <div class="default text">Select an episode...</div>
        <div class="menu">
            <div v-if="episode.episodeId" class="item" :data-value="episode.episodeId">{{ episode.Title }}</div>
        </div>
    </div>
</template>


<script>
var $ = window.$;
import config from '@/helpers/config'
export default {
    name: 'SelectEpisodeSingle',
    props: ['client', 'episode'],
    data(){
        return {
            episodesFound: false
        }
    },
    methods: {
        async init(){
            $(() => {
                $('.ui.dropdown.episode')
                .dropdown({
                    on: 'test',
                    apiSettings: {
                        responseAsync: async (settings, callback) => {
                            let response = {
                                success: true,
                                results: []
                            }
                            let clientId = this.client.clientId;
                            console.log(this.client);
                            if(clientId) response = await this.$api.Clients.clientEpisodes({clientId: this.client.clientId});
                            
                            if(response.results.length) this.episodesFound = true;
                            callback(response);
                        },            
                    },
                    searchFields: [
                        'EpisodeID',
                        'Title'
                    ],
                    fields: {
                        name: 'Title',
                        value: 'EpisodeID'
                    },
                    fullTextSearch: true,
                    minCharacters: 0,
                    onChange: (value, text, $choice) => {
                        this.$emit('episode-selected', {episodeId:value, title: text});
                    }
                });
            });
        },
        onClientChanged(){
            //trigger episode lookup. then enable episode dropdown once completed.
            console.log('changed');
            this.episodesFound = true;
            $('.ui.dropdown.episode .menu .item:not(.add-new)').remove();
            let res = $('.ui.dropdown.episode').trigger('test');
            console.log(res);
            //this.episodesFound = false;
        }
    },
    watch: {
        client: 'onClientChanged',
    },
    created(){
        this.init();
    }
}
</script>
