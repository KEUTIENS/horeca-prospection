import React, { useState } from 'react';
import { MapPin, Filter } from 'lucide-react';
import ProspectsMap from '../components/Map/ProspectsMap';
import { ProspectType, ProspectStatus } from '../types';

const MapView: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<ProspectType | ''>('');
  const [statusFilter, setStatusFilter] = useState<ProspectStatus | ''>('');
  const [cityFilter, setCityFilter] = useState('');

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="text-primary-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Carte des prospects</h1>
        </div>
        <p className="text-gray-600">Visualisez tous vos prospects sur une carte interactive</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
            <input
              type="text"
              placeholder="Filtrer par ville..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
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
      </div>

      {/* Map */}
      <div className="card">
        <ProspectsMap
          city={cityFilter}
          type={typeFilter}
          status={statusFilter}
          height="calc(100vh - 400px)"
        />
      </div>

      {/* Legend */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Légende</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-success"></div>
            <span className="text-sm text-gray-700">Converti</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary-600"></div>
            <span className="text-sm text-gray-700">En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-warning"></div>
            <span className="text-sm text-gray-700">À visiter</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-error"></div>
            <span className="text-sm text-gray-700">Perdu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;



