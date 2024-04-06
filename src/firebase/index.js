import  { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { ref as firebaseRef, getStorage } from 'firebase/storage'
import { getAnalytics } from "firebase/analytics";

const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyAQlSECDQuV0Y3kpjPK2BLfGlm53vNPJ-s",
    authDomain: "hackclt-2024.firebaseapp.com",
    projectId: "hackclt-2024",
    storageBucket: "hackclt-2024.appspot.com",
    messagingSenderId: "892408538923",
    appId: "1:892408538923:web:084a81fc446acde561076e",
    measurementId: "G-64PYGTMRJ7"
};

const app = firebase.initializeApp(firebaseConfig)
const auth = getAuth(app) // User authentication
const db = getFirestore(app) // Database
const analytics = getAnalytics(app); // Analytics

// Storage constants and references
const storage = getStorage(app)

// create references to storage here
// const userRef = firebaseRef(db, 'users')


module.exports = {
    auth,
    db,
    analytics,
    storage
};