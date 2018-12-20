import Api from '@/api/api'

export default {
    getGroup (params) {
        return Api().get(`/groups/${params.id}`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    getGroupPractices (params) {
        return Api().get(`/groups/${params.id}/practices`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    }
}