import Api from '@/api/api'
import Groups from '@/api/groups'
import Companies from '@/api/companies'
import Diary from '@/api/diary'

export default {
    Groups: Groups,
    Companies: Companies,
    Diary: Diary,
    login (params) {
        return Api().post('/login', {
            email: params.email,
            password: params.password
        }).then(response => {
            return response.data;
        }).catch(error => {
            return {error: error}
        });
    },
    getPractice (params) {
        return Api().get(`/practice/${params.id}`).then(response => {
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