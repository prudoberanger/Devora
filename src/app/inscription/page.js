'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function InscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Étape 1
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Étape 2
  const [age, setAge] = useState('');
  const [dejaCode, setDejaCode] = useState('non');
  const [dejaIA, setDejaIA] = useState('non');
  const [niveau, setNiveau] = useState('debutant');
  const [objectif, setObjectif] = useState('frontend');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/dashboard');
    };
    checkSession();
  }, [router]);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          prenom,
          age: parseInt(age),
          deja_code: dejaCode === 'oui',
          deja_code_ia: dejaIA === 'oui',
          niveau,
          objectif,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Étape 1
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe (min. 6 caractères)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition">Continuer</button>
          </form>
          <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">ou</span></div></div>
          <button onClick={handleGoogleSignup} disabled={loading} className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition">
            <svg width="20" height="20" viewBox="0 0 24 24">...</svg> Google
          </button>
          <p className="text-center text-sm text-gray-600 mt-6">Déjà un compte ? <Link href="/connexion" className="text-orange-500 font-semibold">Connexion</Link></p>
        </div>
      </div>
    );
  }

  // Étape 2
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Un peu plus sur toi</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Âge</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">As-tu déjà codé ?</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-1"><input type="radio" name="code" value="oui" checked={dejaCode === 'oui'} onChange={() => setDejaCode('oui')} /> Oui</label>
              <label className="flex items-center gap-1"><input type="radio" name="code" value="non" checked={dejaCode === 'non'} onChange={() => setDejaCode('non')} /> Non</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">As-tu déjà utilisé l'IA pour coder ?</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-1"><input type="radio" name="ia" value="oui" checked={dejaIA === 'oui'} onChange={() => setDejaIA('oui')} /> Oui</label>
              <label className="flex items-center gap-1"><input type="radio" name="ia" value="non" checked={dejaIA === 'non'} onChange={() => setDejaIA('non')} /> Non</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Niveau</label>
            <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg">
              <option value="debutant">Débutant</option><option value="junior">Junior</option><option value="senior">Senior</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Objectif</label>
            <select value={objectif} onChange={(e) => setObjectif(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg">
              <option value="frontend">Frontend</option><option value="backend">Backend</option><option value="fullstack">Fullstack</option><option value="autre">Autre</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition disabled:opacity-50">
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
          <button type="button" onClick={() => setStep(1)} className="w-full text-gray-500 text-sm hover:underline">Retour</button>
        </form>
      </div>
    </div>
  );
}
