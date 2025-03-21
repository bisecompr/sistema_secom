import React, { useState } from 'react';
import { menuItems } from './menuItems';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../routes/AuthContext';
import { Button } from 'react-bootstrap';
import { FiLogOut } from 'react-icons/fi';
import { Link } from "react-router-dom";


const Menu = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const logout = () => {
    // Removendo dados do sessionStorage
    sessionStorage.removeItem('_role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('_id');
    sessionStorage.removeItem('email');
  
    // Removendo dados do localStorage
    localStorage.removeItem('_role');
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    localStorage.removeItem('email');
  
    // Redirecionando para a página de login
    navigate('/login');
    window.location.reload();
  };
  

  if (!isAuthenticated) return null;

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img
          src="https://logodownload.org/wp-content/uploads/2023/01/governo-federal-2023-logo-lula.png"
          alt="Logo Governo Federal"
          className="logo"
        />
      </div>
      <nav className="menu-container">
        <ul className="menu">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link  className="nav-link lead" to={item.path} onClick={() => window.scrollTo(0, 0)}>

                <li key={index} className={`menu-item ${isActive ? 'active' : ''}`}>
                  <a
                    href={item.path}
                    style={{
                      textDecoration: 'none',
                      color: isActive ? '#000' : '#666',
                      fontWeight: isActive ? 'bold' : 'normal',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="menu-text">{item.name}</span>}
                  </a>
                </li>
              </Link>

            );
          })}
        </ul>
      </nav>
      <div
        className="logout-container"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: 0,
          right: 0,
          padding: '0 20px',
        }}
      >
        <Button
          variant="danger"
          onClick={logout}
          className="logout-button"
          style={{
            width: isCollapsed ? '40px' : '100%',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: '#dc3545',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(220, 53, 69, 0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#c82333';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#dc3545';
          }}
        >
          <FiLogOut size={20} />
          {!isCollapsed && <span className="logout-text"></span>}
        </Button>
      </div>
    </aside>
  );
};

export default Menu;