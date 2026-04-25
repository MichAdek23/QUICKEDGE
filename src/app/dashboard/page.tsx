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
  } catch (error) {
    console.error("Dashboard profile fetch error:", error);
  }

  if (!user) return null;

  const isSubscribed = profile.is_subscribed || profile.role === 'admin';

  const services = [
    { title: 'Health and Fitness for all', description: 'Comprehensive wellness programs tailored for everyone.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { title: 'Fitness for Life (Seniors/Elders)', description: 'Specialized health and activity routines for longevity.', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'School Development', description: 'Institutional growth and foundational strategies.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { title: 'Professional Development for Teachers', description: 'Elevate educational standards and teaching practices.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { title: 'Sports Day & Inter-House Sports', description: 'Comprehensive competitions management.', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
    { title: 'Academic matters', description: 'Expert academic consulting and curriculum planning.', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  ];

  return (
    <div className="dashboard-container" style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Dashboard Overview</h1>
        <p style={{ color: '#a1a1aa' }}>Welcome back. Manage your premium consultancy services and resources.</p>
      </header>

      {/* Heavy CTA directly to Materials */}
      <div style={{ 
        backgroundImage: 'url(/study_cta_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '20px', 
        padding: '4rem 2rem', 
        marginBottom: '4rem',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Ambient overlay for text legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7))', pointerEvents: 'none' }}></div>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem', position: 'relative', zIndex: 1, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>Study now and always.</h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto', position: 'relative', zIndex: 1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          Unlock elite resources and study materials, exclusively available through our monthly subscription. Don't fall behind.
        </p>
        <a href="/dashboard/materials" style={{ 
          display: 'inline-block',
          background: 'white', 
          color: '#09090b', 
          padding: '1rem 2.5rem', 
          borderRadius: '999px', 
          fontWeight: 800,
          fontSize: '1.1rem',
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          position: 'relative',
          zIndex: 1,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          Explore Resources
        </a>
      </div>

      {/* Services Section */}
      <section style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Our Expertise</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Core pillars of our consultancy services.</p>
        
        <style dangerouslySetInnerHTML={{__html: `
          .service-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 1.5rem;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          }
          .service-card:hover {
            background: rgba(255,255,255,0.05);
            transform: translateY(-4px);
            border-color: rgba(236,72,153,0.3);
          }
        `}} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {services.map((service, index) => (
            <a href="#" key={index} className="service-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236,72,153,0.1)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={service.icon} />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f4f4f5' }}>{service.title}</h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.5 }}>{service.description}</p>
            </a>
          ))}
        </div>
      </section>
      

    </div>
  );
}
