import Api from '@/api/api'

export default {
    getCompany (params) {
        return Api().get(`/companies/${params.id}`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    }
}