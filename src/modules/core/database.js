import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  API_ID,
} = process.env;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: API_ID,
  storageBucket: STORAGE_BUCKET
};

// const firebaseConfig = {
//   apiKey: 'AIzaSyA2Quo--oaOOjA-2Z6nUPNVngl3B_XJ_gg',
//   authDomain: 'sac-project-8a3ee.firebaseapp.com',
//   projectId: 'sac-project-8a3ee',
//   messagingSenderId: '610014213264',
//   appId: '1:610014213264:web:03ffa9587a119d5e8cd415',
//   storageBucket: 'sac-project-8a3ee.appspot.com'
// };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export const usersCollectionRef = collection(db, 'users');
export const workersCollectionRef = collection(db, 'workers');
export const statisticsCollectionRef = collection(db, 'statistics');
export const workersPhotoRef = ref(storage, 'workersPhoto');


