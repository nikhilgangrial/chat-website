import axios from 'axios';
import { HOST } from './constants';

/**
 * @param {String} path
 * @param {String} method get, post, delete, put, patch
 * @param {Object} payload data
 * @param {Boolean} auth 
*/
export const api = async (path, method='get', payload={}, auth=false) => {
    
    const headers = {
        'Content-Type': 'application/json',
    }

    if (auth) {
        if (localStorage.getItem('token')) {
            headers['Authorization'] = `Token ${localStorage.getItem('token')}`
        }
    }

    const url = HOST + path;

    return await axios({
        method: method,
        url: url,
        data: payload,
        headers: headers,
    },
    {
        withCredentials: true
    }
    )
}
