import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Button from '../components/Button';
import Input from '../components/Input';

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
      await register(
        userName,
        email,
        password
      );

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
    <div className="auth-page">

      <div className="auth-brand">
        <div className="brand-mark">
          D
        </div>

        <span>DevShelf</span>
      </div>

      <div className="auth-card">

        <div className="auth-header">
          <p className="page-eyebrow">
            Get Started
          </p>

          <h1>
            Create your account
          </h1>

          <p>
            Start building your personal developer
            command center.
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <Input
            label="Username"
            id="register-username"
            type="text"
            value={userName}
            onChange={(event) =>
              setUserName(event.target.value)
            }
            placeholder="Your username"
            required
          />

          <Input
            label="Email"
            id="register-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            id="register-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Create a password"
            required
          />

          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Creating account...'
              : 'Create account'}
          </Button>
        </form>

        <div className="auth-footer">
          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign in
          </Link>
        </div>

      </div>

      <p className="auth-note">
        Organize your development workflow in one place.
      </p>

    </div>
  );
}

export default RegisterPage;