import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Auth.module.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+(com|co|net|in)$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Email must end with .com, .co, .net, or .in');
      return;
    }

    try {
      const res = await fetch('https://train-reservation-backend-4s60.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Signup</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            pattern="[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+(com|co|net|in)"
            title="Email must end with .com, .co, .net, or .in"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Signup
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.link}>
        Old user? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}