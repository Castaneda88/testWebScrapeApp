export const loadFirebaseAuth = async () => {
  const firebaseAuth = await eval('import("firebase/auth")');
  const firebaseApp = await eval('import("./firebase")');

  const { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } = firebaseAuth;
  const { app } = firebaseApp;

  return {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    auth: getAuth(app),
  };
};