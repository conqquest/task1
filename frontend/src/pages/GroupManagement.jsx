import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GroupCard from '../components/GroupCard';
import { Plus, Search, LogIn } from 'lucide-react';

export default function GroupManagement() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', 'join'

  // Mock data
  const groups = [
    { id: 1, name: 'CS301 Project Team', code: 'CS301-A', memberCount: 4 },
    { id: 2, name: 'Web Dev Alpha', code: 'WEB-01', memberCount: 5 },
    { id: 3, name: 'Data Science Study Group', code: 'DS-22', memberCount: 12 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">{isAdmin ? 'Group Management' : 'My Groups'}</h1>
          <p className="text-black font-bold">View and manage your project groups.</p>
        </div>
        
        {!isAdmin && (
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('join')}
              className={`px-4 py-2 border border-black text-sm font-bold ${activeTab === 'join' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
            >
              <LogIn size={16} className="inline mr-2" /> Join Group
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 border border-black text-sm font-bold ${activeTab === 'create' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
            >
              <Plus size={16} className="inline mr-2" /> Create Group
            </button>
          </div>
        )}
      </div>

      {activeTab === 'list' && (
        <>
          <div className="bg-white border border-black p-2 flex items-center max-w-md">
            <Search className="text-black ml-3 mr-2" size={20} />
            <input 
              type="text"
              placeholder="Search groups..."
              className="bg-transparent border-none text-black focus:outline-none w-full p-2 placeholder:text-[#666]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <GroupCard key={group.id} group={group} isAdmin={isAdmin} />
            ))}
          </div>
        </>
      )}

      {activeTab === 'create' && (
        <div className="bg-white border border-black p-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-black mb-6">Create New Group</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-black mb-2">Group Name</label>
              <input 
                type="text" 
                className="w-full bg-white border border-black px-4 py-3 text-black focus:outline-none"
                placeholder="e.g., Final Project Team"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">Description (Optional)</label>
              <textarea 
                className="w-full bg-white border border-black px-4 py-3 text-black focus:outline-none h-24 resize-none"
                placeholder="What is this group about?"
              ></textarea>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setActiveTab('list')}
                className="flex-1 py-3 border border-black text-black font-bold hover:bg-black hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('list')}
                className="flex-1 py-3 bg-black text-white font-bold border border-black hover:bg-white hover:text-black"
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'join' && (
        <div className="bg-white border border-black p-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-black mb-6">Join a Group</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-black mb-2">Group Code</label>
              <input 
                type="text" 
                className="w-full bg-white border border-black px-4 py-3 text-black focus:outline-none font-mono text-center text-lg tracking-widest uppercase"
                placeholder="XXXX-XXXX"
              />
              <p className="text-xs text-[#666] mt-2 text-center font-bold">Ask your group creator for the join code.</p>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setActiveTab('list')}
                className="flex-1 py-3 border border-black text-black font-bold hover:bg-black hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('list')}
                className="flex-1 py-3 bg-black text-white font-bold border border-black hover:bg-white hover:text-black"
              >
                Join
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
