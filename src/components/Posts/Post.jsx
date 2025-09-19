import React, { useState, useEffect } from 'react';
import { getUserById, likePost, addComment, getCurrentUser } from '../../data/staticMockData';
import './Post.css';

const Post = ({ post, onPostUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes?.length || 0);
  const [localComments, setLocalComments] = useState(post.comments || []);
  const [loading, setLoading] = useState(false);

  // Handle both old mock data structure and new MongoDB structure
  const author = post.user || getUserById(post.userId);
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleLike = async () => {
    if (isLiked) return; // Prevent multiple likes
    
    setIsLiked(true);
    setLocalLikes(prev => prev + 1);
    
    try {
      const result = await likePost(post._id || post.id);
      if (result.success && onPostUpdate) {
        onPostUpdate();
      }
    } catch (err) {
      // Revert on error
      setIsLiked(false);
      setLocalLikes(prev => prev - 1);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || loading) return;

    setLoading(true);
    
    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        console.error('User must be logged in to comment');
        setLoading(false);
        return;
      }

      const result = await addComment(post._id || post.id, commentText.trim(), currentUser._id || currentUser.id);
      if (result.success) {
        setLocalComments(prev => [...prev, result.comment]);
        setCommentText('');
        if (onPostUpdate) {
          onPostUpdate();
        }
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
    
    setLoading(false);
  };

  return (
    <div className="post">
      <div className="post-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {author?.avatar && !author.avatar.includes('placeholder') && !author.avatar.includes('ui-avatars') ? (
            <img 
              src={author.avatar} 
              alt={`${author?.fullName || author?.name || 'User'} avatar`}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              {(author?.fullName || author?.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <span className="post-author">
            {author?.fullName || author?.name || 'Unknown User'}
          </span>
        </div>
        <span className="post-time">{formatTime(post.timestamp || post.createdAt)}</span>
      </div>
      
      <div className="post-content">
        {post.content}
      </div>
      
      <div className="post-actions">
        <button
          onClick={handleLike}
          disabled={isLiked}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: isLiked ? '#ef4444' : '#64748b',
            fontSize: '0.875rem'
          }}
        >
          {isLiked ? '❤️' : '🤍'} {localLikes} {localLikes === 1 ? 'beğeni' : 'beğeni'}
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#64748b',
            fontSize: '0.875rem'
          }}
        >
          💬 {localComments.length} {localComments.length === 1 ? 'yorum' : 'yorum'}
        </button>
      </div>

      {showComments && (
        <div className="comments-section" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <form onSubmit={handleComment} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Yorum ekle..."
                style={{ flex: 1 }}
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading || !commentText.trim()}
                style={{ minWidth: '80px' }}
              >
                {loading ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </form>

          {/* Comments list */}
          {localComments.length > 0 && (
            <div>
              {localComments.map((comment) => {
                // Handle both MongoDB structure (with populated user) and old mock data structure
                const commentAuthor = comment.user || getUserById(comment.userId);
                return (
                  <div key={comment._id || comment.id} style={{ 
                    marginBottom: '0.75rem', 
                    padding: '0.75rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.25rem'
                    }}>
                      {commentAuthor?.avatar && !commentAuthor.avatar.includes('placeholder') && !commentAuthor.avatar.includes('ui-avatars') ? (
                        <img 
                          src={commentAuthor.avatar} 
                          alt={`${commentAuthor?.fullName || commentAuthor?.name || 'User'} avatar`}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          {(commentAuthor?.fullName || commentAuthor?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                        {commentAuthor?.fullName || commentAuthor?.name || 'Unknown User'}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                        {formatTime(comment.timestamp)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                      {comment.content}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;