import axios from 'axios';

const url = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/auth';

const api = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async () => {
    try {
        const response = await api.get('/login');
        return response;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const register = async (data: any) => {
    try {
        const response = await api.post('/register', data);
        return response;
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
};