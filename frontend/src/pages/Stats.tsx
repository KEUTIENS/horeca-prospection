import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users as UsersIcon, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../config/api';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [conversions, setConversions] = useState<any>(null);
  const [userStats, setUserStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const [statsRes, conversionsRes, usersRes] = await Promise.all([
        api.get('/stats/overview'),
        api.get('/stats/conversions'),
        api.get('/stats/by-user'),
      ]);

      setStats(statsRes.data.data);
      setConversions(conversionsRes.data.data.conversions);
      setUserStats(usersRes.data.data.userStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques & Analyses</h1>
        <p className="text-gray-600">Analysez vos performances commerciales</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-primary-600" size={24} />
            <p className="text-sm text-gray-600">Visites totales</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalVisits || 0}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-green-600" size={24} />
            <p className="text-sm text-gray-600">Taux de conversion</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.conversionRate?.toFixed(1) || 0}%
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-yellow-600" size={24} />
            <p className="text-sm text-gray-600">Note moyenne</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.avgScore?.toFixed(1) || 0}/5
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <UsersIcon className="text-purple-600" size={24} />
            <p className="text-sm text-gray-600">Représentants</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{userStats.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Visits by Week */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Visites par semaine</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.weeklyVisits || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversions Pie Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Répartition des statuts</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={conversions || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status }: any) => String(status)}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {conversions?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Performance */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Performance par représentant</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Nom</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Visites</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Note moy.</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map((user: any) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-center font-medium">
                    {user.total_visits}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {user.avg_score ? parseFloat(user.avg_score).toFixed(1) : '-'}/5
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stats;

