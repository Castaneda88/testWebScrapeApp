export const loadFirebaseAuth = async () => {
  const firebaseAuth = await import("firebase/auth");
  const { app } = await import("./firebase");

  const { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } = firebaseAuth;

  return {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    auth: getAuth(app),
  };
};
