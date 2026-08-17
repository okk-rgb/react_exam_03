const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authApi = {
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};

export const productApi = {
  getAll: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/cards?${query}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/cards/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  create: async (cardData) => {
    const res = await fetch(`${API_BASE_URL}/cards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cardData),
    });
    return res.json();
  },
  update: async (id, cardData) => {
    const res = await fetch(`${API_BASE_URL}/cards/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cardData),
    });
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/cards/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};

export const categoryApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return res.json();
  },
  create: async (category_name) => {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ category_name }),
    });
    return res.json();
  },
};

export const cartApi = {
  getCart: async () => {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  addToCart: async (card_id, quantity = 1) => {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ card_id, quantity }),
    });
    return res.json();
  },
  updateQuantity: async (id, quantity) => {
    const res = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return res.json();
  },
  removeFromCart: async (id) => {
    const res = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  getTotal: async () => {
    const res = await fetch(`${API_BASE_URL}/cart/total`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  buy: async () => {
    const res = await fetch(`${API_BASE_URL}/cart/buy`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};

export const favoriteApi = {
  getFavorites: async () => {
    const res = await fetch(`${API_BASE_URL}/favorites`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  addFavorite: async (card_id) => {
    const res = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ card_id }),
    });
    return res.json();
  },
  removeFavorite: async (card_id) => {
    const res = await fetch(`${API_BASE_URL}/favorites/${card_id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};
