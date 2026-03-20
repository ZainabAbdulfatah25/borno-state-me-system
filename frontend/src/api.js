import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const getOrganizations = () => api.get('/organizations/');
export const getProjects = () => api.get('/projects/');
export const getReports = () => api.get('/reports/');

export default api;
