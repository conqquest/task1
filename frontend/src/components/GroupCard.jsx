import { Copy, Users, Settings } from 'lucide-react';

export default function GroupCard({ group, isAdmin }) {
  const copyCode = () => {
    navigator.clipboard.writeText(group.code);
  };

  return (
    <div className="bg-white border border-black p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-black mb-1">{group.name}</h3>
          <div className="flex items-center gap-2 text-sm text-[#666]">
            <span className="font-mono text-black">
              {group.code}
            </span>
            <button 
              onClick={copyCode}
              className="text-black hover:underline"
              title="Copy Code"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
        {isAdmin && (
          <button className="p-2 border border-black text-black hover:bg-black hover:text-white">
            <Settings size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-black">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 bg-white border border-black flex items-center justify-center text-xs font-medium text-black">
              U{i}
            </div>
          ))}
          {group.memberCount > 3 && (
            <div className="w-8 h-8 bg-white border border-black flex items-center justify-center text-xs font-medium text-black">
              +{group.memberCount - 3}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-black">
          <Users size={14} />
          <span>{group.memberCount || 0} Members</span>
        </div>
      </div>
    </div>
  );
}
