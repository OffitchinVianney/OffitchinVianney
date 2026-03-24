import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [status, setStatus] = useState('');
  const fileInput = useRef(null);

  const save = async (e) => {
    e.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/profile/me`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': (await (await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/auth/csrf-token`, { credentials: 'include' })).json()).csrfToken
      },
      body: JSON.stringify({ fullName, bio })
    });
    if (!response.ok) {
      setStatus('Erreur de sauvegarde');
      return;
    }
    setStatus('Profil mis à jour');
    await refreshProfile();
  };

  const uploadAvatar = async () => {
    if (!fileInput.current?.files[0]) return;
    const token = (await (await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/auth/csrf-token`, { credentials: 'include' })).json()).csrfToken;
    const formData = new FormData();
    formData.append('avatar', fileInput.current.files[0]);

    const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/profile/me/avatar`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'x-csrf-token': token },
      body: formData
    });

    setStatus(response.ok ? 'Avatar mis à jour' : 'Erreur upload avatar');
    if (response.ok) await refreshProfile();
  };

  return (
    <main className="page">
      <h2>Dashboard</h2>
      <div className="card">
        <p><strong>Email:</strong> {user?.email}</p>
        {user?.avatar_url && <img src={user.avatar_url} alt="avatar" className="avatar" />}
        <form onSubmit={save}>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nom" />
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" />
          <button type="submit">Sauvegarder profil</button>
        </form>
        <hr />
        <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" />
        <button onClick={uploadAvatar}>Uploader avatar</button>
        {status && <p>{status}</p>}
      </div>
    </main>
  );
}
