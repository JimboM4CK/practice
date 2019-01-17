<template>
    <div>
        <div :class="['ui', 'episode', 'fluid', 'dropdown', 'selection', episodeList.length ? '' : 'disabled']">
            <input type="hidden" name="episode" :value="episode.episodeId">
            <i class="dropdown icon"></i>
            <div class="default text">Select an episode...</div>
            <div class="menu">
                <div v-if="episode.episodeId" class="item" :data-value="episode.episodeId">{{ episode.Title }}</div>
            </div>
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
            episodeList: [],
        }
    },
    computed: {
        dropdown: function(){
            return $('.ui.dropdown.episode');
        },
    },
    methods: {
        async initiateDropdown(){
            $(() => {
                this.dropdown.dropdown({
                    onChange: (value, text, $choice) => {
                        if(value.indexOf('action:') === 0) return this[value.replace('action:','')]();
                        this.$emit('episode-selected', {episodeId:value, title: text});                        
                    }
                });
                if(this.episodeList.length) this.dropdown.dropdown('setup menu', {values: this.episodeList});
                return Promise.resolve();
            });
        },
        async refreshEpisodeList(clearSelected){
            //fetch items
            this.episodeList = [];
            if(clearSelected) this.dropdown.dropdown('clear');
            this.dropdown.dropdown('set loading');
            this.episodeList = [];
            if(this.client.clientId){
                let episodes = await this.$api.Clients.clientEpisodes({clientId: this.client.clientId});
                this.episodeList.push({name: '<label class="ui blue label">Add a new episode...</label>', value: 'action:onNewEpisode'});
                if(episodes.results.length){
                    episodes.results.forEach((episode) => {
                        let listItem = {
                            name: episode.Title,
                            value: episode.EpisodeID
                        }
                        this.episodeList.push(listItem);
                    });
                }
            }
            await this.initiateDropdown();
            return Promise.resolve();
        },
        onClientChanged(){
            this.refreshEpisodeList(true);
        },
        onNewEpisode(){
            //show new episode modal?
            $('.ui.modal.new-episode').modal('show');
        },
        async onEpisodeAdded(value){
            await this.refreshEpisodeList(true);
            this.dropdown.dropdown('set selected', value); 
        }
    },
    watch: {
        client: 'onClientChanged'
    },
    created(){
        this.initiateDropdown();
        if(this.episode.length) this.refreshEpisodeList(false);
    }
}
</script>
