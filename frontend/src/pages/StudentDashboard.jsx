import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import GroupCard from '../components/GroupCard';
import TwoStepSubmissionModal from '../components/TwoStepSubmissionModal';
import { Users, BookOpen, CheckCircle, TrendingUp, Clock, ExternalLink } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Mock data
  const stats = [
    { label: 'My Groups', value: '3', icon: <Users size={24} />, trend: null },
    { label: 'Pending Tasks', value: '4', icon: <Clock size={24} />, trend: null },
    { label: 'Completed', value: '12', icon: <CheckCircle size={24} />, trend: null },
    { label: 'Success Rate', value: '85%', icon: <TrendingUp size={24} />, trend: '+2%' },
  ];

  const recentAssignments = [
    { id: 1, title: 'Database Design Document', dueDate: '2023-11-15T23:59', status: 'pending', group: 'CS301 Project', oneDriveUrl: 'https://onedrive.live.com/' },
    { id: 2, title: 'Frontend Architecture', dueDate: '2023-11-20T23:59', status: 'pending', group: 'Web Dev Alpha', oneDriveUrl: 'https://onedrive.live.com/' },
  ];

  const myGroups = [
    { id: 1, name: 'CS301 Project Team', code: 'CS301-A', memberCount: 4 },
    { id: 2, name: 'Web Dev Alpha', code: 'WEB-01', memberCount: 5 },
  ];

  const handleSubmission = (assignmentId) => {
    console.log('Submitted assignment', assignmentId);
    // Refresh data
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Welcome back, {user?.name}</h1>
        <p className="text-black font-bold">Here's an overview of your groups and assignments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Assignments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">Action Required</h2>
            <button className="text-sm text-black font-bold underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentAssignments.map(assignment => (
              <div key={assignment.id} className="bg-white border border-black p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black flex items-center justify-center text-white shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black mb-1">{assignment.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#666] font-bold">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} /> {assignment.group}
                      </span>
                      <span className="w-1 h-1 bg-black"></span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> Due {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button 
                    onClick={() => setSelectedAssignment(assignment)}
                    className="px-4 py-2 bg-black text-white text-sm font-bold border border-black hover:bg-white hover:text-black"
                  >
                    Submit Work
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Content - Groups */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">Your Groups</h2>
          </div>
          
          <div className="space-y-4">
            {myGroups.map(group => (
              <GroupCard key={group.id} group={group} isAdmin={false} />
            ))}
          </div>

          <div className="bg-white border border-black p-6 mt-6 text-center">
            <h3 className="text-lg font-bold text-black mb-4">Overall Progress</h3>
            <div className="text-4xl font-bold text-black">85%</div>
            <p className="text-sm font-bold text-[#666] mt-2">Completion Rate</p>
          </div>
        </div>
      </div>

      <TwoStepSubmissionModal 
        isOpen={!!selectedAssignment} 
        onClose={() => setSelectedAssignment(null)} 
        assignment={selectedAssignment}
        onSubmit={handleSubmission}
      />
    </div>
  );
}
