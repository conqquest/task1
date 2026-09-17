import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white text-black">
      <div className="w-full max-w-md bg-white border border-black p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-black mb-2">JoinEazy</h2>
          <p className="text-black font-bold">Create Account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 border border-black text-black text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1.5">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-white border border-black px-4 py-3 text-black focus:outline-none rounded-none placeholder:text-[#666]"
              placeholder="John Doe"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1.5">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full bg-white border border-black px-4 py-3 text-black focus:outline-none rounded-none placeholder:text-[#666]"
              placeholder="name@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-black mb-1.5">Password</label>
            <input 
              required
              type="password" 
              className="w-full bg-white border border-black px-4 py-3 text-black focus:outline-none rounded-none placeholder:text-[#666]"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`cursor-pointer border border-black p-3 flex justify-center text-sm font-bold ${
                formData.role === 'student' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black'
              }`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="student"
                  className="hidden"
                  checked={formData.role === 'student'}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                />
                Student
              </label>
              <label className={`cursor-pointer border border-black p-3 flex justify-center text-sm font-bold ${
                formData.role === 'admin' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black'
              }`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="admin"
                  className="hidden"
                  checked={formData.role === 'admin'}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                />
                Admin
              </label>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white font-bold border border-black hover:bg-white hover:text-black disabled:opacity-70 mt-4"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black">
          Already have an account?{' '}
          <Link to="/login" className="text-black font-bold underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
