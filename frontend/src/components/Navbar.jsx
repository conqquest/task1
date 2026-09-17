import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-black h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-black">JoinEazy</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 border border-black">
          <div className="w-6 h-6 flex items-center justify-center text-black">
            <User size={14} />
          </div>
          <span className="text-sm font-medium text-black">{user?.name || 'User'}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 border border-black text-black hover:bg-black hover:text-white"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
