import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../Style/GestionEmployes.css';

const GestionEmployes = () => {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: '',
    telephone: ''
  });

  const [feedback, setFeedback] = useState('');
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  // ✅ Corrigé avec useCallback pour éviter l’erreur ESLint sur useEffect
  const fetchEmployes = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/utilisateurs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployes(res.data);
    } catch (err) {
      console.error('❌ Erreur récupération employés :', err);
    }
  }, [token]);

  useEffect(() => {
    fetchEmployes();
  }, [fetchEmployes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setLoading(true);

    try {
      await axios.post('http://localhost:3000/api/utilisateurs', form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFeedback('✅ Employé ajouté avec succès.');
      setForm({ nom: '', prenom: '', email: '', mot_de_passe: '', role: '', telephone: '' });
      fetchEmployes();
    } catch (err) {
      setFeedback('❌ Erreur ajout : ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('❗ Supprimer cet employé ?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/utilisateurs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedback('✅ Employé supprimé.');
      fetchEmployes();
    } catch (err) {
      setFeedback('❌ Erreur suppression : ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="gestion-employes">
      <h2>👤 Ajouter un employé</h2>

      <form className="form-ajout" onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
        <input type="text" name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="mot_de_passe" placeholder="Mot de passe" value={form.mot_de_passe} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="">-- Rôle --</option>
          <option value="maitre_hotel">Maître d’hôtel</option>
          <option value="chef_cuisine">Chef de cuisine</option>
          <option value="responsable_salle">Responsable de salle</option>
          <option value="responsable_avis">Responsable avis</option>
          <option value="responsable_communication">Responsable communication</option>
          <option value="gestionnaire_contenu">Gestionnaire contenu</option>
        </select>
        <input type="tel" name="telephone" placeholder="Téléphone (facultatif)" value={form.telephone} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </form>

      {feedback && <p className="feedback">{feedback}</p>}

      <h2>📋 Liste des employés</h2>
      {employes.length === 0 ? (
        <p>Aucun employé enregistré.</p>
      ) : (
        <ul className="liste-employes">
          {employes.map((emp) => (
            <li key={emp.id_utilisateur}>
              {emp.nom} {emp.prenom} — <strong>{emp.role}</strong> — {emp.email}
              <button className="btn-delete" onClick={() => handleDelete(emp.id_utilisateur)}>🗑</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GestionEmployes;

