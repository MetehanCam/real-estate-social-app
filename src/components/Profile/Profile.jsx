import React,import { useState, useEffect } from 'react';
import { getPostsByUserId, getCurrentUser } from '../../data/staticMockData';
import Post from '../Posts/Post';
import './Profile.css';
const Profile = ({ user }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = user || getCurrentUser();

  const loadUserPosts = async () => {
    if (!currentUser) return;
    
    try {
      const posts = await getPostsByUserId(currentUser.id);
      // Posts are already sorted in the backend function
      setUserPosts(posts);
    } catch (err) {
      console.error('Failed to load user posts:', err);
      setUserPosts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserPosts();
  }, [currentUser]);

  const handlePostUpdate = () => {
    loadUserPosts(); // Reload posts to get updated data
  };

  if (!currentUser) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Please log in to view your profile.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Profil yükleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          {currentUser.avatar && !currentUser.avatar.includes('placeholder') && !currentUser.avatar.includes('ui-avatars') ? (
            <img 
              src={currentUser.avatar} 
              alt={`${currentUser.name} avatar`}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              {(currentUser.fullName || currentUser.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 style={{ margin: 0 }}>{currentUser.fullName || currentUser.name}</h2>
            <p style={{ margin: '0.25rem 0', color: '#64748b' }}>@{currentUser.username}</p>
            {currentUser.bio && <p style={{ margin: '0.5rem 0' }}>{currentUser.bio}</p>}
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '2rem',
          padding: '1rem 0',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{userPosts.length}</div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Gönderi</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Gönderilerim</h3>
        
        {userPosts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#64748b', 
            padding: '2rem',
            fontStyle: 'italic'
          }}>
            Henüz gönderi paylaşmadınız.
          </div>
        ) : (
          <div>
            {userPosts.map((post) => (
              <Post 
                key={post.id} 
                post={post} 
                onPostUpdate={handlePostUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;