import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!strongPassword.test(form.password)) {
      setError('Le mot de passe doit contenir 10 caractères, majuscule, minuscule et chiffre.');
      return;
    }
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="page">
      <h2>Inscription</h2>
      <form onSubmit={submit} className="card">
        <input type="text" placeholder="Nom complet" required onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input type="email" placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Mot de passe fort" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Créer un compte</button>
      </form>
    </main>
  );
}
