import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ darkMode, toggleTheme }) {
  const { user, logout } = useAuth();

  return (
    <header className="nav">
      <Link to="/" className="brand">SecureSocial</Link>
      <nav>
        <button onClick={toggleTheme} className="ghost">{darkMode ? '☀️' : '🌙'}</button>
        {!user ? (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} className="danger">Déconnexion</button>
          </>
        )}
      </nav>
    </header>
  );
}
