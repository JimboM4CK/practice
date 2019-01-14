<template>
    <div :class="['ui', 'episode', 'fluid', 'search', 'dropdown', 'selection', !client.clientId ? 'disabled' : '']">
        <input type="hidden" name="episode" :value="episode.episodeId">
        <i class="dropdown icon"></i>
        <input class="search">
        <div class="default text">Select an episode...</div>
        <div class="menu">
            <div v-if="episode.episodeId" class="item" :key="index" :data-value="episode.episodeId">{{ episode.Title }}</div>
        </div>
    </div>
</template>


<script>
var $ = window.$;
import config from '@/helpers/config'
export default {
    name: 'SelectEpisodeSingle',
    props: ['client', 'episode'],
    methods: {
        async init(){
            $(() => {
                $('.ui.dropdown.episode')
                .dropdown({
                    apiSettings: {
                        responseAsync: async (settings, callback) => {
                            if(!this.client.clientId) return callback(false);
                            let response = await this.$api.Clients.clientEpisodes({clientId: this.client.clientId});
                            callback(response);
                        }                  
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
        }
    },
    created(){
        this.init();
    }
}
</script>
