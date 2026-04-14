'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [envoye, setEnvoye] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact Devora de ${nom}`);
    const body = encodeURIComponent(`Nom : ${nom}\nEmail : ${email}\n\nMessage :\n${message}`);
    window.location.href = `mailto:contact.devoralearn@gmail.com?subject=${subject}&body=${body}`;
    setEnvoye(true);
    // Réinitialisation facultative
    setNom('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-orange-500 mb-6">← Retour à l'accueil</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Nous contacter</h1>
        <p className="text-gray-600 mb-6">Une question ? Une suggestion ? Utilisez le formulaire ci-dessous ou écrivez-nous directement à <strong>contact.devoralearn@gmail.com</strong>.</p>

        {envoye && (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4">
            Votre message a été ouvert dans votre application email. Merci de l'envoyer !
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom / Prénom</label>
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"></textarea>
          </div>
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition">Envoyer</button>
        </form>
      </div>
    </div>
  );
}
