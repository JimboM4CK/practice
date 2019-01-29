<template>
    <div>
        <div class="ui middle aligned grid">
            <div class="one wide row">
                <div class="column">
                    <button class="mini ui button disabled">
                        <i class="icon add"></i>
                        Add
                    </button>
                    <button class="mini ui button disabled">
                        <i class="icon remove"></i>
                        Add Misc.
                    </button>
                </div>
            </div>
            
            <template v-for="(item, index) in items">
                <div class="product sixteen wide row" :key="index">
                    <div class="ten wide column">
                        <template v-if="item.loading">
                            <div class="ui placeholder">
                                <div class="image header">
                                    <div class="line"></div>
                                    <div class="line"></div>
                                </div>
                            </div>
                        </template>
                        <template v-if="!item.loading">
                            <div class="ui small header">
                                <img :src="item.image" class="ui image">
                                <div class="content">
                                    {{ item.title }}
                                    <div v-if="item.subTitle" class="sub header">{{ item.subTitle }}</div> <!-- Service Category, Item number, -->
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="three wide column">
                        <template v-if="item.loading">
                            <div class="ui placeholder">
                                <div class="paragraph">
                                    <div class="line"></div>
                                </div>
                            </div>
                        </template>
                        <template v-if="!item.loading">
                            <div class="ui right labeled input">
                                <div class="ui icon buttons">
                                    <button :class="['ui', 'button', item.isService || item.isInvoice ? 'disabled' : '']" v-on:click="item.quantity > 0 ? item.quantity -= 1 : 0"><i class="down chevron icon"></i></button>
                                    <button :class="['ui', 'button', item.isService || item.isInvoice ? 'disabled' : '']">{{ item.quantity }}</button>
                                    <button :class="['ui', 'button', item.isService || item.isInvoice ? 'disabled' : '']" v-on:click="item.quantity += 1"><i class="up chevron icon"></i></button>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="three wide column">
                        <template v-if="item.loading">
                            <div class="ui placeholder">
                                <div class="paragraph">
                                    <div class="line"></div>
                                </div>
                            </div>
                        </template>
                        <template v-if="!item.loading">
                            <div class="ui right aligned small header">
                                {{ item.price * item.quantity | toCurrency('en-AU') }}
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
var $ = window.$;
export default {
    name: 'CartItems',
    props: [],
    data(){
        return {
            items: [
                {
                    loading:false,
                    title: 'Standard Consultation',
                    subTitle: 'Physiotherapy | Item #: PY310 | 20 minutes',
                    image: 'https://semantic-ui.com/images/wireframe/image.png',
                    isService: true,
                    quantity: 1,
                    price: 74.95
                },
                {
                    loading:false,
                    title: 'OPC Pillow',
                    subTitle: 'Fall asleep in the clouds.',
                    image: 'https://semantic-ui.com/images/wireframe/image.png',
                    isService: false,
                    quantity: 3,
                    price: 74.95
                }
            ]
        }
    },
    computed: {
    },
    methods: {
       
    },
}
</script>
