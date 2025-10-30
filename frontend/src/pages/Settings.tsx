import React, { useState } from 'react';
import { User, Lock, Bell, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Profile form
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateUser({ firstName, lastName, phone });
      setMessage('Profil mis à jour avec succès');
    } catch (error) {
      setMessage('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setMessage('Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage('Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'password', label: 'Mot de passe', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Préférences', icon: Globe },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">Gérez votre compte et vos préférences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('succès') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message}
              </div>
            )}

            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile}>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Informations personnelles</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="input bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword}>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Changer le mot de passe</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input"
                      required
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Modification...' : 'Changer le mot de passe'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-semibold text-gray-900">Notifications par email</h3>
                      <p className="text-sm text-gray-600">Recevoir des emails pour les activités importantes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-semibold text-gray-900">Nouvelles visites</h3>
                      <p className="text-sm text-gray-600">Notification lors de l'ajout d'une nouvelle visite</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-semibold text-gray-900">Tournées planifiées</h3>
                      <p className="text-sm text-gray-600">Rappel 1h avant une tournée planifiée</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-semibold text-gray-900">Rapports hebdomadaires</h3>
                      <p className="text-sm text-gray-600">Recevoir un résumé hebdomadaire de votre activité</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Mises à jour de l'application</h3>
                      <p className="text-sm text-gray-600">Notifications sur les nouvelles fonctionnalités</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <button className="btn-primary mt-4">
                    Enregistrer les préférences
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Préférences générales</h2>
                
                <div className="space-y-6">
                  {/* Langue */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue de l'interface
                    </label>
                    <select className="form-select">
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  {/* Fuseau horaire */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuseau horaire
                    </label>
                    <select className="form-select">
                      <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                      <option value="Europe/London">Europe/London (UTC+0)</option>
                      <option value="America/New_York">America/New York (UTC-5)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                    </select>
                  </div>

                  {/* Format de date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format de date
                    </label>
                    <select className="form-select">
                      <option value="DD/MM/YYYY">JJ/MM/AAAA (31/12/2025)</option>
                      <option value="MM/DD/YYYY">MM/JJ/AAAA (12/31/2025)</option>
                      <option value="YYYY-MM-DD">AAAA-MM-JJ (2025-12-31)</option>
                    </select>
                  </div>

                  {/* Unité de distance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unité de distance
                    </label>
                    <select className="form-select">
                      <option value="km">Kilomètres (km)</option>
                      <option value="mi">Miles (mi)</option>
                    </select>
                  </div>

                  {/* Devise */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Devise par défaut
                    </label>
                    <select className="form-select">
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar américain ($)</option>
                      <option value="GBP">Livre sterling (£)</option>
                      <option value="CHF">Franc suisse (CHF)</option>
                    </select>
                  </div>

                  {/* Thème */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thème de l'interface
                    </label>
                    <select className="form-select">
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="auto">Automatique (selon le système)</option>
                    </select>
                  </div>

                  {/* Page de démarrage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page de démarrage
                    </label>
                    <select className="form-select">
                      <option value="/dashboard">Tableau de bord</option>
                      <option value="/prospects">Prospects</option>
                      <option value="/planning">Planning</option>
                      <option value="/map">Carte</option>
                    </select>
                  </div>

                  <button className="btn-primary mt-4">
                    Enregistrer les préférences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;



