import axios from 'axios';
import { ENV } from './config/environment';

const apiWithoutAuthHeader = axios.create({
    baseURL: ENV.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiWithoutAuthHeader.interceptors.request.use(
    (config) => {
        if (config.headers && config.headers['Authorization']) {
            delete config.headers['Authorization'];
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiWithoutAuthHeader;
