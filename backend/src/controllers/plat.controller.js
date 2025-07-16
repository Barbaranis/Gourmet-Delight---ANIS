const db = require('../models');
const Plat = db.Plat;
const Categorie = db.Categorie;


// ✅ Créer un plat avec image uploadée
exports.createPlat = async (req, res) => {
  try {
    console.log("📦 Données reçues :", req.body);
    console.log("📷 Fichier image :", req.file);


    const { nom, description, prix, id_categorie } = req.body;


    // Vérifications de base
    if (!nom || !prix || !id_categorie || !req.file) {
      return res.status(400).json({ message: "Tous les champs sont requis, y compris l'image." });
    }


    const prixFloat = parseFloat(prix);
    const categorieId = parseInt(id_categorie);


    if (isNaN(prixFloat) || isNaN(categorieId)) {
      return res.status(400).json({ message: "Le prix et la catégorie doivent être des nombres valides." });
    }


    // Vérification que la catégorie existe
    const categorieExiste = await Categorie.findByPk(categorieId);
    if (!categorieExiste) {
      return res.status(400).json({ message: "La catégorie sélectionnée n'existe pas." });
    }


    // Chemin de l’image (assure-toi que le dossier uploads est servi statiquement dans server.js)
    const image_url = req.file.filename;






    const plat = await Plat.create({
      nom,
      description,
      prix: prixFloat,
      image_url,
      id_categorie: categorieId
    });


    console.log("✅ Plat créé :", plat);
    res.status(201).json(plat);
  } catch (err) {
    console.error("❌ Erreur création plat :", err);
    res.status(500).json({ message: "Erreur création plat", error: err.message });
  }
};


// ✅ Lire tous les plats
exports.getAllPlats = async (req, res) => {
  try {
    const plats = await Plat.findAll();
    res.status(200).json(plats);
  } catch (err) {
    console.error("❌ Erreur récupération plats :", err);
    res.status(500).json({ message: "Erreur récupération plats", error: err.message });
  }
};


// ✅ Mettre à jour un plat
exports.updatePlat = async (req, res) => {
  try {
    const { id } = req.params;


    const [updated] = await Plat.update(req.body, { where: { id_plat: id } });


    if (updated === 0) {
      return res.status(404).json({ message: "Aucun plat trouvé avec cet ID." });
    }


    res.status(200).json({ message: "Plat mis à jour avec succès." });
  } catch (err) {
    console.error("❌ Erreur mise à jour plat :", err);
    res.status(500).json({ message: "Erreur mise à jour plat", error: err.message });
  }
};


// ✅ Supprimer un plat
exports.deletePlat = async (req, res) => {
  try {
    const { id } = req.params;


    const deleted = await Plat.destroy({ where: { id_plat: id } });


    if (deleted === 0) {
      return res.status(404).json({ message: "Aucun plat trouvé à supprimer." });
    }


    res.status(200).json({ message: "Plat supprimé avec succès." });
  } catch (err) {
    console.error("❌ Erreur suppression plat :", err);
    res.status(500).json({ message: "Erreur suppression plat", error: err.message });
  }
};

