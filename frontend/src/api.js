import axios from 'axios';

// This creates a standard "messenger" that always knows where your backend is.
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Your Laravel API address
    withCredentials: true, // This allows cookies/sessions if we need them later
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default api;