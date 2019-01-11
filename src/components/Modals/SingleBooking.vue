<template>
    <Modal modalClass="single-booking">
        <template slot="header">Single booking</template>
        <template slot="content">
            <form class="ui form">
                <input type="hidden" name="staffId" :value="data.staffId" />
                <input type="hidden" name="time" :value="data.time" />
                <div class="field">
                    <label>Client</label>
                    <SelectClient data="{clientId:1}"></SelectClient>
                </div>
                <div class="field">
                    <label>Last Name</label>
                    <input type="text" name="last-name" placeholder="Last Name">
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
import SelectClient from '@/components/Select/SelectClient.vue'
import Modal from '@/components/Modals/Modal.vue'

export default {
    name: 'ModalSingleBooking',
    components: {
        Modal,
        SelectClient
	},
    props: ['data'],
}
</script>
