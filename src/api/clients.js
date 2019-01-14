import Api from '@/api/api'

export default {
    searchClients (params) {
        return Api().get(`/clients/search/${params.query}`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    clientEpisodes (params) {
        return Api().get(`/clients/${params.clientId}/episodes`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    }
}