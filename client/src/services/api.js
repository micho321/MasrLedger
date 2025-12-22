import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: '/api', // Use relative path to leverage Vite proxy
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const savedUser = localStorage.getItem('masrledger_user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser.token) {
                config.headers.Authorization = `Bearer ${parsedUser.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors (401, etc.)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('masrledger_user');
            // Optional: Redirect to login or dispatch a logout action
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
