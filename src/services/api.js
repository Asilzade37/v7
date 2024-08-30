import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  register: (userData) => {
    console.log('Kayıt isteği gönderiliyor:', userData);
    console.log('API URL:', `${API_URL}/users/register`);
    return axios.post(`${API_URL}/users/register`, userData)
      .then((response) => {
        console.log('Kayıt yanıtı:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('Kayıt hatası:', error);
        if (error.response) {
          console.error('Hata yanıtı:', error.response.data);
          console.error('Hata durumu:', error.response.status);
        } else if (error.request) {
          console.error('Yanıt alınamadı');
        } else {
          console.error('Hata:', error.message);
        }
        throw error;
      });
  },

  login: (credentials) => {
    console.log('Giriş isteği gönderiliyor:', credentials);
    return axios.post(`${API_URL}/users/login`, credentials)
      .then((response) => {
        console.log('Giriş yanıtı:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('Giriş hatası:', error);
        if (error.response) {
          console.error('Hata yanıtı:', error.response.data);
          console.error('Hata durumu:', error.response.status);
        } else if (error.request) {
          console.error('Yanıt alınamadı');
        } else {
          console.error('Hata:', error.message);
        }
        throw error;
      });
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProducts: () => {
    return axios.get(`${API_URL}/products`);
  },

  createProduct: (productData) => {
    return axios.post(`${API_URL}/products`, productData);
  },

  updateProduct: (id, productData) => {
    return axios.put(`${API_URL}/products/${id}`, productData);
  },

  deleteProduct: (id) => {
    return axios.delete(`${API_URL}/products/${id}`);
  },

  checkBarcode: (barcode) => {
    return axios.get(`${API_URL}/products/barcode/${barcode}`);
  },

  // Yeni fonksiyon: addProductGroup
  addProductGroup: (productGroupName) => {
    return axios.post(`${API_URL}/product-groups`, { name: productGroupName });
  },

  getProductGroups: () => {
    return axios.get(`${API_URL}/product-groups`);
  },
};

// Tüm fonksiyonları dışa aktar
export const {
  register,
  login,
  getCurrentUser,
  logout,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  checkBarcode,
  addProductGroup,
  getProductGroups,
} = api;

export default api;
