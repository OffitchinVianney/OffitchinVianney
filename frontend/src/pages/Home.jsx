import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.main
      className="page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1>Plateforme sociale moderne et sécurisée</h1>
      <p>Inscris-toi, personnalise ton profil et gère ton espace personnel en toute sécurité.</p>
    </motion.main>
  );
}
