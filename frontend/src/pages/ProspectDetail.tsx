import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  Calendar,
  Clock,
  Star,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import api from '../config/api';
import { Prospect } from '../types';

interface Visit {
  id: string;
  visitedAt: string;
  durationMinutes?: number;
  objective?: string;
  summary?: string;
  score?: number;
  signedBy?: string;
  userName?: string;
}

const ProspectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProspectDetails();
      fetchVisits();
    }
  }, [id]);

  const fetchProspectDetails = async () => {
    try {
      const response = await api.get(`/prospects/${id}`);
      setProspect(response.data.data);
    } catch (error: any) {
      console.error('Error fetching prospect:', error);
      setError('Erreur lors du chargement du prospect');
    } finally {
      setLoading(false);
    }
  };

  const fetchVisits = async () => {
    try {
      const response = await api.get(`/prospects/${id}/visits`);
      setVisits(response.data.data || []);
    } catch (error) {
      console.error('Error fetching visits:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) {
      return;
    }

    try {
      await api.delete(`/prospects/${id}`);
      navigate('/prospects');
    } catch (error: any) {
      console.error('Error deleting prospect:', error);
      alert('Erreur lors de la suppression du prospect');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      to_visit: { label: 'À visiter', className: 'status-to_visit' },
      in_progress: { label: 'En cours', className: 'status-in_progress' },
      converted: { label: 'Converti', className: 'status-converted' },
      lost: { label: 'Perdu', className: 'status-lost' },
    };
    const badge = badges[status] || badges.to_visit;
    return <span className={`badge ${badge.className}`}>{badge.label}</span>;
  };

  const getTypeBadge = (type?: string) => {
    if (!type) return null;
    const labels: Record<string, string> = {
      hotel: 'Hôtel',
      restaurant: 'Restaurant',
      traiteur: 'Traiteur',
      ecole: 'École',
      hopital: 'Hôpital',
      autre: 'Autre',
    };
    return (
      <span className="badge badge-secondary">
        {labels[type] || type}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !prospect) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Prospect introuvable'}</p>
        <button onClick={() => navigate('/prospects')} className="btn-primary">
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/prospects')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Retour à la liste
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {prospect.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              {getStatusBadge(prospect.status)}
              {getTypeBadge(prospect.type)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/prospects/${id}/edit`)}
              className="btn-secondary flex items-center gap-2"
            >
              <Edit size={18} />
              Modifier
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger flex items-center gap-2"
            >
              <Trash2 size={18} />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informations générales
            </h2>

            <div className="space-y-4">
              {prospect.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{prospect.address}</p>
                    <p className="text-gray-600">
                      {prospect.postalCode} {prospect.city}, {prospect.country}
                    </p>
                  </div>
                </div>
              )}

              {prospect.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-gray-400" />
                  <a
                    href={`tel:${prospect.phone}`}
                    className="text-gray-900 hover:text-primary-600"
                  >
                    {prospect.phone}
                  </a>
                </div>
              )}

              {prospect.email && (
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-400" />
                  <a
                    href={`mailto:${prospect.email}`}
                    className="text-gray-900 hover:text-primary-600"
                  >
                    {prospect.email}
                  </a>
                </div>
              )}

              {prospect.website && (
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-gray-400" />
                  <a
                    href={prospect.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:text-primary-600"
                  >
                    {prospect.website}
                  </a>
                </div>
              )}

              {prospect.managerName && (
                <div className="flex items-center gap-3">
                  <User size={20} className="text-gray-400" />
                  <p className="text-gray-900">{prospect.managerName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Historique des visites */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Historique des visites ({visits.length})
              </h2>
              <button
                onClick={() => navigate(`/prospects/${id}/new-visit`)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Nouvelle visite
              </button>
            </div>

            {visits.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Calendar size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Aucune visite enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {new Date(visit.visitedAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {visit.score !== undefined && (
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-gray-900">
                            {visit.score}/5
                          </span>
                        </div>
                      )}
                    </div>

                    {visit.objective && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Objectif :</p>
                        <p className="text-sm text-gray-600">{visit.objective}</p>
                      </div>
                    )}

                    {visit.summary && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Résumé :</p>
                        <p className="text-sm text-gray-600">{visit.summary}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      {visit.durationMinutes && (
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{visit.durationMinutes} min</span>
                        </div>
                      )}
                      {visit.signedBy && (
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>Signé par : {visit.signedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Statistiques</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Note moyenne</p>
                <div className="flex items-center gap-2">
                  <Star
                    size={20}
                    className={`${
                      prospect.noteAvg > 0
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                  <span className="text-2xl font-bold text-gray-900">
                    {prospect.noteAvg > 0 ? prospect.noteAvg.toFixed(1) : '-'}
                  </span>
                  <span className="text-gray-500">/5</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Nombre de visites</p>
                <p className="text-2xl font-bold text-gray-900">
                  {prospect.visitsCount}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Statut</p>
                {getStatusBadge(prospect.status)}
              </div>
            </div>
          </div>

          {/* Carte */}
          {prospect.latitude && prospect.longitude && (
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Localisation
              </h3>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm">Carte Google Maps</p>
                {/* Intégrer Google Maps ici si besoin */}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informations</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Créé le</p>
                <p className="text-gray-900 font-medium">
                  {new Date(prospect.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <p className="text-gray-600">Dernière mise à jour</p>
                <p className="text-gray-900 font-medium">
                  {new Date(prospect.updatedAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetail;

