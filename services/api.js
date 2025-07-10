// services/api.js
import axios from "axios";

// DEVELOPMENT - localhost (ganti sesuai IP laptop Anda jika testing di device)
const API_BASE_URL = "http://103.67.79.200:3001/api";

// PRODUCTION - VPS (uncomment saat deploy)
// const API_BASE_URL = 'https://your-vps-server.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.code === "ECONNABORTED") {
      throw new Error("Koneksi timeout, coba lagi");
    }

    if (error.response?.status === 404) {
      throw new Error("Data tidak ditemukan");
    }

    if (error.response?.status >= 500) {
      throw new Error("Server error, coba lagi nanti");
    }

    throw new Error(error.response?.data?.error || "Terjadi kesalahan");
  }
);

// API functions
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addProduct = async (product) => {
  try {
    const response = await api.post("/products", product);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    throw error;
  }
};

export const searchProducts = async (query, page = 1, limit = 10) => {
  try {
    const response = await api.get("/products/search", {
      params: { search: query, page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Test API connection
export const testConnection = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    throw error;
  }
};
