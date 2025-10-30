import React, { useEffect, useState } from 'react';
import { FileText, Calendar, Star, User, MapPin } from 'lucide-react';
import api from '../config/api';
import { Visit, Prospect } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VisitWithProspect extends Visit {
  prospect?: Prospect;
}

const Reports: React.FC = () => {
  const [visits, setVisits] = useState<VisitWithProspect[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await api.get('/visits', {
        params: { limit: 50 },
      });
      const visitsData = response.data.data.visits;
      
      // Charger les prospects pour chaque visite
      const visitsWithProspects = await Promise.all(
        visitsData.map(async (visit: Visit) => {
          try {
            const prospectResponse = await api.get(`/prospects/${visit.prospectId}`);
            return {
              ...visit,
              prospect: prospectResponse.data.data.prospect
            };
          } catch (error) {
            console.error(`Error fetching prospect for visit ${visit.id}:`, error);
            return visit;
          }
        })
      );
      
      setVisits(visitsWithProspects);
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreStars = (score?: number) => {
    if (!score) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < score ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapports de visite</h1>
        <p className="text-gray-600">Consultez l'historique de vos visites</p>
      </div>

      {/* Visits List */}
      <div className="space-y-4">
        {visits.map((visit) => (
          <div key={visit.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="text-primary-600" size={20} />
                  <h3 className="text-lg font-bold text-gray-900">
                    Visite #{visit.id.slice(0, 8)}
                  </h3>
                </div>
                
                {/* NOM DU CLIENT/PROSPECT */}
                {visit.prospect && (
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="text-base font-semibold text-primary-600">
                      {visit.prospect.name}
                    </span>
                    {visit.prospect.city && (
                      <span className="text-sm text-gray-500">
                        • {visit.prospect.city}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>
                      {format(new Date(visit.visitedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </span>
                  </div>
                  {visit.durationMinutes && (
                    <span>{visit.durationMinutes} minutes</span>
                  )}
                </div>
              </div>
              {visit.score && getScoreStars(visit.score)}
            </div>

            {visit.objective && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Objectif:</p>
                <p className="text-sm text-gray-600">{visit.objective}</p>
              </div>
            )}

            {visit.summary && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Résumé:</p>
                <p className="text-sm text-gray-600">{visit.summary}</p>
              </div>
            )}

            {visit.signedBy && (
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span>Signé par: {visit.signedBy}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {visits.length === 0 && (
        <div className="text-center py-12 card">
          <p className="text-gray-500">Aucun rapport de visite trouvé</p>
        </div>
      )}
    </div>
  );
};

export default Reports;



