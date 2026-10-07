import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/resources');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Welcome back to DevShelf</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;