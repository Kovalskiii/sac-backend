import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage, ref,  } from "firebase/storage";

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
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: API_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export const usersCollectionRef = collection(db, 'users');
export const workersCollectionRef = collection(db, 'workers');
export const workersPhotoRef = ref(storage, 'workersPhoto');


