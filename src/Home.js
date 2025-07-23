import React from 'react';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Pharmio Medical Store!</h1>
      <p className="home-description">Your trusted source for quality medicines and healthcare products.</p>
      <div className="home-features">
        <h3>Our Features:</h3>
        <ul>
          <li>Wide range of medicines and health products.</li>
          <li>Secure and easy online ordering.</li>
          <li>Fast delivery to your doorstep.</li>
          <li>User-friendly interface.</li>
        </ul>
      </div>
      <p className="home-cta">
        <a href="/products" className="button primary-button">Explore Products</a>
        <a href="/register" className="button secondary-button">Join Us</a>
      </p>
    </div>
  );
}

export default Home;