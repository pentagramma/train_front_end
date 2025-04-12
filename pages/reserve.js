import { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import styles from '../styles/Reserve.module.css';

export default function Reserve() {
  const { user, logout } = useContext(AuthContext);
  const [seats, setSeats] = useState([]);
  const [userId, setUserId] = useState(null);
  const [numSeats, setNumSeats] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      fetchSeats();
    }
  }, [user]);

  const fetchSeats = async () => {
    try {
      const res = await fetch('https://train-reservation-backend-4s60.onrender.com/api/seats', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch seats');
      console.log('seatMap:', data.seatMap.map(row => row.map(seat => seat.id)));
      setSeats(data.seatMap);
      setUserId(data.userId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReserve = async () => {
    if (!user) {
      setError('Please login to reserve seats');
      return;
    }
    try {
      const res = await fetch('https://train-reservation-backend-4s60.onrender.com/api/seats/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ numSeats: parseInt(numSeats) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reservation failed');
      setSuccess(`Successfully reserved ${numSeats} seat(s)`);
      fetchSeats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = async () => {
    try {
      const res = await fetch('https://train-reservation-backend-4s60.onrender.com/api/seats/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      setSuccess('Seats reset successfully');
      fetchSeats();
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    console.log(seats)
    console.log("user")
  },[user])

  return (
    <div className={styles.container}>
      <h2>Reserve Seats</h2>
      
      <div className={styles.controls}>
        <label>Number of Seats (1-7):</label>
        <input
          type="number"
          min="1"
          max="7"
          value={numSeats}
          onChange={(e) => setNumSeats(e.target.value)}
        />
        <button onClick={handleReserve}>Reserve</button>
        {user?.role === 'admin' && <button onClick={handleReset}>Reset Seats</button>}
        <button onClick={logout}>Logout</button>
      </div>
      
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.seat} ${styles.available}`}></div>
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.seat} ${styles.booked}`}></div>
          <span>Your Reservation</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.seat} ${styles.notAvailable}`}></div>
          <span>Reserved by Others</span>
        </div>
      </div>

      <div className={styles.seatMap}>
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((seat) => (
              <div
                key={seat.id}
                className={`${styles.seat} ${
                  seat.isBooked
                    ? seat.userId === userId
                      ? styles.booked
                      : styles.notAvailable
                    : styles.available
                }`}
              >
                {seat.id}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}