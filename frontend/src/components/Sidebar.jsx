import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, BarChart } from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/groups', icon: <Users size={20} />, label: isAdmin ? 'All Groups' : 'My Groups' },
    { to: '/assignments', icon: <FileText size={20} />, label: 'Assignments' },
  ];

  if (isAdmin) {
    links.push({ to: '/analytics', icon: <BarChart size={20} />, label: 'Analytics' });
  }

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-black hidden md:flex flex-col p-4 z-40">
      <div className="flex flex-col gap-2 mt-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 border border-transparent font-medium ${
                isActive 
                  ? 'bg-black text-white' 
                  : 'text-black hover:border-black'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
