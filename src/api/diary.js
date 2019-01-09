import Api from '@/api/api'

export default {
    getDiaryStaff () {
        return Api().get(`/diary/staff`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    getDiaryEntries (params) {
        return Api().get(`/diary/entries?date=${params.date}`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    getDiaryStaffRosters (params) {
        return Api().get(`/diary/staff-roster?date=${params.date}`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    addDiaryEntry (params) {
        return Api().post(`/diary/entries/add`, params).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    removeDiaryEntry (params) {
        return Api().post(`/diary/entries/remove`, params).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    }
}