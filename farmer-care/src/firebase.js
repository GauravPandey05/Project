import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

enableIndexedDbPersistence(db)
  .then(() => console.log("Offline mode enabled"))
  .catch((err) => console.error("Failed to enable offline persistence:", err));

auth.settings.appVerificationDisabledForTesting = true; // ✅ Add this line to disable reCAPTCHA in dev mode

const setUpRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response) => console.log("reCAPTCHA solved!", response),
      "expired-callback": () => console.log("reCAPTCHA expired. Please try again."),
    });
    window.recaptchaVerifier.render();
  }
};

export { auth, db, signInWithPhoneNumber, setUpRecaptcha };
export { collection, addDoc, getDoc, doc, updateDoc };
