'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === 'admin' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/editor');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={styles.loginPage}>
      <ThemeToggle isLoginPage={true} />
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>P&ID Capture Tool</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div className={styles.loginHint}>
            <small>Use username: admin and password: 123</small>
          </div>
          <button type="submit" className={styles.loginButton}>
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}