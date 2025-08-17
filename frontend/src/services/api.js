import axios from "axios";
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// Tipos de componente
export const listTipos = () => API.get('/componentes/tipos');
export const getTipo = (id) => API.get(`/componentes/tipos/${id}`);
export const createTipo = (data) => API.post('/componentes/tipos', data);
export const updateTipo = (id, data) => API.put(`/componentes/tipos/${id}`, data);
export const deleteTipo = (id) => API.delete(`/componentes/tipos/${id}`);

// Componentes
export const listComponentes = () => API.get('/componentes');
export const getComponente = (id) => API.get(`/componentes/${id}`);
export const createComponente = (data) => API.post('/componentes', data);
export const updateComponente = (id, data) => API.put(`/componentes/${id}`, data);
export const deleteComponente = (id) => API.delete(`/componentes/${id}`);