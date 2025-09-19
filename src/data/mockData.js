// API-based data functions for the real estate microblog
import { authAPI, postsAPI, usersAPI, getCurrentUser as getStoredUser, isAuthenticated } from '../services/api.js';

// Export API functions for backward compatibility
export const login = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    return { success: true, user: response.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const register = async (userData) => {
  try {
    const response = await authAPI.register(userData);
    return { success: true, user: response.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const logout = () => {
  authAPI.logout();
};

export const getCurrentUser = () => {
  return getStoredUser();
};

export const getUserById = async (userId) => {
  try {
    return await usersAPI.getUserById(userId);
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const getAllPosts = async () => {
  try {
    return await postsAPI.getAllPosts();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const createPost = async (content, userId) => {
  try {
    const response = await postsAPI.createPost({ content });
    return { success: true, post: response };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const likePost = async (postId, userId) => {
  try {
    const response = await postsAPI.likePost(postId);
    return { success: true, post: response };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addComment = async (postId, content, userId) => {
  try {
    const response = await postsAPI.addComment(postId, content);
    return { success: true, comment: response };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getPostsByUserId = async (userId) => {
  try {
    const allPosts = await postsAPI.getAllPosts();
    return allPosts.filter(post => post.user?._id === userId || post.userId === userId);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};

// Mock data for initial development (can be removed once backend is fully integrated)
export const mockUsers = [
  {
    id: 1,
    username: 'emlakci_ahmet',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@emlak.com',
    bio: 'İstanbul\'da 10 yıllık deneyimli emlak uzmanı. Konut ve ticari gayrimenkul danışmanı.',
    avatar: '👨‍💼',
    joinDate: '2023-01-15'
  },
  {
    id: 2,
    username: 'ayse_emlak',
    name: 'Ayşe Demir',
    email: 'ayse@emlak.com',
    bio: 'Lüks konut uzmanı ve iç mimar. Modern yaşam alanları tasarlıyorum.',
    avatar: '👩‍💼',
    joinDate: '2023-03-20'
  },
  {
    id: 3,
    username: 'mehmet_yatirim',
    name: 'Mehmet Kaya',
    email: 'mehmet@emlak.com',
    bio: 'Gayrimenkul yatırım danışmanı. Karlı yatırım fırsatları sunuyorum.',
    avatar: '🏢',
    joinDate: '2023-02-10'
  }
];