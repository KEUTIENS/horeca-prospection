import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, UserCheck, UserX, Shield, UserCircle } from 'lucide-react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'rep';
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'rep' as 'admin' | 'manager' | 'rep',
    firstName: '',
    lastName: '',
    phone: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        password: '',
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        role: 'rep',
        firstName: '',
        lastName: '',
        phone: '',
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        // Update user
        await api.put(`/users/${editingUser.id}`, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          role: formData.role,
        });
        setSuccess('Utilisateur modifié avec succès');
      } else {
        // Create user
        await api.post('/users', formData);
        setSuccess('Utilisateur créé avec succès');
      }
      fetchUsers();
      setTimeout(() => handleCloseModal(), 1500);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await api.put(`/users/${userId}`, { isActive: !isActive });
      setSuccess(`Utilisateur ${!isActive ? 'activé' : 'désactivé'} avec succès`);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erreur lors de la modification du statut');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      setSuccess('Utilisateur supprimé avec succès');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erreur lors de la suppression');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      admin: { label: 'Administrateur', className: 'badge-danger' },
      manager: { label: 'Manager', className: 'badge-warning' },
      rep: { label: 'Commercial', className: 'badge-primary' },
    };
    const badge = badges[role] || badges.rep;
    return <span className={`badge ${badge.className}`}>{badge.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield size={64} className="text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Accès réservé aux administrateurs</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérez les comptes des membres de votre équipe</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvel utilisateur
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success mb-6">
          {success}
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserCircle className="text-primary-600" size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        {user.id === currentUser?.id && (
                          <span className="text-xs text-gray-500">(Vous)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <UserCheck size={16} />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <UserX size={16} />
                        Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        className={user.isActive ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'}
                        title={user.isActive ? 'Désactiver' : 'Activer'}
                      >
                        {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </h2>

            {error && (
              <div className="alert alert-error mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Prénom</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                  disabled={!!editingUser}
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="form-input"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                </div>
              )}

              <div>
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="form-select"
                  required
                >
                  <option value="rep">Commercial</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

