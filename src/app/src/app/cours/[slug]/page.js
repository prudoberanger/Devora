'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CoursePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger le cours et les modules
  useEffect(() => {
    async function loadCourse() {
      // 1. Récupérer le cours via son slug
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title, description')
        .eq('slug', slug)
        .single();

      if (courseError || !courseData) {
        router.push('/dashboard');
        return;
      }
      setCourse(courseData);

      // 2. Récupérer les modules de ce cours (triés par sort_order)
      const { data: modulesData, error: modulesError } = await supabase
        .from('content_modules')
        .select('*')
        .eq('course_id', courseData.id)
        .order('sort_order', { ascending: true });

      if (modulesError) {
        console.error(modulesError);
        setModules([]);
      } else {
        setModules(modulesData || []);
      }

      // 3. Récupérer la progression de l'utilisateur pour ce cours
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('current_module_id')
          .eq('user_id', session.user.id)
          .eq('course_id', courseData.id)
          .single();

        if (progress && progress.current_module_id && modulesData) {
          const index = modulesData.findIndex(m => m.id === progress.current_module_id);
          if (index !== -1) setCurrentIndex(index);
        }
      }

      setLoading(false);
    }

    if (slug) loadCourse();
  }, [slug, router]);

  const currentModule = modules[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === modules.length - 1;

  const saveProgress = async (moduleId) => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('user_progress').upsert({
        user_id: session.user.id,
        course_id: course.id,
        current_module_id: moduleId,
        completed: isLast && moduleId === modules[modules.length - 1].id ? true : false,
        last_accessed: new Date().toISOString()
      });
    }
    setSaving(false);
  };

  const goNext = async () => {
    if (!isLast) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      await saveProgress(modules[nextIndex].id);
    } else {
      // Cours terminé, rediriger vers dashboard
      router.push('/dashboard');
    }
  };

  const goPrev = async () => {
    if (!isFirst) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      await saveProgress(modules[prevIndex].id);
    }
  };

  if (loading) {
    return <div className="loader">Chargement du cours...</div>;
  }

  if (!course || modules.length === 0) {
    return <div className="text-center p-8">Aucun contenu pour ce cours.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-orange-500 hover:underline"
          >
            ← Tableau de bord
          </button>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {modules.length}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{currentModule.title}</h2>

        <div
          className="prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: currentModule.content_html }}
        />

        <div className="flex justify-between gap-4">
          <button
            onClick={goPrev}
            disabled={isFirst || saving}
            className={`px-6 py-2 rounded-lg font-medium ${
              isFirst
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Précédent
          </button>
          <button
            onClick={goNext}
            disabled={saving}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
          >
            {isLast ? 'Terminer' : 'Suivant'}
          </button>
        </div>

        {saving && <p className="text-sm text-gray-500 mt-4 text-center">Sauvegarde...</p>}
      </div>
    </div>
  );
}
