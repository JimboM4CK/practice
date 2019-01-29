import Vue from 'vue'
import App from '@/App.vue'

import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
Vue.use(VueMoment, { moment })

import api from '@/api'
import router from '@/router'
import store from '@/store'

Vue.config.productionTip = false;
Vue.prototype.$api = api;

Vue.filter('toCurrency', function (value) {
  if (typeof value !== "number"){
    return value;
  }
  let locale = store.getters.companyInfo.Locale;
  var formatter = new Intl.NumberFormat(locale.LanguageCode, {
    style: 'currency',
    currency: locale.CurrencyCode,
    minimumFractionDigits: locale.CurrencyDecimals
  });
  return formatter.format(value);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
