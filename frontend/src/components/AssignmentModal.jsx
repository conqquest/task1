import { useState } from 'react';
import { X } from 'lucide-react';

export default function AssignmentModal({ isOpen, onClose, onSave, groups = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    oneDriveUrl: '',
    targetType: 'all',
    selectedGroups: []
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleGroupToggle = (groupId) => {
    setFormData(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(groupId)
        ? prev.selectedGroups.filter(id => id !== groupId)
        : [...prev.selectedGroups, groupId]
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white border border-black rounded-none w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-black">
          <h2 className="text-xl font-bold text-black">Create New Assignment</h2>
          <button onClick={onClose} className="text-black hover:bg-black hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-black mb-1">Title</label>
            <input 
              required
              type="text" 
              className="w-full bg-white border border-black rounded-none px-4 py-2 text-black focus:outline-none"
              placeholder="e.g., Final Project Submission"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-black mb-1">Description</label>
            <textarea 
              className="w-full bg-white border border-black rounded-none px-4 py-2 text-black focus:outline-none h-24 resize-none"
              placeholder="Brief instructions..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-black mb-1">Due Date</label>
              <input 
                required
                type="datetime-local" 
                className="w-full bg-white border border-black rounded-none px-4 py-2 text-black focus:outline-none"
                value={formData.dueDate}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">OneDrive Target URL</label>
              <input 
                required
                type="url" 
                className="w-full bg-white border border-black rounded-none px-4 py-2 text-black focus:outline-none"
                placeholder="https://1drv.ms/..."
                value={formData.oneDriveUrl}
                onChange={e => setFormData({...formData, oneDriveUrl: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">Assign To</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="targetType" 
                  value="all"
                  checked={formData.targetType === 'all'}
                  onChange={() => setFormData({...formData, targetType: 'all'})}
                  className="accent-black"
                />
                <span className="text-sm text-black">All Groups</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="targetType" 
                  value="specific"
                  checked={formData.targetType === 'specific'}
                  onChange={() => setFormData({...formData, targetType: 'specific'})}
                  className="accent-black"
                />
                <span className="text-sm text-black">Specific Groups</span>
              </label>
            </div>
            
            {formData.targetType === 'specific' && (
              <div className="bg-white border border-black p-3 max-h-32 overflow-y-auto space-y-2">
                {groups.map(group => (
                  <label key={group.id} className="flex items-center gap-3 cursor-pointer p-1">
                    <input 
                      type="checkbox"
                      checked={formData.selectedGroups.includes(group.id)}
                      onChange={() => handleGroupToggle(group.id)}
                      className="accent-black"
                    />
                    <span className="text-sm text-black">{group.name}</span>
                  </label>
                ))}
                {groups.length === 0 && (
                  <div className="text-sm text-[#666] text-center py-2">No groups available</div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2 border border-black text-black hover:bg-black hover:text-white"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-black text-white border border-black hover:bg-white hover:text-black"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
