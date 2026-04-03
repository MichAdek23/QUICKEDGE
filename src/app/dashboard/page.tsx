import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import MaterialList from './MaterialList';

export default async function DashboardCataloguePage() {
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
    console.error("Database connection failed.");
  }

  if (!user) return null;

  const isSubscribed = profile.is_subscribed || profile.role === 'admin';

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Catalogue</h1>
        <p style={{ color: '#a1a1aa' }}>Explore premium consultancy materials, videos, and PDFs.</p>
      </header>
      
      <MaterialList 
        materials={materials || []} 
        isSubscribed={isSubscribed} 
      />
    </div>
  );
}
