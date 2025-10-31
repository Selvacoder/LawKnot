const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('lexiai_token');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('lexiai_token', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('lexiai_token');
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
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
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

// Documents API
export const documentsAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('document', file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  },

  getAnalysis: async (documentId) => {
    return apiRequest(`/documents/${documentId}/analysis`);
  },

  getUserDocuments: async () => {
    return apiRequest('/documents');
  },
};

// AI API
export const aiAPI = {
  chat: async (message, conversationId = null) => {
    return apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    });
  },
};

// Forum API
export const forumAPI = {
  getPosts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/forum?${queryString}`);
  },

  createPost: async (postData) => {
    return apiRequest('/forum', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  getPost: async (postId) => {
    return apiRequest(`/forum/${postId}`);
  },

  addReply: async (postId, content) => {
    return apiRequest(`/forum/${postId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  likePost: async (postId) => {
    return apiRequest(`/forum/${postId}/like`, {
      method: 'POST',
    });
  },
};

// Cases API
export const casesAPI = {
  search: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/cases/search?${queryString}`);
  },

  getCase: async (caseId) => {
    return apiRequest(`/cases/${caseId}`);
  },

  getStats: async () => {
    return apiRequest('/cases/stats/overview');
  },
};

export { getAuthToken, setAuthToken, removeAuthToken };