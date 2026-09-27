// api.ts — all API calls in one place

import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Create an axios instance that automatically attaches the token
export const api = axios.create({
  baseURL: API_URL,
});

// Before every request, add the token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth ---
export async function login(email: string, password: string) {
  const response = await api.post('/login', { email, password });
  return response.data; // { token, role, email }
}

// --- Flags ---
export async function getFlags() {
  const response = await api.get('/flags');
  return response.data;
}

export async function getFlag(id: string) {
  const response = await api.get(`/flags/${id}`);
  return response.data;
}

export async function decideFlag(id: string, decision: string, notes: string = '') {
  const response = await api.post(`/flags/${id}/decide`, { decision, notes });
  return response.data;
}

export async function resolveFlag(id: string) {
  const response = await api.post(`/flags/${id}/resolve`);
  return response.data;
}