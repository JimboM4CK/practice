<template>
    <Modal modalClass="single-booking">
        <template slot="header">Single booking</template>
        <template slot="content">
            <form class="ui form">
                <input type="hidden" name="staffId" :value="data.staffId" />
                <input type="hidden" name="time" :value="data.time" />
                <div class="field">
                    <label>Client</label>
                    <SelectClientSingle :client="client" @client-selected="onClientSelected"></SelectClientSingle>
                </div>
                <div class="field">
                    <label>Episode</label>
                    <SelectEpisodeSingle :client="client" :episode="episode"></SelectEpisodeSingle>
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
import SelectClientSingle from '@/components/Select/SelectClientSingle.vue'
import SelectEpisodeSingle  from '@/components/Select/SelectEpisodeSingle.vue'

export default {
    name: 'ModalSingleBooking',
    components: {
        Modal,
        SelectClientSingle,
        SelectEpisodeSingle
    },
    data(){
        return {
        client: {},
        episode: {}
        }
    },
    methods: {
        onClientSelected: function(data){
            this.client = {clientId: data.clientId, name: data.name};
        }
    },
    props: ['data'],
}
</script>
