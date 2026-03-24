# SecureSocial - Full-stack web app (React + Express + Supabase)

Ce projet est un **site de réseau social** prêt à la production avec une priorité sécurité.

## 1) Architecture

```text
.
├── backend/            # API Express sécurisée
├── frontend/           # Client React + Vite
└── supabase/schema.sql # Schéma SQL à appliquer sur Supabase
```

## 2) Fonctionnalités incluses

- Landing page moderne + dark mode + animations fluides.
- Inscription / connexion / déconnexion.
- Dashboard utilisateur (lecture + modification profil).
- Upload d'image de profil (bucket Supabase Storage `profile-images`).
- Journalisation locale (`logs/app.log`, `logs/error.log`).

## 3) Sécurité implémentée

- Hash bcrypt des mots de passe.
- JWT en cookie `httpOnly`.
- Protection CSRF (`csurf` + header `x-csrf-token`).
- Validation stricte des inputs (frontend + backend).
- Sanitize anti-XSS (`sanitize-html`).
- Rate limiting global + anti brute-force auth.
- Headers sécurisés (`helmet`) + anti parameter pollution (`hpp`).
- Gestion d'erreurs centralisée sans fuite de secrets.
- Requêtes Supabase via SDK (pas de SQL brut côté API).

## 4) Préparation Supabase

1. Crée un projet Supabase.
2. Exécute `supabase/schema.sql` dans SQL Editor.
3. Crée un bucket public `profile-images`.
4. Récupère :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 5) Lancement local

### Backend

```bash
cd backend
cp .env.example .env
# édite .env avec tes vraies valeurs
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# facultatif si API ailleurs
echo "VITE_API_BASE=http://localhost:5000/api" > .env
npm run dev
```

## 6) Déploiement

### Frontend sur Vercel

1. Import du dossier `frontend` dans Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Variable d'env: `VITE_API_BASE=https://<api-domain>/api`

### Backend sur Render

1. Nouveau Web Service sur dossier `backend`.
2. Build: `npm install`
3. Start: `npm start`
4. Variables d'env: celles de `.env.example`.
5. Mets `COOKIE_SECURE=true` en production.
6. Force HTTPS et configure le domaine frontend dans `CLIENT_URL`.

## 7) Hardening production recommandé

- Utiliser un secret JWT long et rotatif.
- Réduire la durée de vie du token + refresh token côté serveur.
- Ajouter monitoring (Sentry/Datadog) et alerting.
- Activer WAF/CDN.
- Ajouter sauvegardes régulières Supabase.
- Mettre en place tests sécurité automatiques (OWASP ZAP, SAST).

## 8) Endpoints API principaux

- `GET /api/health`
- `GET /api/auth/csrf-token`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/profile/me`
- `PUT /api/profile/me`
- `POST /api/profile/me/avatar`

