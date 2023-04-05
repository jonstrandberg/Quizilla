import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const Register = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();

  const handleRegisterFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleRegisterFormSubmit}>
      <input type="email" name="email" placeholder="Email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      <input type="password" name="password" placeholder="Password" required value={password} onChange={(event) => setPassword(event.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
