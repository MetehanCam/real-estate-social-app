import React, { useState } from 'react';
import { register } from '../../data/staticMockData';
import './Signup.css';

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    bio: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Kullanıcı adı gereklidir';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Ad soyad gereklidir';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-posta geçersiz';
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        bio: formData.bio || 'Emlak uzmanı'
      });

      if (result.success) {
        onSignup(result.user);
      } else {
        setErrors({ general: result.message });
      }
    } catch (err) {
      setErrors({ general: err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    }

    setLoading(false);
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Emlak Mikroblog'a Katıl</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Kullanıcı Adı *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Bir kullanıcı adı seçin"
            disabled={loading}
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="name">Ad Soyad *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ad ve soyadınız"
            disabled={loading}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">E-posta *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="eposta@ornek.com"
            disabled={loading}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="bio">Biyografi (İsteğe Bağlı)</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Emlak uzmanlığınız hakkında bilgi verin..."
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Şifre *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Bir şifre oluşturun"
            disabled={loading}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Şifre Tekrarı *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Şifrenizi tekrar girin"
            disabled={loading}
          />
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>

        {errors.general && <div className="error">{errors.general}</div>}

        <button type="submit" disabled={loading} style={{ width: '100%', marginBottom: '1rem' }}>
          {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
        </button>
      </form>

      <div style={{ textAlign: 'center', color: '#64748b' }}>
        Zaten hesabınız var mı?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0
          }}
        >
          Buradan giriş yapın
        </button>
      </div>
    </div>
  );
};

export default Signup;