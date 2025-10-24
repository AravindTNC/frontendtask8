import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
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
    // Register
    register: async (userData) => {
        const response = await axiosInstance.post('/register', userData);
        return response.data;
    },

    // Login
    login: async (credentials) => {
        const response = await axiosInstance.post('/login', credentials);
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    // Get current user
    getCurrentUser: () => {
        return localStorage.getItem('accessToken');
    },

    // OAuth Google
    loginWithGoogle: () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    },

    // OAuth GitHub
    loginWithGithub: () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/github';
    }
};

export default authService;