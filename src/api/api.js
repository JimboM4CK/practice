import axios from 'axios'
import store from '@/store'
import config from '@/helpers/config'

export default() => {
    return axios.create({
        baseURL: config.apiUrl,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+store.getters.JWT
        }
    })
}