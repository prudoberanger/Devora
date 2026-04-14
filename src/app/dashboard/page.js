'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [badgesCount, setBadgesCount] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/connexion');
        return;
      }

      // Profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setProfile(profileData);

      // Cours
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('order', { ascending: true });
      setCourses(coursesData || []);

      // Progression
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id);
      setProgress(progressData || []);

      // Badges
      const { count: badgesCount } = await supabase
        .from('user_badges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
      setBadgesCount(badgesCount || 0);

      // Cours complétés
      const { count: completedCount } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('completed', true);
      setCompletedCourses(completedCount || 0);

      setLoading(false);
    }
    loadData();
  }, [router]);

  const getProgressForCourse = (courseId) => {
    const prog = progress.find(p => p.course_id === courseId);
    return prog ? prog.progress_percent : 0;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return <div className="loader">Chargement...</div>;

  const nextCourse = courses.find(course => getProgressForCourse(course.id) < 100);

  return (
    <div>
      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sb-logo-wrap">
          <Link href="/" className="sb-logo">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#FF5500"/>
              <path d="M8 8h5.5a6.5 6.5 0 0 1 0 13H8V8z" fill="white"/>
              <circle cx="18.5" cy="19.5" r="2.5" fill="white"/>
            </svg>
            Devora
          </Link>
          <button className="sb-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <div className="sb-user">
          <div className="sb-avatar">{profile?.prenom?.charAt(0) || '?'}</div>
          <div>
            <strong className="sb-name">{profile?.prenom || 'Apprenant'}</strong>
            <span className="sb-level">{profile?.niveau || 'Débutant'}</span>
          </div>
        </div>
        <nav className="sb-nav">
          <Link href="/dashboard" className="sb-link active">Tableau de bord</Link>
          <Link href="/langages" className="sb-link">Mes cours</Link>
          <Link href="/ia" className="sb-link">IA Devora</Link>
          <Link href="/ide" className="sb-link">Éditeur de code</Link>
          <Link href="/terminal" className="sb-link">Terminal</Link>
          <div className="sb-sep"></div>
          <Link href="/profil" className="sb-link">Mon profil</Link>
          <Link href="/parametres" className="sb-link">Paramètres</Link>
        </nav>
        <div className="sb-footer">
          <button onClick={handleLogout} className="sb-link sb-logout">Déconnexion</button>
        </div>
      </aside>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* Main content */}
      <main className="main">
        <div className="topbar">
          <button className="menu-btn" onClick={() => setMenuOpen(true)}>☰</button>
          <div className="topbar-logo">Devora</div>
          <Link href="/ia" className="btn-ia-sm">IA</Link>
        </div>
        <div className="content">
          <div className="welcome">
            <div>
              <h1 className="welcome-title">Bienvenue, <span className="welcome-orange">{profile?.prenom || 'Apprenant'}</span> !</h1>
              <p className="welcome-sub">Chaque ligne de code te rapproche de ton objectif.</p>
            </div>
            <Link href="/ia" className="btn-ia">Ouvrir l'IA Devora</Link>
          </div>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">🔥</div>
              <div><span className="stat-val">{profile?.streak || 0}</span><span className="stat-name">Jours de streak</span></div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">⭐</div>
              <div><span className="stat-val">{profile?.xp || 0}</span><span className="stat-name">XP total</span></div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">🏆</div>
              <div><span className="stat-val">{badgesCount}</span><span className="stat-name">Badges</span></div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">📘</div>
              <div><span className="stat-val">{completedCourses}</span><span className="stat-name">Cours complétés</span></div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Continuer</h2>
            {nextCourse ? (
              <div className="glass-card continue-box">
                <div>
                  <span className="course-tag">{nextCourse.title}</span>
                  <strong className="course-name">{nextCourse.description || 'Commencer le cours'}</strong>
                  <div className="progress-row">
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${getProgressForCourse(nextCourse.id)}%` }}></div></div>
                    <span>{getProgressForCourse(nextCourse.id)}% du module</span>
                  </div>
                </div>
                <Link href={`/cours/${nextCourse.slug}`} className="btn-continue">Continuer</Link>
              </div>
            ) : (
              <div className="glass-card continue-box">Tous les cours sont terminés !</div>
            )}
          </div>

          <div className="section">
            <h2 className="section-title">Mon parcours</h2>
            <div className="parcours-grid">
              {courses.map(course => (
                <div key={course.id} className="glass-card parcours-card">
                  <Link href={`/cours/${course.slug}`} className="block-link">
                    <div className="parc-header">
                      <span className="parc-name">{course.title}</span>
                      <span className="parc-pct">{getProgressForCourse(course.id)}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${getProgressForCourse(course.id)}%` }}></div></div>
                    <p className="parc-detail">{course.is_locked ? 'Verrouillé' : `${Math.floor(getProgressForCourse(course.id) / 10)}/10 modules`}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Objectif du jour</h2>
            <div className="glass-card obj-card">
              <div className="obj-header"><strong>1 cours aujourd'hui</strong><span>0 / 1 complété</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: '0%' }}></div></div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .block-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .parcours-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(255,85,0,0.12);
          transition: all 0.22s;
        }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
