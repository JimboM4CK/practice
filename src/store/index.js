import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/api/api.js'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    lastUpdate: {},
  },
  getters: {

  },
  mutations: {

  },
  actions: {
    setLastUpdate(type){
      lastUpdate.prototype.type = new Date()
    },
    checkForUpdates(){
      let response = await this.$api.checkForUpdates()
      //response
      //checks through a table that has last table update for that company
      //iterate response rows and check lastUpdate objects
      //update if needed
    },
    updatePractice(){
      //fetch practice data
      this.actions.setLastUpdate('practice')
      
    }
  }
})
