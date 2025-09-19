const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }
    
    return response;
  },

  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: async () => {
    try {
      return await apiRequest('/auth/me');
    } catch (error) {
      // If token is invalid, clear localStorage
      authAPI.logout();
      throw error;
    }
  }
};

// Posts API
export const postsAPI = {
  getAllPosts: async () => {
    return await apiRequest('/posts');
  },

  createPost: async (postData) => {
    return await apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  likePost: async (postId) => {
    return await apiRequest(`/posts/${postId}/like`, {
      method: 'POST'
    });
  },

  addComment: async (postId, content) => {
    return await apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  },

  deletePost: async (postId) => {
    return await apiRequest(`/posts/${postId}`, {
      method: 'DELETE'
    });
  }
};

// Users API
export const usersAPI = {
  getUserById: async (userId) => {
    return await apiRequest(`/users/${userId}`);
  },

  updateProfile: async (profileData) => {
    return await apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  getAllUsers: async () => {
    return await apiRequest('/users');
  }
};

// Helper functions for backward compatibility
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};