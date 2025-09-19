// Static mock data for frontend-only deployment
// This allows the app to work without a backend server

// Mock users data
export const mockUsers = [
  {
    id: 1,
    _id: '1',
    username: 'emlakci_ahmet',
    fullName: 'Ahmet Yılmaz',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@emlak.com',
    bio: 'İstanbul\'da 10 yıllık deneyimli emlak uzmanı. Konut ve ticari gayrimenkul danışmanı.',
    avatar: null,
    joinDate: '2023-01-15'
  },
  {
    id: 2,
    _id: '2',
    username: 'ayse_emlak',
    fullName: 'Ayşe Demir',
    name: 'Ayşe Demir',
    email: 'ayse@emlak.com',
    bio: 'Lüks konut uzmanı ve iç mimar. Modern yaşam alanları tasarlıyorum.',
    avatar: null,
    joinDate: '2023-03-20'
  },
  {
    id: 3,
    _id: '3',
    username: 'mehmet_yatirim',
    fullName: 'Mehmet Kaya',
    name: 'Mehmet Kaya',
    email: 'mehmet@emlak.com',
    bio: 'Gayrimenkul yatırım danışmanı. Karlı yatırım fırsatları sunuyorum.',
    avatar: null,
    joinDate: '2023-02-10'
  }
];

// Mock posts data
export const mockPosts = [
  {
    id: 1,
    _id: '1',
    user: mockUsers[0],
    userId: 1,
    content: 'Beşiktaş\'ta deniz manzaralı 3+1 daire! Muhteşem konum, yeni yapı. Detaylar için DM atın. 🏠🌊',
    likes: [1, 2],
    comments: [
      {
        id: 1,
        user: mockUsers[1],
        userId: 2,
        content: 'Çok güzel görünüyor! Fiyat bilgisi alabilir miyim?',
        timestamp: new Date('2024-01-15T10:30:00')
      }
    ],
    timestamp: new Date('2024-01-15T09:00:00')
  },
  {
    id: 2,
    _id: '2',
    user: mockUsers[1],
    userId: 2,
    content: 'Ev dekorasyonunda doğal malzemeler kullanmanın avantajları nelerdir? Size önerilerim: 🌿✨',
    likes: [2, 3],
    comments: [],
    timestamp: new Date('2024-01-15T11:15:00')
  },
  {
    id: 3,
    _id: '3',
    user: mockUsers[2],
    userId: 3,
    content: 'Gayrimenkul yatırımında dikkat edilmesi gereken 5 önemli nokta! Thread açıyorum 👇',
    likes: [1],
    comments: [
      {
        id: 2,
        user: mockUsers[0],
        userId: 1,
        content: 'Çok faydalı bilgiler, teşekkürler!',
        timestamp: new Date('2024-01-15T12:45:00')
      }
    ],
    timestamp: new Date('2024-01-15T12:30:00')
  }
];

// Static data storage (using localStorage)
const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  POSTS: 'posts',
  USERS: 'users',
  POST_COUNTER: 'postCounter',
  COMMENT_COUNTER: 'commentCounter'
};

// Initialize data if not exists
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(mockPosts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.POST_COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.POST_COUNTER, '4');
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMMENT_COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.COMMENT_COUNTER, '3');
  }
};

// Static API functions
export const staticAPI = {
  // Auth functions
  login: async (email, password) => {
    initializeData();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    const user = users.find(u => u.email === email);
    
    if (user && password === 'demo123') { // Simple demo password
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return { success: true, user, token: 'demo-token' };
    }
    
    throw new Error('Invalid credentials');
  },

  register: async (userData) => {
    initializeData();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email || u.username === userData.username)) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: users.length + 1,
      _id: String(users.length + 1),
      username: userData.username,
      fullName: userData.fullName || userData.name,
      name: userData.fullName || userData.name,
      email: userData.email,
      bio: userData.bio || '',
      avatar: null,
      joinDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    
    return { success: true, user: newUser, token: 'demo-token' };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Posts functions
  getAllPosts: async () => {
    initializeData();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS));
    return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  createPost: async (postData) => {
    initializeData();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS));
    const currentUser = staticAPI.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User must be logged in');
    }
    
    const counter = parseInt(localStorage.getItem(STORAGE_KEYS.POST_COUNTER));
    const newPost = {
      id: counter,
      _id: String(counter),
      user: currentUser,
      userId: currentUser.id,
      content: postData.content,
      likes: [],
      comments: [],
      timestamp: new Date().toISOString()
    };
    
    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    localStorage.setItem(STORAGE_KEYS.POST_COUNTER, String(counter + 1));
    
    return newPost;
  },

  likePost: async (postId) => {
    initializeData();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS));
    const currentUser = staticAPI.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User must be logged in');
    }
    
    const post = posts.find(p => p.id == postId || p._id == postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    const userIdToAdd = currentUser.id || currentUser._id;
    if (!post.likes.includes(userIdToAdd)) {
      post.likes.push(userIdToAdd);
    }
    
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return post;
  },

  addComment: async (postId, content) => {
    initializeData();
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS));
    const currentUser = staticAPI.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User must be logged in');
    }
    
    const post = posts.find(p => p.id == postId || p._id == postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    const counter = parseInt(localStorage.getItem(STORAGE_KEYS.COMMENT_COUNTER));
    const newComment = {
      id: counter,
      _id: String(counter),
      user: currentUser,
      userId: currentUser.id,
      content: content,
      timestamp: new Date().toISOString()
    };
    
    post.comments.push(newComment);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    localStorage.setItem(STORAGE_KEYS.COMMENT_COUNTER, String(counter + 1));
    
    return newComment;
  },

  // Users functions
  getUserById: async (userId) => {
    initializeData();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    return users.find(u => u.id == userId || u._id == userId) || null;
  }
};

// Export functions for backward compatibility
export const login = async (email, password) => {
  try {
    const response = await staticAPI.login(email, password);
    return { success: true, user: response.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const register = async (userData) => {
  try {
    const response = await staticAPI.register(userData);
    return { success: true, user: response.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const logout = () => {
  staticAPI.logout();
};

export const getCurrentUser = () => {
  return staticAPI.getCurrentUser();
};

export const getUserById = async (userId) => {
  try {
    return await staticAPI.getUserById(userId);
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const getAllPosts = async () => {
  try {
    return await staticAPI.getAllPosts();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const createPost = async (content, userId) => {
  try {
    const response = await staticAPI.createPost({ content });
    return { success: true, post: response };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const likePost = async (postId, userId) => {
  try {
    const response = await staticAPI.likePost(postId);
    return { success: true, post: response };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addComment = async (postId, content, userId) => {
  try {
    const response = await staticAPI.addComment(postId, content);
    return { success: true, comment: response };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getPostsByUserId = async (userId) => {
  try {
    const allPosts = await staticAPI.getAllPosts();
    return allPosts.filter(post => post.user?.id == userId || post.user?._id == userId || post.userId == userId);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};