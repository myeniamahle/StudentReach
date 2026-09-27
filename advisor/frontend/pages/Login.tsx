// Login.tsx — email/password form

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(email, password);

      // Save token to localStorage — this is the session
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      // Redirect based on role
      if (data.role === 'advisor') {
        navigate('/advisor/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: unknown) {
      const response = (err as {
        response?: { data?: { detail?: string } };
      }).response;
      setError(response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h1>Advisor Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}