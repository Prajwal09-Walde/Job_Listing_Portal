import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// ─── Users / Profile ─────────────────────────────────────────
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);
export const uploadResume = (formData) =>
  API.post('/users/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getPublicProfile = (id) => API.get(`/users/${id}`);

// ─── Jobs ────────────────────────────────────────────────────
export const getJobs = (params) => API.get('/jobs', { params });
export const getJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getMyJobs = () => API.get('/jobs/my');
export const getJobApplications = (jobId) => API.get(`/jobs/${jobId}/applications`);

// ─── Applications ─────────────────────────────────────────────
export const applyToJob = (data) => API.post('/applications', data);
export const getMyApplications = () => API.get('/applications/my');
export const withdrawApplication = (id) => API.delete(`/applications/${id}`);
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}/status`, data);

export default API;
