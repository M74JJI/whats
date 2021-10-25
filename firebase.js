import firebase from 'firebase';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBAm9lKmxTEnNQPvsaMa5Jn2B0ML2WsV0k',
    authDomain: 'whatsapp-3ab72.firebaseapp.com',
    projectId: 'whatsapp-3ab72',
    storageBucket: 'whatsapp-3ab72.appspot.com',
    messagingSenderId: '675364307431',
    appId: '1:675364307431:web:3abdfe533b86ccf1d5bd42',
};

// Initialize Firebase
const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const storage = app.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, db, storage, provider };
