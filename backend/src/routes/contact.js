//src/routes/contact.js



const express = require('express');
const router = express.Router();
const db = require('../../firebase'); 


//  Route POST /api/contact

router.post('/', async (req, res) => {
  try {
    const { titre, description, email } = req.body;


    // Vérification des champs requis

    if (!titre || !description || !email) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }


    //  Ajout dans Firestore (avec champ "lu" par défaut à false)
    
    await db.collection('messages_contact').add({
      titre,
      description,
      email,
      createdAt: new Date(),
      lu: false
    });


    res.status(200).json({ message: 'Message bien enregistré dans Firebase.' });
  } catch (err) {
    console.error('❌ Erreur Firebase :', err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement du message.' });
  }
});


module.exports = router;

