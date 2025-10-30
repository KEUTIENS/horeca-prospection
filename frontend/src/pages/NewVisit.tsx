import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Star, User, FileText, Upload, X } from 'lucide-react';
import api from '../config/api';
import { Prospect } from '../types';

const NewVisit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    visitedAt: new Date().toISOString().slice(0, 16),
    durationMinutes: '',
    objective: '',
    summary: '',
    score: '',
    signedBy: '',
  });
  
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchProspect();
    }
  }, [id]);

  const fetchProspect = async () => {
    try {
      const response = await api.get(`/prospects/${id}`);
      setProspect(response.data.data);
    } catch (error) {
      console.error('Error fetching prospect:', error);
      setError('Erreur lors du chargement du prospect');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const visitData = {
        prospectId: id,
        visitedAt: new Date(formData.visitedAt).toISOString(),
        durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : undefined,
        objective: formData.objective || undefined,
        summary: formData.summary || undefined,
        score: formData.score ? parseInt(formData.score) : undefined,
        signedBy: formData.signedBy || undefined,
      };

      await api.post('/visits', visitData);
      navigate(`/prospects/${id}`);
    } catch (error: any) {
      console.error('Error creating visit:', error);
      setError(error.response?.data?.message || 'Erreur lors de la création de la visite');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !prospect) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate('/prospects')} className="btn-primary">
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/prospects/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Retour au prospect
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouvelle visite</h1>
        <p className="text-gray-600">
          {prospect?.name} - {prospect?.city}
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Informations de la visite
          </h2>

          <div className="space-y-6">
            {/* Date et heure */}
            <div>
              <label htmlFor="visitedAt" className="form-label flex items-center gap-2">
                <Calendar size={18} />
                Date et heure de la visite *
              </label>
              <input
                type="datetime-local"
                id="visitedAt"
                name="visitedAt"
                value={formData.visitedAt}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Durée */}
            <div>
              <label htmlFor="durationMinutes" className="form-label flex items-center gap-2">
                <Clock size={18} />
                Durée de la visite (minutes)
              </label>
              <input
                type="number"
                id="durationMinutes"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                min="1"
                placeholder="Ex: 45"
                className="form-input"
              />
            </div>

            {/* Objectif */}
            <div>
              <label htmlFor="objective" className="form-label flex items-center gap-2">
                <FileText size={18} />
                Objectif de la visite
              </label>
              <textarea
                id="objective"
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                rows={3}
                placeholder="Quel était l'objectif de cette visite ?"
                className="form-textarea"
              />
            </div>

            {/* Résumé */}
            <div>
              <label htmlFor="summary" className="form-label flex items-center gap-2">
                <FileText size={18} />
                Résumé de la visite
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={5}
                placeholder="Résumez ce qui s'est passé pendant la visite..."
                className="form-textarea"
              />
            </div>

            {/* Note */}
            <div>
              <label htmlFor="score" className="form-label flex items-center gap-2">
                <Star size={18} />
                Note de la visite
              </label>
              <select
                id="score"
                name="score"
                value={formData.score}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Sélectionnez une note</option>
                <option value="1">⭐ 1/5 - Très insatisfaisant</option>
                <option value="2">⭐⭐ 2/5 - Insatisfaisant</option>
                <option value="3">⭐⭐⭐ 3/5 - Moyen</option>
                <option value="4">⭐⭐⭐⭐ 4/5 - Satisfaisant</option>
                <option value="5">⭐⭐⭐⭐⭐ 5/5 - Excellent</option>
              </select>
            </div>

            {/* Photos/Documents */}
            <div>
              <label className="form-label flex items-center gap-2">
                <Upload size={18} />
                Photos / Documents (max 5)
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={handleFileChange}
                  className="form-input"
                  disabled={photos.length >= 5}
                />
                
                {photosPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {photosPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Signé par */}
            <div>
              <label htmlFor="signedBy" className="form-label flex items-center gap-2">
                <User size={18} />
                Signé par (nom du contact)
              </label>
              <input
                type="text"
                id="signedBy"
                name="signedBy"
                value={formData.signedBy}
                onChange={handleChange}
                placeholder="Nom de la personne qui a signé"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(`/prospects/${id}`)}
            className="btn-secondary"
            disabled={submitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer la visite'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewVisit;

