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
    }
}