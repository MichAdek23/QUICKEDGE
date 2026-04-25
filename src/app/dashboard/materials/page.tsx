import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import MaterialList from '../MaterialList';

export default async function MaterialsDirectoryPage() {
  let supabase;
  let user;
  let profile = { is_subscribed: false, role: 'student' };
  let materials: any[] = [];

  try {
    supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    user = authData.user;
    
    if (!user) redirect('/login');

    const { data: profileData } = await supabase
      .from('profiles')
      .select('is_subscribed, role')
      .eq('id', user.id)
      .single();

    if (profileData) profile = profileData;

    // Fetch materials for all authenticated users (Freemium logic)
    const { data: materialData } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (materialData) {
      materials = materialData;
      
      if (!profile.is_subscribed && profile.role !== 'admin') {
         materials = materials.map((m) => {
           const { url, ...safeMaterial } = m;
           return safeMaterial;
         });
      }
    }
  } catch (error) {
    console.error("Materials directory fetch error:", error);
  }

  if (!user) return null;

  const isSubscribed = profile.is_subscribed || profile.role === 'admin';

  return (
    <div className="dashboard-container" style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '3rem' }}>
         <a href="/dashboard" style={{ color: '#a1a1aa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', transition: 'color 0.2s' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Dashboard
         </a>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', backgroundImage: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Study Materials</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Access premium consultancy materials, videos, and exclusive PDFs.</p>
      </header>

      <section>
        <MaterialList 
          materials={materials || []} 
          isSubscribed={isSubscribed} 
        />
      </section>
    </div>
  );
}
