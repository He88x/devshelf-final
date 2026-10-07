import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await register(userName, email, password);
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create your DevShelf account</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userName">Username</label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            required
          />
        </div>

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
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;