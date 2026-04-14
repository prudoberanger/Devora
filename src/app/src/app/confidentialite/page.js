import Link from 'next/link';

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-orange-500 mb-6">← Retour à l'accueil</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Politique de confidentialité</h1>
        <p className="text-gray-500 mb-6">Dernière mise à jour : avril 2026</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Collecte des données</h2>
            <p>Nous collectons les informations que vous nous fournissez lors de l'inscription : nom, email, âge, niveau, objectif d'apprentissage. Nous utilisons également des cookies techniques pour le fonctionnement de l'authentification.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour personnaliser votre parcours d'apprentissage, vous envoyer des notifications (optionnelles) et améliorer nos services. Nous ne vendons pas vos données à des tiers.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Stockage et sécurité</h2>
            <p>Vos données sont hébergées par Supabase (hébergeur certifié GDPR). Nous mettons en œuvre des mesures de sécurité pour protéger vos informations.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Vos droits</h2>
            <p>Conformément au RGPD, vous avez le droit d'accéder, rectifier ou supprimer vos données personnelles. Pour cela, écrivez à <a href="mailto:contact.devoralearn@gmail.com" className="text-orange-500">contact.devoralearn@gmail.com</a>.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
            <p>Nous utilisons uniquement des cookies nécessaires au fonctionnement du site (session utilisateur). Aucun cookie publicitaire ou de tracking n'est utilisé.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
