import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MapPin, Phone, Mail, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { Prospect, ProspectStatus, ProspectType } from '../types';

const Prospects: React.FC = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ProspectType | ''>('');
  const [statusFilter, setStatusFilter] = useState<ProspectStatus | ''>('');

  useEffect(() => {
    fetchProspects();
  }, [search, typeFilter, statusFilter]);

  const fetchProspects = async () => {
    try {
      const params: any = { limit: 50 };
      if (search) params.q = search;
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await api.get('/prospects', { params });
      setProspects(response.data.data.prospects);
    } catch (error) {
      console.error('Error fetching prospects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: ProspectStatus) => {
    const badges = {
      to_visit: 'badge-warning',
      in_progress: 'badge-primary',
      converted: 'badge-success',
      lost: 'badge-danger',
    };
    const labels = {
      to_visit: 'À visiter',
      in_progress: 'En cours',
      converted: 'Converti',
      lost: 'Perdu',
    };
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  const getTypeLabel = (type?: ProspectType) => {
    const labels = {
      hotel: 'Hôtel',
      restaurant: 'Restaurant',
      traiteur: 'Traiteur',
      ecole: 'École',
      hopital: 'Hôpital',
      autre: 'Autre',
    };
    return type ? labels[type] : '-';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prospects & Clients</h1>
          <p className="text-gray-600">Gérez votre base de prospects HORECA</p>
        </div>
        <Link to="/prospects/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nouveau prospect
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ProspectType | '')}
            className="input"
          >
            <option value="">Tous les types</option>
            <option value="hotel">Hôtel</option>
            <option value="restaurant">Restaurant</option>
            <option value="traiteur">Traiteur</option>
            <option value="ecole">École</option>
            <option value="hopital">Hôpital</option>
            <option value="autre">Autre</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProspectStatus | '')}
            className="input"
          >
            <option value="">Tous les statuts</option>
            <option value="to_visit">À visiter</option>
            <option value="in_progress">En cours</option>
            <option value="converted">Converti</option>
            <option value="lost">Perdu</option>
          </select>
        </div>
      </div>

      {/* Prospects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {prospects.map((prospect) => (
          <div key={prospect.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{prospect.name}</h3>
                <p className="text-sm text-gray-600">{getTypeLabel(prospect.type)}</p>
              </div>
              {getStatusBadge(prospect.status)}
            </div>

            <div className="space-y-2 mb-4">
              {prospect.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>{prospect.address}, {prospect.city}</span>
                </div>
              )}
              {prospect.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} />
                  <span>{prospect.phone}</span>
                </div>
              )}
              {prospect.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} />
                  <span>{prospect.email}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-500 fill-yellow-500" size={16} />
                  <span className="text-sm font-medium">{prospect.noteAvg.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-600">{prospect.visitsCount} visites</span>
              </div>
              <Link
                to={`/prospects/${prospect.id}`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Voir détails →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {prospects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun prospect trouvé</p>
        </div>
      )}
    </div>
  );
};

export default Prospects;



