import React, { useState, useEffect } from 'react';
import { getAllPosts } from '../../data/staticMockData';
import Post from './Post';
import PostForm from './PostForm';
import './Timeline.css';
const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handlePostUpdate = () => {
    loadPosts(); // Reload posts to get updated data
  };

  return (
    <div>
      <h2>Ana Sayfa</h2>
      <PostForm onPostCreated={handlePostCreated} />
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Gönderiler yükleniyor...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>Henüz gönderi yok</h3>
          <p>İlk gönderiyi siz oluşturun!</p>
        </div>
      ) : (
        <div>
          {posts.map(post => (
            <Post 
              key={post.id} 
              post={post} 
              onPostUpdate={handlePostUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;