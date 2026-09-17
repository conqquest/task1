import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white text-black">
      <div className="w-full max-w-md bg-white border border-black p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-black mb-2">JoinEazy</h2>
          <p className="text-black font-bold">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 border border-black text-black text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-black mb-1.5">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full bg-white border border-black px-4 py-3 text-black focus:outline-none rounded-none placeholder:text-[#666]"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold text-black">Password</label>
            </div>
            <input 
              required
              type="password" 
              className="w-full bg-white border border-black px-4 py-3 text-black focus:outline-none rounded-none placeholder:text-[#666]"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white font-bold border border-black hover:bg-white hover:text-black disabled:opacity-70 mt-4"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black">
          Don't have an account?{' '}
          <Link to="/register" className="text-black font-bold underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
