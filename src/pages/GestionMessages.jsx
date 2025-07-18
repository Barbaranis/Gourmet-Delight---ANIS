import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseClient';
import '../Style/GestionMessages.css';


const GestionMessages = () => {
  const [messages, setMessages] = useState([]);
  const [reponses, setReponses] = useState({});


  const fetchMessages = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'messages'));
      let data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setMessages(data);
    } catch (err) {
      console.error('Erreur lors du chargement des messages :', err);
    }
  };


  const supprimerMessage = async (id) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du message :', err);
    }
  };


  const envoyerReponse = async (id) => {
    const contenu = reponses[id]?.trim();
    if (!contenu) return alert('La réponse ne peut pas être vide.');
    try {
      await updateDoc(doc(db, 'messages', id), {
        response: contenu,
        respondedAt: new Date()
      });
      setReponses(prev => ({ ...prev, [id]: '' }));
      fetchMessages();
    } catch (err) {
      console.error('Erreur lors de l’envoi de la réponse :', err);
    }
  };


  useEffect(() => {
    fetchMessages();
  }, []);


  return (
    <div className="gestion-messages">
      <h2>📬 Messages reçus</h2>


      {messages.length === 0 ? (
        <p>Aucun message reçu.</p>
      ) : (
        <ul className="message-list">
          {messages.map(({ id, name, email, message, createdAt, response, respondedAt }) => (
            <li key={id} className="message-item">
              <p><strong>{name}</strong> (<a href={`mailto:${email}`}>{email}</a>)</p>
              <p className="message-content">📝 {message}</p>
              <p className="message-date">📅 {createdAt?.toDate().toLocaleString('fr-FR')}</p>


              {response ? (
                <div className="message-response">
                  <p><strong>Réponse de notre équipe :</strong></p>
                  <blockquote>{response}</blockquote>
                  <small>Envoyée le {respondedAt?.toDate().toLocaleString('fr-FR')}</small>
                </div>
              ) : (
                <div className="response-form">
                  <textarea
                    rows="3"
                    placeholder="Écrire une réponse ..."
                    value={reponses[id] || ''}
                    onChange={(e) =>
                      setReponses(prev => ({ ...prev, [id]: e.target.value }))
                    }
                  />
                  <button onClick={() => envoyerReponse(id)}>✉️ Envoyer la réponse</button>
                </div>
              )}


              <button onClick={() => supprimerMessage(id)} className="delete-button">
                🗑️ Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default GestionMessages;

