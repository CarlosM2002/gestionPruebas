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

// Casos de prueba
export const listCasos = () => API.get('/casos');
export const getCaso = (id) => API.get(`/casos/${id}`);
export const createCaso = (data) => API.post('/casos', data); 
export const updateCaso = (id, data) => API.put(`/casos/${id}`, data);
export const deleteCaso = (id) => API.delete(`/casos/${id}`);

// Planes de prueba
export const listPlanes = () => API.get("/planes");
export const getPlan = (id) => API.get(`/planes/${id}`);
export const createPlan = (data) => API.post("/planes", data);
export const updatePlan = (id, data) => API.put(`/planes/${id}`, data);
export const deletePlan = (id) => API.delete(`/planes/${id}`);

// agregar/quitar caso en plan
export const addCasoToPlan = (data) => API.post("/planes/agregar", data);
// quitar caso --> /planes/:planId/casos/:casoId
export const removeCasoFromPlan = (planId, casoId) => API.delete(`/planes/${planId}/casos/${casoId}`);

// listar casos dentro de un plan
export const listCasosInPlan = (planId) => API.get(`/planes/${planId}/casos`);

// listar planes del tester (si se necesita)
export const listPlanesForTester = () => API.get("/planes/mios");
