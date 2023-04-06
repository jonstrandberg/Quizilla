import React, { useEffect, useState } from 'react';
import { getAuth, signInWithPopup, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import QuizContainer from './containers/QuizContainer';
import './App.css';
import logo from './img/logo.png'

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    try {
      if (isRegistering) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setUser(result.user);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setUser(auth.currentUser);
      }
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

  const renderAuthForm = () => {
    const handleGoogleSignIn = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
      } catch (error) {
        console.log(error);
      }
    };
  
    if (isRegistering) {
      return (
        <>
          <form onSubmit={handleFormSubmit}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Register</button>
            <button onClick={() => setIsRegistering(false)}>Sign in instead</button>
            <button className="google-btn" onClick={handleGoogleSignIn}>
              Sign in with Google
            </button>
          </form>
        </>
      );
    } else {
      return (
        <>
          <form onSubmit={handleFormSubmit}>
          <div className="logo-container">
          <img src={logo} alt="Quizilla Logo" className="logo" />
          </div>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign in</button>
            <button onClick={() => setIsRegistering(true)} className="register-btn">Register</button>
            <button className="google-btn" onClick={handleGoogleSignIn}>
              Sign in with Google
            </button>
          </form>
        </>
      );
    }
}
    

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {user ? (
        <>
          <h1 className='displayName'>Welcome, {user.displayName}</h1>
          <button className="sign-out-btn" onClick={signOut}>
          Sign out
          </button>
          <QuizContainer />
        </>
      ) : (
        <>
          {renderAuthForm()}
        </>
      )}
    </>
  );
};

export default App;








