import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import '../Style/GestionPlats.css';

const CATEGORIES = [
  { id: 1, nom: 'Entrée' },
  { id: 2, nom: 'Plat' },
  { id: 3, nom: 'Dessert' },
  { id: 4, nom: 'Boisson' },
];

const GestionPlats = () => {
  const [plats, setPlats] = useState([]);
  const [newPlat, setNewPlat] = useState({
    nom: '',
    description: '',
    prix: '',
    id_categorie: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchPlats();
  }, []);

  const fetchPlats = async () => {
    try {
      const response = await api.get('/api/plats');
      setPlats(response.data);
    } catch (error) {
      console.error('❌ Erreur récupération des plats :', error);
    }
  };

  const handleChange = (e) => {
    setNewPlat({ ...newPlat, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleEdit = (plat) => {
    setEditMode(true);
    setEditId(plat.id_plat);
    setNewPlat({
      nom: plat.nom,
      description: plat.description,
      prix: plat.prix,
      id_categorie: plat.id_categorie,
    });
    setImageFile(null);
    setMessage('✏️ Modification du plat en cours...');
  };

  const resetForm = () => {
    setNewPlat({ nom: '', description: '', prix: '', id_categorie: '' });
    setImageFile(null);
    setEditMode(false);
    setEditId(null);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('nom', newPlat.nom);
      formData.append('description', newPlat.description);
      formData.append('prix', Number(newPlat.prix));
      formData.append('id_categorie', Number(newPlat.id_categorie));
      if (imageFile) formData.append('image', imageFile);

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      if (editMode && editId) {
        await api.put(`/api/plats/${editId}`, formData, config);
        setMessage('✅ Plat mis à jour avec succès.');
      } else {
        if (!imageFile) {
          setMessage('❌ L’image est obligatoire.');
          return;
        }
        await api.post('/api/plats', formData, config);
        setMessage('✅ Plat ajouté avec succès.');
      }

      resetForm();
      fetchPlats();
    } catch (error) {
      console.error('❌ Erreur soumission plat :', error);
      setMessage('❌ Une erreur est survenue.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/plats/${id}`);
      setMessage('🗑️ Plat supprimé.');
      fetchPlats();
    } catch (error) {
      console.error('❌ Erreur suppression plat :', error);
      setMessage('❌ Impossible de supprimer le plat.');
    }
  };

  const getCategorieNom = (id) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    return cat ? cat.nom : 'Inconnue';
  };

  if (role !== 'admin' && role !== 'chef_cuisine') {
    return <p className="forbidden">⛔ Accès interdit.</p>;
  }

  return (
    <div className="gestion-plats">
      <h2>🍽️ Gérer les Plats</h2>

      <form onSubmit={handleSubmit} className="form-plat" encType="multipart/form-data">
        <input name="nom" placeholder="Nom" value={newPlat.nom} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={newPlat.description} onChange={handleChange} />
        <input name="prix" placeholder="Prix (€)" value={newPlat.prix} onChange={handleChange} type="number" step="0.01" required />

        {editMode && editId && (
          <div className="current-image-preview">
            <p>Image actuelle :</p>
            <img
              src={`/uploads/${plats.find(p => p.id_plat === editId)?.image_url}`}
              alt={`Aperçu actuel de ${newPlat.nom || 'ce plat'}`}
              className="miniature-image"
            />
          </div>
        )}

        <input type="file" accept="image/*" onChange={handleFileChange} />

        {imageFile && (
          <div className="preview-image">
            <p>Nouvelle image sélectionnée :</p>
            <img
              src={URL.createObjectURL(imageFile)}
              alt={`Aperçu de ${newPlat.nom || 'la nouvelle image'}`}
              className="miniature-image"
            />
          </div>
        )}

        <select name="id_categorie" value={newPlat.id_categorie} onChange={handleChange} required>
          <option value="">-- Sélectionner une catégorie --</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nom}</option>
          ))}
        </select>

        <button type="submit">{editMode ? 'Mettre à jour' : 'Ajouter le plat'}</button>
        {editMode && <button type="button" onClick={resetForm}>Annuler</button>}
      </form>

      {message && <p className="message">{message}</p>}

      <ul className="liste-plats">
        {plats.map((plat) => (
          <li key={plat.id_plat} className="plat-item">
            <img
             src={`http://localhost:3000/uploads/${plat.image_url}`}




              alt={plat.nom}
              className="plat-image"
            />
            <div>
              <strong>{plat.nom}</strong> – {plat.prix} €<br />
              <em>{getCategorieNom(plat.id_categorie)}</em>
              <p>{plat.description}</p>
            </div>
            <button onClick={() => handleEdit(plat)} className="edit-btn">Modifier</button>
            <button onClick={() => handleDelete(plat.id_plat)} className="delete-btn">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionPlats;

