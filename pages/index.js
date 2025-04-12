import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <h1>Train Seat Reservation System</h1>
      {!user ? (
        <div>
          <Link href="/login">Login</Link> | <Link href="/signup">Signup</Link>
        </div>
      ) : (
        <div>
          <Link href="/reserve">Reserve Seats</Link>
        </div>
      )}
    </div>
  );
}