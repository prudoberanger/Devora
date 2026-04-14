import Link from 'next/link';

export default function CGU() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-orange-500 mb-6">← Retour à l'accueil</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Conditions générales d'utilisation</h1>
        <p className="text-gray-500 mb-6">Dernière mise à jour : avril 2026</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Acceptation des conditions</h2>
            <p>En vous inscrivant sur Devora, vous acceptez sans réserve les présentes conditions générales d'utilisation.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">2. Utilisation de la plateforme</h2>
            <p>Devora est une plateforme gratuite d'apprentissage du code. Vous vous engagez à utiliser le site à des fins personnelles et non commerciales. Le harcèlement, le partage de contenu illégal ou la tentative de piratage sont strictement interdits.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">3. Compte utilisateur</h2>
            <p>Vous êtes responsable de la confidentialité de votre mot de passe. En cas d'utilisation frauduleuse, veuillez nous contacter immédiatement.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Propriété intellectuelle</h2>
            <p>Les cours et exercices sont protégés par le droit d'auteur. Vous n'êtes pas autorisé à les reproduire ou les redistribuer sans autorisation.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Modification des conditions</h2>
            <p>Devora se réserve le droit de modifier ces CGU à tout moment. Les modifications seront notifiées par email.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
