import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const authService = {
    register: async (userData) => {
        const response = await axiosInstance.post('/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await axiosInstance.post('/login', credentials);
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    },

    logout: async () => {
        try {
            await axiosInstance.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    },

    getCurrentUser: () => {
        return localStorage.getItem('accessToken');
    },

    getUserProfile: async () => {
        const response = await axiosInstance.get('/user/profile');
        return response.data;
    },

    loginWithGoogle: () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    },

    loginWithGithub: () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/github';
    }
};

export default authService;
