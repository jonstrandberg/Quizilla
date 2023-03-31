import React, { useEffect, useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import QuizContainer from './containers/QuizContainer'

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    // Check if the user is already authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Unsubscribe from the auth state listener when the component unmounts
    return unsubscribe;
  }, [auth]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {user ? (
        <>
          <h1>Welcome, {user.displayName}</h1>
          <button onClick={signOut}>Sign out</button>
          <QuizContainer />
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </>
  );
};

export default App;





