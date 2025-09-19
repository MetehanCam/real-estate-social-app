import React, { useState } from 'react';
import { createPost, getCurrentUser } from '../../data/staticMockData';
import './PostForm.css';

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const MAX_CHARACTERS = 280;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Lütfen bir şeyler yazın');
      return;
    }

    if (content.length > MAX_CHARACTERS) {
      setError(`Gönderi çok uzun. Maksimum ${MAX_CHARACTERS} karakter kullanabilirsiniz.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setError('Gönderi paylaşmak için giriş yapmalısınız');
        setLoading(false);
        return;
      }
      
      const result = await createPost(content.trim(), currentUser.id);
      if (result.success) {
        setContent('');
        onPostCreated(result.post);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Gönderi oluşturulamadı. Lütfen tekrar deneyin.');
    }

    setLoading(false);
  };



  const remainingChars = MAX_CHARACTERS - content.length;
  const isOverLimit = remainingChars < 0;

  return (
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Yeni Gönderi Oluştur</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Emlak dünyasından neler oluyor? Düşüncelerinizi paylaşın..."
              rows="4"
              style={{ 
                width: '100%', 
                resize: 'vertical',
                minHeight: '100px'
              }}
              disabled={loading}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: content.length > 280 ? '#ef4444' : '#64748b'
            }}>
              <span>{content.length}/280 karakter</span>
              {content.length > 280 && (
                <span style={{ color: '#ef4444' }}>Karakter sınırı aşıldı!</span>
              )}
            </div>
          </div>
          
          {error && (
            <div style={{ 
              color: '#ef4444', 
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading || !content.trim() || content.length > 280}
            style={{
              opacity: (loading || !content.trim() || content.length > 280) ? 0.6 : 1
            }}
          >
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      </div>
  );
};

export default PostForm;