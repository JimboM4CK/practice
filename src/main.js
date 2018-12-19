import Vue from 'vue'
import App from '@/App.vue'

import api from '@/api'
import router from '@/router'
import store from '@/store'

Vue.config.productionTip = false;
Vue.prototype.$api = api;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
