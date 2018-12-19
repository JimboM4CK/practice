import Api from '@/api/api'

export default {
    login (params) {
        return Api().post('/login', {
            email: params.email,
            password: params.password
        }).then(response => {
            return {token: response.data.token};
        }).catch(error => {
            return {error: error}
        });
    },
    getPractice (params) {
        Api().get(`/practice/${params.id}`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    getServiceCategories () {
        return Api().get(`/services/categories/`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    getServiceCategory ( params ) {
        return Api().get(`/services/categories/${params.id}`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    getServices () {
        return Api().get(`/services`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    getService (params) {
        return Api().get(`/services/${params.id}`).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    }
}