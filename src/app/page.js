'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Barre de navigation */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="navInner">
          <Link href="/" className="navLogo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#FF5500" />
              <path d="M8 8h5.5a6.5 6.5 0 0 1 0 13H8V8z" fill="white" />
              <circle cx="18.5" cy="19.5" r="2.5" fill="white" />
            </svg>
            Devora
          </Link>
          <div className="navItems">
            <a href="#solutions" className="navItem">Solutions</a>
            <a href="#parcours" className="navItem">Parcours</a>
            <a href="#langages" className="navItem">Langages</a>
            <a href="#avis" className="navItem">Avis</a>
          </div>
          <div className="navBtns">
            <Link href="/connexion" className="btnOutline">Se connecter</Link>
            <Link href="/inscription" className="btnPrimary">S'inscrire</Link>
          </div>
          <button className="hamburger" onClick={toggleMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div className={`mobileMenu ${menuOpen ? 'open' : ''}`}>
        <div className="mobileMenuHeader">
          <div className="navLogo">Devora</div>
          <button onClick={closeMenu} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>
        <div className="mobileNavItems">
          <a href="#solutions" className="mobileNavItem" onClick={closeMenu}>Solutions</a>
          <a href="#parcours" className="mobileNavItem" onClick={closeMenu}>Parcours</a>
          <a href="#langages" className="mobileNavItem" onClick={closeMenu}>Langages</a>
          <a href="#avis" className="mobileNavItem" onClick={closeMenu}>Avis</a>
        </div>
        <div className="mobileBtns">
          <Link href="/connexion" className="btnOutline mobileBtnFull">Se connecter</Link>
          <Link href="/inscription" className="btnPrimary mobileBtnFull">S'inscrire gratuitement</Link>
        </div>
      </div>

      {/* Section Hero */}
      <section className="hero">
        <div className="heroContent">
          <div className="heroBadge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            100% gratuit — 100% en français
          </div>
          <h1 className="heroTitle">Apprenez à coder.<br /><span className="heroAccent">Vraiment.</span></h1>
          <p className="heroSubtitle">Les autres plateformes vont vite. Devora prend le temps de vraiment comprendre. IA intégrée, gamification, et un parcours complet du HTML jusqu'à React.</p>
          <div className="heroCtas">
            <Link href="/inscription" className="btnHero btnHeroPrimary">Commencer gratuitement <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
            <a href="#parcours" className="btnHero btnHeroOutline">Voir les parcours</a>
          </div>
          <div className="heroStats">
            <div className="statCard"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg><div><strong>12 000+</strong><span>Apprenants</span></div></div>
            <div className="statCard"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg><div><strong>200+</strong><span>Cours</span></div></div>
            <div className="statCard"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><div><strong>19</strong><span>Langages</span></div></div>
          </div>
        </div>
        <div className="heroBg"><div className="orb orb1"></div><div className="orb orb2"></div></div>
      </section>

      {/* Solutions */}
      <section className="section" id="solutions">
        <div className="container">
          <div className="sectionHeader">
            <span className="sectionTag">Pourquoi Devora</span>
            <h2 className="sectionTitle">Une vraie différence</h2>
            <p className="sectionSubtitle">Conçu pour ceux qui veulent comprendre, pas juste copier-coller.</p>
          </div>
          <div className="featuresGrid">
            <div className="featureCard"><div className="featureIcon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><h3 className="featureTitle">Explications en profondeur</h3><p className="featureDesc">Chaque concept est expliqué simplement, puis en détail. Tu comprends pourquoi, pas seulement comment.</p></div>
            <div className="featureCard"><div className="featureIcon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div><h3 className="featureTitle">IA avec mémoire</h3><p className="featureDesc">L'IA Devora se souvient de tes conversations précédentes. Elle connaît ton niveau et ton parcours.</p></div>
            <div className="featureCard"><div className="featureIcon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg></div><h3 className="featureTitle">Gamification complète</h3><p className="featureDesc">Streak, XP, badges, leaderboard et mascotte animée. Apprendre devient une habitude agréable.</p></div>
            <div className="featureCard"><div className="featureIcon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><h3 className="featureTitle">Parcours structuré</h3><p className="featureDesc">Progression séquentielle obligatoire. Impossible de sauter des étapes — chaque base est solide.</p></div>
          </div>
        </div>
      </section>

      {/* Parcours */}
      <section className="section section-tinted" id="parcours">
        <div className="container">
          <div className="sectionHeader">
            <span className="sectionTag">Parcours</span>
            <h2 className="sectionTitle">Quel développeur veux-tu devenir ?</h2>
            <p className="sectionSubtitle">Choisis ton objectif à l'inscription. Devora construit ton parcours sur mesure.</p>
          </div>
          <div className="parcoursGrid">
            <div className="parcoursCard"><div className="parcoursLabel" style={{borderColor:"#FF5500",color:"#FF5500"}}>Frontend</div><p className="parcoursDesc">Crée des interfaces web modernes et réactives.</p><div className="langBadges"><span className="langBadge">HTML</span><span className="langBadge">CSS</span><span className="langBadge">JavaScript</span><span className="langBadge">TypeScript</span><span className="langBadge">React</span><span className="langBadge">Next.js</span></div><Link href="/inscription" className="parcoursBtn">Choisir ce parcours <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link></div>
            <div className="parcoursCard"><div className="parcoursLabel" style={{borderColor:"#1A1A2E",color:"#1A1A2E"}}>Backend</div><p className="parcoursDesc">Maîtrise les serveurs, bases de données et APIs.</p><div className="langBadges"><span className="langBadge">Python</span><span className="langBadge">Node.js</span><span className="langBadge">SQL</span><span className="langBadge">APIs</span><span className="langBadge">Express.js</span><span className="langBadge">Django</span></div><Link href="/inscription" className="parcoursBtn">Choisir ce parcours <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link></div>
            <div className="parcoursCard"><div className="parcoursLabel" style={{borderColor:"#FF5500",color:"#FF5500"}}>Fullstack</div><p className="parcoursDesc">Développe des applications complètes de A à Z.</p><div className="langBadges"><span className="langBadge">HTML</span><span className="langBadge">CSS</span><span className="langBadge">JS</span><span className="langBadge">React</span><span className="langBadge">Next.js</span><span className="langBadge">Python</span><span className="langBadge">SQL</span></div><Link href="/inscription" className="parcoursBtn">Choisir ce parcours <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link></div>
            <div className="parcoursCard"><div className="parcoursLabel" style={{borderColor:"#4B5563",color:"#4B5563"}}>Libre</div><p className="parcoursDesc">Explore les langages et frameworks qui t'intéressent.</p><div className="langBadges"><span className="langBadge">Ton choix</span></div><Link href="/inscription" className="parcoursBtn">Choisir ce parcours <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link></div>
          </div>
        </div>
      </section>

      {/* Étapes */}
      <section className="section" id="langages">
        <div className="container">
          <div className="sectionHeader">
            <span className="sectionTag">Structure des cours</span>
            <h2 className="sectionTitle">Chaque cours, étape par étape</h2>
            <p className="sectionSubtitle">Une progression pensée pour vraiment apprendre, pas pour aller vite.</p>
          </div>
          <div className="stepsRow">
            <div className="stepCard"><span className="stepNum">01</span><strong className="stepLabel">Explication simple</strong><p className="stepDesc">Le concept présenté clairement.</p></div>
            <div className="stepCard"><span className="stepNum">02</span><strong className="stepLabel">Explication avancée</strong><p className="stepDesc">On va plus loin dans les détails.</p></div>
            <div className="stepCard"><span className="stepNum">03</span><strong className="stepLabel">Exemple de code</strong><p className="stepDesc">Voir le code en action.</p></div>
            <div className="stepCard"><span className="stepNum">04</span><strong className="stepLabel">3 exercices</strong><p className="stepDesc">Facile → Moyen → Difficile.</p></div>
            <div className="stepCard"><span className="stepNum">05</span><strong className="stepLabel">Call to Action IA</strong><p className="stepDesc">Pose tes questions à l'IA Devora.</p></div>
          </div>
        </div>
      </section>

      {/* Gamification */}
      <section className="section section-dark">
        <div className="container">
          <div className="sectionHeader">
            <span className="sectionTag sectionTagDark">Gamification</span>
            <h2 className="sectionTitle sectionTitleWhite">Apprendre devient une habitude</h2>
            <p className="sectionSubtitle sectionSubtitleWhite">Inspiré de Duolingo — sans les vies qui punissent.</p>
          </div>
          <div className="gamifGrid">
            <div className="gamifCard"><div className="gamifIcon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></div><strong className="gamifLabel">Streak</strong><p className="gamifDesc">Jours consécutifs de connexion</p></div>
            <div className="gamifCard"><div className="gamifIcon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div><strong className="gamifLabel">XP</strong><p className="gamifDesc">Points gagnés à chaque exercice</p></div>
            <div className="gamifCard"><div className="gamifIcon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg></div><strong className="gamifLabel">Badges</strong><p className="gamifDesc">Débloqués à chaque étape clé</p></div>
            <div className="gamifCard"><div className="gamifIcon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><strong className="gamifLabel">Leaderboard</strong><p className="gamifDesc">Classe-toi parmi les apprenants</p></div>
          </div>
        </div>
      </section>

      {/* Avis */}
      <section className="section" id="avis">
        <div className="container">
          <div className="sectionHeader">
            <span className="sectionTag">Ils apprennent avec Devora</span>
            <h2 className="sectionTitle">Ce qu'en disent nos apprenants</h2>
          </div>
          <div className="reviewsGrid">
            <div className="reviewCard"><div className="reviewStars">★★★★★</div><p className="reviewText">"J'ai essayé Codecademy et FreeCodeCamp avant. Devora est la seule plateforme qui m'explique vraiment pourquoi ça marche."</p><div className="reviewAuthor"><div className="reviewAvatar">S</div><div><strong>Sarah M.</strong><span>Apprenante Frontend</span></div></div></div>
            <div className="reviewCard"><div className="reviewStars">★★★★★</div><p className="reviewText">"Le système de streak me pousse à ouvrir Devora tous les jours. J'ai plus progressé en 2 mois qu'en 1 an ailleurs."</p><div className="reviewAuthor"><div className="reviewAvatar">K</div><div><strong>Karim B.</strong><span>Apprenant Fullstack</span></div></div></div>
            <div className="reviewCard"><div className="reviewStars">★★★★★</div><p className="reviewText">"L'IA qui se souvient de mes questions précédentes change tout. C'est comme avoir un prof disponible 24h/24."</p><div className="reviewAuthor"><div className="reviewAvatar">L</div><div><strong>Léa T.</strong><span>Apprenante Backend</span></div></div></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ctaBanner">
        <div className="ctaInner">
          <h2 className="ctaTitle">Prêt à commencer ?</h2>
          <p className="ctaSubtitle">Rejoins des milliers d'apprenants. Aucune carte de crédit requise.</p>
          <Link href="/inscription" className="btnCta">Créer mon compte gratuit <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
          <div className="ctaFeats"><span className="ctaFeat">✓ 100% gratuit</span><span className="ctaFeat">✓ IA intégrée</span><span className="ctaFeat">✓ Aucun prérequis</span></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footerInner">
          <div className="footerLogo">Devora</div>
          <div className="footerLinks">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/cgu">CGU</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <p className="footerCopy">© 2026 Devora — Tous droits réservés</p>
        </div>
      </footer>
    </>
  );
}
