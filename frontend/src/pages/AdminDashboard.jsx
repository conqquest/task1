import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { Users, Folder, CheckCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Mock data
  const stats = [
    { label: 'Total Students', value: '1,248', icon: <Users size={24} />, trend: '+12 this week' },
    { label: 'Active Groups', value: '156', icon: <Folder size={24} />, trend: '+3 this week' },
    { label: 'Assignments', value: '42', icon: <CheckCircle size={24} />, trend: 'Active' },
    { label: 'Submission Rate', value: '89%', icon: <BarChart2 size={24} />, trend: '+5% vs last week' },
  ];

  const barData = [
    { name: 'CS101', submitted: 45, pending: 15 },
    { name: 'CS201', submitted: 30, pending: 20 },
    { name: 'CS301', submitted: 55, pending: 5 },
    { name: 'CS401', submitted: 25, pending: 10 },
  ];

  const pieData = [
    { name: 'Submitted', value: 400 },
    { name: 'Pending', value: 100 },
    { name: 'Late', value: 50 },
  ];
  const COLORS = ['#000000', '#666666', '#cccccc'];

  const recentActivity = [
    { id: 1, text: 'Group "Web Dev Alpha" created by John Doe', time: '2 hours ago' },
    { id: 2, text: 'Assignment "React Basics" due in 24 hours', time: '4 hours ago' },
    { id: 3, text: 'Jane Smith submitted "Database Schema"', time: '5 hours ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Admin Overview</h1>
        <p className="text-[#666] font-bold">System analytics and management dashboard.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white border border-black p-6">
          <h2 className="text-lg font-bold text-black mb-6">Submissions by Course</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="name" stroke="#000" tick={{ fill: '#000' }} axisLine={true} tickLine={true} />
                <YAxis stroke="#000" tick={{ fill: '#000' }} axisLine={true} tickLine={true} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#000', borderRadius: '0', color: '#000' }}
                />
                <Bar dataKey="submitted" stackId="a" fill="#000" />
                <Bar dataKey="pending" stackId="a" fill="#666" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-black p-6 flex flex-col">
          <h2 className="text-lg font-bold text-black mb-2">Overall Status</h2>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#000', borderRadius: '0', color: '#000' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm text-black font-bold">
                <span className="w-3 h-3 border border-black" style={{ backgroundColor: COLORS[index] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white border border-black p-6">
        <h2 className="text-lg font-bold text-black mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-white border border-black">
              <div className="w-2 h-2 mt-2 bg-black border border-black"></div>
              <div>
                <p className="text-black font-bold">{activity.text}</p>
                <p className="text-xs text-[#666] mt-1 font-bold">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
