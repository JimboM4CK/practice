import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/api'
import date from '@/helpers/date'
//import { isContext } from 'vm';

Vue.use(Vuex);

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
    diaryDateIso: state => {
      return date.dateToIso(state.diaryDate);
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
    },
    processDiaryData(state, payload){
      console.log(payload);
    }
  },
  actions: {

    async initialLoad(context){
      try {
        //let results = await Promise.all([
        await Promise.all([
          context.dispatch('diaryData', {id: context.getters.diaryDateIso})
        ]);
        return Promise.resolve(true);
      } catch(err) {
        return Promise.reject(err);
      }
      //load diary info for today
    },

    checkForUpdates(){
      //let response = await Api.checkForUpdates()
      //response
      //checks through a table that has last table update for that company
      //iterate response rows and check lastUpdate objects
      //update if needed
    },

    async fetchGroupInfo( context, payload ){
        try {
          let result = await Api.Groups.getGroup(payload.id);
          return Promise.resolve(result);
        } catch(err) {
          return Promise.reject(err);
        }
    },

    async fetchCompanyInfo( context, payload ){
      try {
        let result = await Api.Companies.getCompany(payload.id);
        return Promise.resolve(result);
      } catch(err) {
        return Promise.reject(err);
      }
    },
    
    async login(context, payload){
      try {
        let data = await Api.login({email: payload.email, password: payload.password});
        context.commit('setJWT', {token: data.token});
        context.commit('setUserInfo', {user: data.userInfo});
        context.commit('setCompanyInfo', {user: data.companyInfo});
        context.commit('setGroupInfo', {user: data.groupInfo});
        return Promise.resolve(true);
      } catch(err) {
        return Promise.reject(err);
      }
    },

    async diaryData({commit}, payload){
      try {
        let results = await Promise.all([
          Api.Diary.getDiaryStaff(),
          Api.Diary.getDiaryEntries({date: payload.date})
        ]);
        commit('processDiaryData', results);
        return Promise.resolve(true);
      } catch(err) {
        return Promise.reject(err);
      }
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})