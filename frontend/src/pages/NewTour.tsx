import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, X, ArrowLeft, Search } from 'lucide-react';
import api from '../config/api';
import { Prospect } from '../types';

interface SelectedProspect extends Prospect {
  order: number;
}

const NewTour: React.FC = () => {
  const navigate = useNavigate();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [selectedProspects, setSelectedProspects] = useState<SelectedProspect[]>([]);
  const [tourName, setTourName] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    try {
      const response = await api.get('/prospects', {
        params: { limit: 100 },
      });
      // Filtrer localement pour 'to_visit' et 'in_progress'
      const allProspects = response.data.data.prospects || [];
      const filtered = allProspects.filter((p: Prospect) => 
        p.status === 'to_visit' || p.status === 'in_progress'
      );
      setProspects(filtered);
    } catch (error) {
      console.error('Error fetching prospects:', error);
      setError('Erreur lors du chargement des prospects');
    } finally {
      setLoading(false);
    }
  };

  const toggleProspect = (prospect: Prospect) => {
    const isSelected = selectedProspects.find((p) => p.id === prospect.id);
    
    if (isSelected) {
      // Désélectionner
      const filtered = selectedProspects.filter((p) => p.id !== prospect.id);
      const reordered = filtered.map((p, index) => ({ ...p, order: index + 1 }));
      setSelectedProspects(reordered);
    } else {
      // Sélectionner
      setSelectedProspects([
        ...selectedProspects,
        { ...prospect, order: selectedProspects.length + 1 },
      ]);
    }
  };

  const removeProspect = (prospectId: string) => {
    const filtered = selectedProspects.filter((p) => p.id !== prospectId);
    const reordered = filtered.map((p, index) => ({ ...p, order: index + 1 }));
    setSelectedProspects(reordered);
  };

  const isProspectSelected = (prospectId: string) => {
    return selectedProspects.some((p) => p.id === prospectId);
  };

  const moveProspect = (index: number, direction: 'up' | 'down') => {
    const newSelected = [...selectedProspects];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newSelected.length) return;
    
    [newSelected[index], newSelected[newIndex]] = [newSelected[newIndex], newSelected[index]];
    const reordered = newSelected.map((p, i) => ({ ...p, order: i + 1 }));
    setSelectedProspects(reordered);
  };

  // Filtrer les prospects en fonction de la recherche - TOUS LES CHAMPS
  const filteredProspects = prospects.filter((prospect) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      prospect.name.toLowerCase().includes(query) ||
      prospect.city?.toLowerCase().includes(query) ||
      prospect.address?.toLowerCase().includes(query) ||
      prospect.postalCode?.toLowerCase().includes(query) ||
      prospect.managerName?.toLowerCase().includes(query) ||
      prospect.phone?.toLowerCase().includes(query) ||
      prospect.email?.toLowerCase().includes(query) ||
      prospect.website?.toLowerCase().includes(query) ||
      prospect.type?.toLowerCase().includes(query) ||
      prospect.status.toLowerCase().includes(query) ||
      prospect.country.toLowerCase().includes(query)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedProspects.length === 0) {
      setError('Veuillez sélectionner au moins un prospect');
      return;
    }

    if (!tourDate) {
      setError('Veuillez sélectionner une date');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/tours', {
        name: tourName || `Tournée du ${new Date(tourDate).toLocaleDateString('fr-FR')}`,
        date: tourDate,
        prospectIds: selectedProspects.map((p) => p.id),
      });
      navigate('/planning');
    } catch (error: any) {
      console.error('Error creating tour:', error);
      setError(error.response?.data?.message || 'Erreur lors de la création de la tournée');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/planning')}
          className="flex items-center gap-2 text-gray-600 hover-text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Retour au planning
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouvelle tournée</h1>
        <p className="text-gray-600">Planifiez votre prochaine tournée commerciale</p>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg-grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg-col-span-2">
            <div className="card mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de la tournée</h2>
              
              <div className="form-grid">
                <div className="form-grid-full">
                  <label htmlFor="tourName">Nom de la tournée (optionnel)</label>
                  <input
                    type="text"
                    id="tourName"
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                    placeholder="Ex: Tournée Centre-ville Paris"
                  />
                </div>

                <div>
                  <label htmlFor="tourDate">Date de la tournée *</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-gray-400" />
                    <input
                      type="date"
                      id="tourDate"
                      value={tourDate}
                      onChange={(e) => setTourDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Prospects */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Prospects sélectionnés ({selectedProspects.length})
              </h2>

              {selectedProspects.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Aucun prospect sélectionné. Ajoutez des prospects depuis la liste ci-dessous.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProspects.map((prospect, index) => (
                    <div
                      key={prospect.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {prospect.order}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{prospect.name}</h4>
                        <p className="text-sm text-gray-600">
                          {prospect.address}, {prospect.city}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveProspect(index, 'up')}
                          disabled={index === 0}
                          className="btn-icon"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveProspect(index, 'down')}
                          disabled={index === selectedProspects.length - 1}
                          className="btn-icon"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeProspect(prospect.id)}
                          className="btn-icon text-red-600 hover-text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Prospect List */}
          <div>
            <div className="card sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Prospects disponibles
              </h2>
              
              {/* CHAMP DE RECHERCHE */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher dans tous les champs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
                <span>{filteredProspects.length} prospect(s) trouvé(s)</span>
                <span className="font-semibold text-primary-600">{selectedProspects.length} sélectionné(s)</span>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProspects.map((prospect) => {
                  const isSelected = isProspectSelected(prospect.id);
                  return (
                    <div
                      key={prospect.id}
                      onClick={() => toggleProspect(prospect)}
                      className={`p-3 rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary-50 border-2 border-primary-500'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* CHECKBOX */}
                        <div className="flex items-center pt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProspect(prospect)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">
                            {prospect.name}
                          </h4>
                          
                          <div className="text-xs text-gray-600 space-y-1">
                            {prospect.address && (
                              <p className="flex items-center gap-1">
                                <MapPin size={12} className="flex-shrink-0" />
                                <span className="truncate">{prospect.address}</span>
                              </p>
                            )}
                            {prospect.city && (
                              <p>📍 {prospect.city} {prospect.postalCode && `(${prospect.postalCode})`}</p>
                            )}
                            {prospect.phone && (
                              <p>📞 {prospect.phone}</p>
                            )}
                            {prospect.managerName && (
                              <p>👤 {prospect.managerName}</p>
                            )}
                          </div>
                          
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                prospect.status === 'to_visit'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {prospect.status === 'to_visit' ? 'À visiter' : 'En cours'}
                            </span>
                            {prospect.type && (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                                {prospect.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredProspects.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">
                    {searchQuery 
                      ? 'Aucun prospect trouvé pour cette recherche' 
                      : 'Aucun prospect disponible'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/planning')}
            className="btn-secondary"
            disabled={submitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting || selectedProspects.length === 0}
          >
            {submitting ? 'Création...' : 'Créer la tournée'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTour;

