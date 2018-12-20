import Api from '@/api/api'

export default {
    getDiaryStaff (params) {
        return Api().get(`/diary/${params.date}/staff`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    getDiaryEntries (params) {
        return Api().get(`/diary/${params.date}/entries`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    }
}