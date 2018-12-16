import axios from 'axios'

export default() => {
    return axios.create({
        baseURL: `http://localhost:8080/api`,
        // jmdb.cwcxibundeox.ap-southeast-2.rds.amazonaws.com
        // root
        // JKaws123!
        // db: practice
        
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}