import React from 'react';
import { FaRegSmileBeam } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <FaRegSmileBeam size={100} color="#4caf50" />
        <h1 style={styles.header}>Thank You for Shopping with Us!</h1>
        <p style={styles.message}>
          We appreciate your business and hope to see you again soon.
        </p>
        <Link to="/" style={styles.button}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    fontFamily: 'Arial, sans-serif',
  },
  content: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    color: '#333',
    fontSize: '2.5rem',
    margin: '20px 0',
  },
  message: {
    color: '#555',
    fontSize: '1.1rem',
    margin: '10px 0',
  },
  button: {
    textDecoration: 'none',
    padding: '12px 20px',
    backgroundColor: '#4caf50',
    color: '#fff',
    borderRadius: '5px',
    fontSize: '1rem',
    marginTop: '20px',
    display: 'inline-block',
  },
};

export default ThankYouPage;
