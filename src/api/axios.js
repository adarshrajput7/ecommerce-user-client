import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Browser Console nalli URL nodalu e line serisi:
console.log("Current API Base URL:", BASE_URL);

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default API;