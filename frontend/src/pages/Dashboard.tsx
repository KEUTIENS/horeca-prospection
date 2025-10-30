import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, MapPin, Star } from 'lucide-react';
import api from '../config/api';
import { Stats } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats/overview');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de vos activités de prospection</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Visites totales</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalVisits || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <MapPin className="text-primary-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-success flex items-center gap-1">
            <TrendingUp size={16} />
            +12% ce mois
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Note moyenne</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.avgScore?.toFixed(1) || '0.0'}/5
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-600">Satisfaction clients</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Taux de conversion</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.conversionRate?.toFixed(1) || '0'}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-success">+5% vs mois dernier</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Prospects actifs</p>
              <p className="text-3xl font-bold text-gray-900">45</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-600">En cours de prospection</p>
        </div>
      </div>

      {/* Top Prospects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Prospects</h2>
          <div className="space-y-3">
            {stats?.topProspects && stats.topProspects.length > 0 ? (
              stats.topProspects.slice(0, 5).map((prospect) => (
                <div key={prospect.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{prospect.name}</p>
                    <p className="text-sm text-gray-600">{prospect.visitsCount || 0} visites</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-500 fill-yellow-500" size={16} />
                    <span className="font-medium">{prospect.noteAvg ? prospect.noteAvg.toFixed(1) : '0.0'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun prospect avec des visites</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Activité récente</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Nouvelle visite enregistrée</p>
                <p className="text-sm text-gray-600">Hôtel Le Grand Paris - Il y a 2h</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Prospect ajouté</p>
                <p className="text-sm text-gray-600">Restaurant La Bonne Table - Il y a 5h</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Tournée planifiée</p>
                <p className="text-sm text-gray-600">Paris 15ème - 5 prospects - Demain 9h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



