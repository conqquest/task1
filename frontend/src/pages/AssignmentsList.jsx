import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AssignmentModal from '../components/AssignmentModal';
import { Plus, Search, Filter, Calendar, Users, ExternalLink } from 'lucide-react';

export default function AssignmentsList() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data
  const assignments = [
    { id: 1, title: 'Database Design Document', description: 'Create a full ERD and schema script.', dueDate: '2023-11-15T23:59', status: 'pending', group: 'CS301 Project', targetType: 'specific' },
    { id: 2, title: 'Frontend Architecture', description: 'Setup React, Tailwind, and routing.', dueDate: '2023-11-20T23:59', status: 'submitted', group: 'Web Dev Alpha', targetType: 'specific' },
    { id: 3, title: 'Final Presentation Slides', description: 'Draft for the final demo.', dueDate: '2023-12-05T23:59', status: 'late', group: 'All Groups', targetType: 'all' },
  ];

  const groups = [
    { id: '1', name: 'CS301 Project' },
    { id: '2', name: 'Web Dev Alpha' }
  ];

  const handleCreate = (data) => {
    console.log('New assignment:', data);
    // Add to list
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Assignments</h1>
          <p className="text-black font-bold">Manage and track course assignments.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 border border-black text-sm font-bold text-white bg-black hover:bg-white hover:text-black flex items-center gap-2"
          >
            <Plus size={18} /> Create Assignment
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-black p-3 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1 flex items-center border border-black px-3 py-1">
          <Search className="text-black mr-2" size={18} />
          <input 
            type="text"
            placeholder="Search assignments..."
            className="bg-transparent border-none text-sm text-black focus:outline-none w-full py-1 placeholder:text-[#666]"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-black bg-white text-black text-sm hover:bg-black hover:text-white flex items-center gap-2 font-bold">
            <Filter size={16} /> Status
          </button>
          <button className="px-3 py-2 border border-black bg-white text-black text-sm hover:bg-black hover:text-white flex items-center gap-2 font-bold">
            <Calendar size={16} /> Due Date
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {assignments.map(assignment => (
          <div key={assignment.id} className="bg-white border border-black p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-black">{assignment.title}</h3>
                {!isAdmin && (
                  <span className="text-xs font-bold px-2 py-0.5 border border-black text-black capitalize">
                    {assignment.status}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#666] mb-4 font-bold">{assignment.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-black font-bold">
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-black" />
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={16} className="text-black" />
                  {assignment.targetType === 'all' ? 'All Groups' : assignment.group}
                </div>
              </div>
            </div>
            
            <div className="flex items-center md:items-start md:justify-end gap-3 min-w-[200px]">
              {isAdmin ? (
                <div className="flex flex-col items-end gap-2 w-full">
                  <div className="flex items-center justify-between w-full text-sm font-bold">
                    <span className="text-black">Completion</span>
                    <span className="text-black">12/15</span>
                  </div>
                  <div className="w-full bg-white border border-black h-3">
                    <div className="bg-black h-full" style={{ width: '80%' }}></div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="text-xs font-bold text-black underline">Edit</button>
                    <button className="text-xs font-bold text-black underline">Delete</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <a 
                    href="#" 
                    className="w-full px-4 py-2 bg-white border border-black text-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white"
                  >
                    Open OneDrive <ExternalLink size={14} />
                  </a>
                  {assignment.status !== 'submitted' && (
                    <button className="w-full px-4 py-2 bg-black text-white border border-black text-sm font-bold hover:bg-white hover:text-black">
                      Submit Work
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <AssignmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreate}
        groups={groups}
      />
    </div>
  );
}
