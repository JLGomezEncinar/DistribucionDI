import { getToken } from './authService';

const API_BASE_URL = 'http://localhost:8088/GestionIES/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Si el token es inválido o expiró
  if (response.status === 401) {
    throw new Error('UNAUTHORIZED');
  }

  // Parsear JSON solo si existe
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return null;
};
