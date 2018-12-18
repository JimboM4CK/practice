import Api from '@/api/api'

export default {
    login (params) {
        return Api().post('/login', {
            email: params.email,
            password: params.password
        }).then(function(response){
            console.log(response.data.token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
        }).catch(function(response){
            console.log(response);
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