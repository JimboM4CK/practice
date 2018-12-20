import Vue from 'vue'
import Vuex from 'vuex'
//import { isContext } from 'vm';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lastUpdate: {},
    userInfo: {},
    groupInfo: {},
    JWT: '',
  },
  getters: {
    JWT: state => {
      return state.JWT;
    },
    isLoggedIn: state => {
      //TODO: Read JWT file and make sure is valid
      return state.JWT ? true : false;
    },
    userInfo: state => {
      return state.userInfo;
    },
    groupInfo: state => {
      return state.groupInfo;
    }
  },
  mutations: {
    setJWT (state, payload) {
      state.JWT = payload.token;
    },
    setUserInfo(state, payload){
      state.userInfo = payload;
    },
    setGroupInfo(state, payload){
      state.groupInfo = payload;
    }
  },
  actions: {
    
    checkForUpdates(){
      //let response = await this.$api.checkForUpdates()
      //response
      //checks through a table that has last table update for that company
      //iterate response rows and check lastUpdate objects
      //update if needed
    },
    updateCompany(){
      //fetch company data
      //this.actions.setLastUpdate('')
      
    },
    updateUserGroupInfo( context ){
      this.$api.Groups.getGroup(this.$store.getters.userInfo.GroupID).then( data => {
        context.commit('setGroupInfo', data);
      });
    }
  },
  
  strict: process.env.NODE_ENV !== 'production'
})