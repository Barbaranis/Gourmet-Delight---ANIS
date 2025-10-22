// src/axiosConfig.js
import axios from 'axios';


// Crée une instance Axios avec une baseURL vers le backend
const api = axios.create({
  baseURL: 'http://localhost:5000', 
});


// Intercepteur : ajoute le token depuis localStorage à CHAQUE requête    
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 🔄 récupéré dynamiquement à chaque appel
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default api;

