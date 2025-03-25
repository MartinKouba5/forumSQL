// src/navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout, isLoggedIn }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <img src="https://th.bing.com/th/id/R.0c033ff47449ad26c2c1b79e48ee9d59?rik=8hCCD5JbHoUxVg&pid=ImgRaw&r=0" width="43" height="auto" alt="Logo" />
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Fórum</Link>
            </li>
            <li className="nav-item">
              {/* Další odkazy */}
            </li>
          </ul>
        
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
