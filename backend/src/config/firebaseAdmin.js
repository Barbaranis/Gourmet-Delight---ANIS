const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../../serviceAccountKey.json');


let app;
if (!getFirestore.apps?.length) {
  app = initializeApp({
    credential: cert(serviceAccount)
  });
}


const firestore = getFirestore(); // ou getFirestore(app) si besoin
module.exports = { firestore };

