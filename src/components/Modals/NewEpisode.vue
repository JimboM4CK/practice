<template>
    <Modal modalClass="new-episode">
        <template slot="header">New episode</template>
        <template slot="content">
            <form class="ui form">
                <input type="hidden" name="episodeId" />
                <div class="field">
                    <label>Episode</label>
                </div>
                <div class="field">
                    <div class="ui checkbox">
                    <input type="checkbox" tabindex="0" class="hidden">
                    <label>I agree to the Terms and Conditions</label>
                    </div>
                </div>
            </form>
        </template>
        <template slot="actions">
            <div class="ui button" v-on:click="onConfirm">OK</div>
            <div class="ui button" v-on:click="$emit('cancel')">Cancel</div>
        </template>
    </Modal>
</template>

<script>
import Modal from '@/components/Modals/Modal.vue'

export default {
    name: 'ModalNewEpisode',
    components: {
        Modal
    },
    props: ['data'],
    data(){
        return {
        }
    },
    methods: {
        onConfirm: function(){
            //TODO: 
            //Add fields
            //check all fields
            //submit await response.
            //if ok return {episodeId: ''}

            this.$emit('complete', {episodeId: 4});
        }
    }
}
</script>
