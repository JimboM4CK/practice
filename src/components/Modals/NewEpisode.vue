<template>
    <Modal modalClass="new-episode coupled">
        <template slot="header" data-real-title="Single booking">New episode</template>
        <template slot="content">
            <form class="ui form">
                <input type="hidden" name="episodeId" :value="data.staffId" />
                <input type="hidden" name="time" :value="data.time" />
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
            <div class="ui button">Cancel</div>
            <div class="ui button">OK</div>
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
    }
}
</script>
