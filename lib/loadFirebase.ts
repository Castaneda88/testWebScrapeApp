import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase";

export const loadFirebaseAuth = async () => {
  const auth = getAuth(app);
  return {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    auth,
  };
};

