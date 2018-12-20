import Vue from 'vue'
import Vuex from 'vuex'
//import { isContext } from 'vm';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lastUpdate: {},
    diaryData: {},
    userInfo: {},
    groupInfo: {},
    companyInfo: {},
    diaryDate: new Date(),
    JWT: '',
  },
  getters: {
    JWT: state => {
      return state.JWT;
    },
    diaryData: state => {
      return state.diaryData;
    },
    diaryDate: state => {
      return state.diaryDate;
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
    },
    companyInfo: state => {
      return state.companyInfo;
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
    },
    setCompanyInfo(state, payload){
      state.companyInfo = payload;
    },
    setDiaryData(state, payload){
      state.diaryData = payload.date;
    },
    setDiaryDate(state, payload){
      state.diaryDate = payload.date;
    },
    incrementDiaryDate(state){
      state.diaryDate.setDate(state.diaryDate.getDate() + 1);
    },
    decrementDiaryDate(state){
      state.diaryDate.setDate(state.diaryDate.getDate() - 1);
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
    fetchGroupInfo( context, payload ){
      this.$api.groups.getGroup(payload.id).then( data => {
        context.commit('setGroupInfo', data);
      });
    },
    fetchCompanyInfo( context, payload ){
      this.$api.groups.getGroup(payload.id).then( data => {
        context.commit('setCompanyInfo', data);
      });
    },
    
    login(context, payload){
      if(!this.$store.getters.isLoggedIn){
        this.$api.login({email: payload.email, password: payload.password}).then( data => {
            context.commit('setJWT', data);
        });
      }
    },
    async loadDiary(context){
      if(!this.$store.getters.isLoggedIn){
        let diaryStaff = this.$api.diary.getDiaryStaff({date: this.$store.getters.diaryDate}).then( data => {
          return data;
        });
        let diaryEntries = this.$api.diary.getDiaryEntries({date: this.$store.getters.diaryDate}).then( data => {
          return data;
        });
        let data = {};
        data.diaryStaff = await diaryStaff;
        data.diaryStaff = await diaryEntries;
        context.commit('setDiaryData', data);
      }
    }

  },
  strict: process.env.NODE_ENV !== 'production'
})