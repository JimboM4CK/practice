import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/api'
import date from '@/helpers/date'

import StaffMember from '@/models/StaffMember'

//import { isContext } from 'vm';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lastUpdate: {},
    diaryData: {
      date: new Date(),
      entries: {},
      staffMembers: {}
    },
    diaryAction: null,
    userInfo: {},
    groupInfo: {},
    companyInfo: {},
    JWT: ''
  },

  getters: {
    JWT: state => {
      return state.JWT;
    },
    diaryData: state => {
      return state.diaryData;
    },
    diaryAction: state => {
      return state.diaryAction;
    },
    diaryDateIso: state => {
      return date.dateToIso(state.diaryData.date);
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
    },
    timeZone: state => {
      return state.companyInfo.Locale.Timezone;
    }
  },
  mutations: {
    setJWT (state, payload) {
      state.JWT = payload.token;
    },
    setUserInfo(state, payload){
      state.userInfo = payload.userInfo;
    },
    setGroupInfo(state, payload){
      state.groupInfo = payload.groupInfo;
    },
    setCompanyInfo(state, payload){
      state.companyInfo = payload.companyInfo;
    },
    setDiaryData(state, payload){
      state.diaryData = payload.date;
    },
    setDiaryAction(state, payload){
      state.diaryAction = payload.action;
    },
    setDiaryDate(state, payload){
      state.diaryData.date = payload.date;
    },
    incrementDiaryDate(state){
      state.diaryData.date.setDate(state.diaryData.date.getDate() + 1);
    },
    decrementDiaryDate(state){
      state.diaryData.date.setDate(state.diaryData.date.getDate() - 1);
    },
    processDiaryData(state, payload){
      state.diaryData.staffMembers = payload[0];
      let staffMembers = payload[0];
      let entries = payload[1];
      let rosters = payload[2];
      let staffMemberList = [];
      staffMembers.forEach(staffMember => {
        staffMemberList.push(new StaffMember(staffMember));
      });
      state.diaryData = { ...state.diaryData, staffMembers: staffMemberList }

      let entryList = [];
      entries.forEach(entry => {
        if(typeof entryList[entry.StaffID] === 'undefined') entryList[entry.StaffID] = {};
        if(typeof entryList[entry.StaffID][entry.EntryType] === 'undefined') entryList[entry.StaffID][entry.EntryType] = [];
        entryList[entry.StaffID][entry.EntryType].push(entry);
      });
      rosters.forEach(entry => {
        if(typeof entryList[entry.StaffID] === 'undefined') entryList[entry.StaffID] = {};
        if(typeof entryList[entry.StaffID][entry.EntryType] === 'undefined') entryList[entry.StaffID][entry.EntryType] = [];
        entryList[entry.StaffID][entry.EntryType].push(entry);
      });
      state.diaryData = { ...state.diaryData, entries: entryList }
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
        context.commit('setUserInfo', {userInfo: data.userInfo});
        context.commit('setCompanyInfo', {companyInfo: data.companyInfo});
        context.commit('setGroupInfo', {groupInfo: data.groupInfo});
        return Promise.resolve(true);
      } catch(err) {
        return Promise.reject(err);
      }
    },

    async diaryData({commit, getters}, payload){
      
      try {
        let results = await Promise.all([
          Api.Diary.getDiaryStaff(),
          Api.Diary.getDiaryEntries({date: payload.date}),
          Api.Diary.getDiaryStaffRosters({date: payload.date}),
        ]);
        
        let slotMinutes = getters.companyInfo.SlotMinutes;
        results[1].forEach(entry => {
          let startTime = new Date(entry.StartTime);
          let endTime = new Date(entry.EndTime);
          entry.TimeSlots = (endTime.getTime() - startTime.getTime()) / (slotMinutes * 60000);
        });
        commit('processDiaryData', results);
        return Promise.resolve(true);
      } catch(err) {
        return Promise.reject(err);
      }
    },

    async diaryAddReservation( {dispatch, getters}, payload ){
      try {
        await Api.Diary.addDiaryEntry({
          type: 'reservation', 
          startTime: payload.startTime.toUTCString(), 
          endTime: payload.endTime.toUTCString(),
          staffId: payload.staffId
        });
        dispatch('diaryData', {date: getters.diaryDateIso});
        return Promise.resolve(true);
      } catch(err) {
        return Promise.reject(err);
      }
    },
    async diaryRemoveReservation( {dispatch, getters}, payload ){
      try {
        await Api.Diary.removeDiaryEntry({
          type: 'reservation', 
          startTime: payload.startTime.toUTCString(), 
          endTime: payload.endTime.toUTCString(),
          staffId: payload.staffId
        });
        dispatch('diaryData', {date: getters.diaryDateIso});
        return Promise.resolve(true);
      } catch(err) {
        return Promise.reject(err);
      }
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})