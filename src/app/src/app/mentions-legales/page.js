import Link from 'next/link';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-orange-500 mb-6">← Retour à l'accueil</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Mentions légales</h1>
        <p className="text-gray-500 mb-6">Dernière mise à jour : avril 2026</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Éditeur du site</h2>
            <p>
              Devora est une plateforme d'apprentissage du code éditée par :<br />
              Nom : Devora<br />
              Email : <a href="mailto:contact.devoralearn@gmail.com" className="text-orange-500">contact.devoralearn@gmail.com</a><br />
              Directeur de publication : L'équipe Devora
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Hébergement</h2>
            <p>Le site est hébergé par Vercel Inc. (https://vercel.com).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Propriété intellectuelle</h2>
            <p>L'ensemble des contenus (cours, exercices, illustrations) est la propriété exclusive de Devora, sauf mentions contraires. Toute reproduction est interdite.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Limitation de responsabilité</h2>
            <p>Devora s'efforce de fournir des informations exactes mais ne saurait être tenue responsable des erreurs ou omissions.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
