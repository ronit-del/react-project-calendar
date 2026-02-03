import axios from 'axios';

const url = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async (data: any) => {
    try {
        const response = await api.post('/login', data);
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

export const getUser = async () => {
    try {
        const response = await api.get('/getUser', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    } catch (error: any) {
        console.error('Error getting user:', error.response || error.message);
        throw error;
    }
};

export const forgotPassword = async (email: string) => {
    try {
        const response = await api.post('/forgot-password', { email });
        return response;
    } catch (error) {
        console.error('Error forgotting password:', error);
        throw error;
    }
};

export const resetPassword = async (data: any) => {
    try {
        const response = await api.post('/reset-password', data);
        return response;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};