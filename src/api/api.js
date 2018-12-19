import axios from 'axios'
import store from '@/store'

export default() => {
    return axios.create({
        baseURL: `http://localhost:10010`,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+store.getters.JWT
        }
    })
}