import React, { useEffect, useState } from 'react';
import { Plus, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { Tour, TourStatus } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Planning: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchTours();
  }, [selectedDate]);

  const fetchTours = async () => {
    try {
      const response = await api.get('/tours', {
        params: { date: selectedDate },
      });
      setTours(response.data.data.tours);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: TourStatus) => {
    const badges = {
      planned: 'badge-warning',
      in_progress: 'badge-primary',
      completed: 'badge-success',
      cancelled: 'badge-danger',
    };
    const labels = {
      planned: 'Planifiée',
      in_progress: 'En cours',
      completed: 'Terminée',
      cancelled: 'Annulée',
    };
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  const startTour = async (tourId: string) => {
    try {
      await api.post(`/tours/${tourId}/start`);
      fetchTours();
    } catch (error) {
      console.error('Error starting tour:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Planning & Tournées</h1>
          <p className="text-gray-600">Planifiez et gérez vos tournées commerciales</p>
        </div>
        <Link to="/planning/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nouvelle tournée
        </Link>
      </div>

      {/* Date Selector */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <CalendarIcon size={20} className="text-gray-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Tours List */}
      <div className="space-y-4">
        {tours.map((tour) => (
          <div key={tour.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {tour.name || `Tournée du ${format(new Date(tour.date), 'dd MMMM yyyy', { locale: fr })}`}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{tour.totalDistanceKm?.toFixed(1) || '0'} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{tour.totalDurationMinutes || '0'} min</span>
                  </div>
                </div>
              </div>
              {getStatusBadge(tour.status)}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/planning/${tour.id}`}
                className="btn-secondary"
              >
                Voir détails
              </Link>
              {tour.status === 'planned' && (
                <button
                  onClick={() => startTour(tour.id)}
                  className="btn-primary"
                >
                  Démarrer la tournée
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {tours.length === 0 && (
        <div className="text-center py-12 card">
          <p className="text-gray-500 mb-4">Aucune tournée planifiée pour cette date</p>
          <Link to="/planning/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={20} />
            Créer une tournée
          </Link>
        </div>
      )}
    </div>
  );
};

export default Planning;



