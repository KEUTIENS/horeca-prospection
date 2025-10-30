import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../config/api';
import { Prospect, ProspectType, ProspectStatus } from '../types';

const EditProspect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: '' as ProspectType | '',
    address: '',
    postalCode: '',
    city: '',
    country: 'France',
    phone: '',
    email: '',
    website: '',
    managerName: '',
    status: 'to_visit' as ProspectStatus,
  });

  useEffect(() => {
    if (id) {
      fetchProspect();
    }
  }, [id]);

  const fetchProspect = async () => {
    try {
      const response = await api.get(`/prospects/${id}`);
      const prospect: Prospect = response.data.data;
      
      setFormData({
        name: prospect.name || '',
        type: prospect.type || '',
        address: prospect.address || '',
        postalCode: prospect.postalCode || '',
        city: prospect.city || '',
        country: prospect.country || 'France',
        phone: prospect.phone || '',
        email: prospect.email || '',
        website: prospect.website || '',
        managerName: prospect.managerName || '',
        status: prospect.status,
      });
    } catch (error) {
      console.error('Error fetching prospect:', error);
      setError('Erreur lors du chargement du prospect');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      await api.put(`/prospects/${id}`, formData);
      navigate(`/prospects/${id}`);
    } catch (error: any) {
      console.error('Error updating prospect:', error);
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour du prospect');
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modifier le prospect</h1>
        <p className="text-gray-600">Mettez à jour les informations du prospect</p>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Informations générales */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Informations générales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="form-label">
                Nom de l'établissement *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex: Le Gourmet Parisien"
                className="form-input"
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="form-label">
                Type d'établissement
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Sélectionnez un type</option>
                <option value="hotel">Hôtel</option>
                <option value="restaurant">Restaurant</option>
                <option value="traiteur">Traiteur</option>
                <option value="ecole">École</option>
                <option value="hopital">Hôpital</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Statut */}
            <div>
              <label htmlFor="status" className="form-label">
                Statut *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="to_visit">À visiter</option>
                <option value="in_progress">En cours</option>
                <option value="converted">Converti</option>
                <option value="lost">Perdu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Adresse</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Adresse */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="form-label">
                Adresse
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ex: 12 Rue de la Paix"
                className="form-input"
              />
            </div>

            {/* Code postal */}
            <div>
              <label htmlFor="postalCode" className="form-label">
                Code postal
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Ex: 75001"
                className="form-input"
              />
            </div>

            {/* Ville */}
            <div>
              <label htmlFor="city" className="form-label">
                Ville
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ex: Paris"
                className="form-input"
              />
            </div>

            {/* Pays */}
            <div className="md:col-span-2">
              <label htmlFor="country" className="form-label">
                Pays
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Ex: France"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Contact</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manager */}
            <div className="md:col-span-2">
              <label htmlFor="managerName" className="form-label">
                Nom du responsable
              </label>
              <input
                type="text"
                id="managerName"
                name="managerName"
                value={formData.managerName}
                onChange={handleChange}
                placeholder="Ex: Jean Dupont"
                className="form-input"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="form-label">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ex: 01 23 45 67 89"
                className="form-input"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: contact@restaurant.fr"
                className="form-input"
              />
            </div>

            {/* Site web */}
            <div className="md:col-span-2">
              <label htmlFor="website" className="form-label">
                Site web
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Ex: https://www.restaurant.fr"
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
            className="btn-primary flex items-center gap-2"
            disabled={submitting}
          >
            <Save size={18} />
            {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProspect;

