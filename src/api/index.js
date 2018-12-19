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
        return Api().get(`/practice/${params.id}`)
    },
    getServicesCategories () {
        return Api().get(`/services/categories/`)
    },
    getServicesCategory ( params ) {
        return Api().get(`/services/categories/${params.id}`)
    },
    getServices () {
        return Api().get(`/services`)
    },
    getService (params) {
        return Api().get(`/services/${params.id}`)
    }
}