import axios from 'axios';

const apiWithoutAuthHeader = axios.create({
    baseURL: 'https://certifai-backend.onrender.com/certifai',
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
