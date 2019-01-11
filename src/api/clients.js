import Api from '@/api/api'

export default {
    searchClients (params) {
        return Api().get(`/client/search/${params.query}`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    }
}