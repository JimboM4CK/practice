<template>
    <Modal :id="id" modalClass="single-booking">
        <template slot="header">Single booking</template>
        <template slot="content">
            <form class="ui form" v-on:submit.prevent>
                <input type="hidden" name="staffId" :value="data.staffId" />
                <input type="hidden" name="time" :value="data.time" />
                <div class="ui padded grid">
                    <div class="doubling two column row">
                        <div class="column">
                            <div class="field">
                                <label>Client</label>
                                <SelectClientSingle :parentId="id" :client="client" @client-selected="onClientSelected" />
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <label>Episode</label>
                                <SelectEpisodeSingle :parentId="id" :client="client" :episode="episode" @episode-selected="onEpisodeSelected" />
                            </div>
                        </div>
                    </div>
                    <div class="ui divider"></div>
                    <div class="one wide row"> 
                        <div class="column">
                            <label>Services</label>
                            <CartItems />
                        </div>
                    </div>
                   <!-- 
                        <Services/>
                        <Products/>
                        <Notes/>
                        <Room/> 
                    -->

                </div>
            </form>
        </template>
        <template slot="actions">
            <div class="ui button">OK</div>
            <div class="ui button">Cancel</div>
        </template>
    </Modal>
</template>

<script>
import Modal from '@/components/Modals/Modal.vue'
import SelectClientSingle from '@/components/Select/SelectClientSingle.vue'
import SelectEpisodeSingle  from '@/components/Select/SelectEpisodeSingle.vue'
import CartItems  from '@/components/Cart/Items.vue'

export default {
    name: 'ModalSingleBooking',
    components: {
        Modal,
        SelectClientSingle,
        SelectEpisodeSingle,
        CartItems
    },
    data(){
        return {
            client: {},
            episode: {},
            id: 'single-booking'
        }
    },
    methods: {
        onClientSelected: function(data){
            this.client = {clientId: data.clientId, name: data.name};
        },
        
        onEpisodeSelected: function(data){
            this.episode = {episodeId: data.episodeId, title: data.title};
        }
    },
    props: ['data'],
}
</script>
