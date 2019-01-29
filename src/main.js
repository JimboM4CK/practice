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

Vue.filter('toCurrency', function (value, locale) {
  if(locale === undefined) locale = 'en-AU';

  const numberFormats = {
    'en-AU': {
      currency: 'AUD',
      decimals: 2
    },
    'en-US': {
      currency: 'USD',
      decimals: 2
    },
    'ja-JP': {
      currency: 'JPY',
      decimals: 0
    }
  }

  if (typeof value !== "number"){
    return value;
  }
  var formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: numberFormats[locale].currency,
    minimumFractionDigits: numberFormats[locale].decimals
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
