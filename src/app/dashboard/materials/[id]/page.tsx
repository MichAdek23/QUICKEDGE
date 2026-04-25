import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SubscriptionCTA from '@/app/dashboard/SubscriptionCTA';
import Link from 'next/link';

export default async function MaterialDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_subscribed, role')
    .eq('id', user.id)
    .single();

  const isSubscribed = profile?.is_subscribed || profile?.role === 'admin';

  const { data: material } = await supabase
    .from('materials')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!material) {
    return <div className="dashboard-container"><h1>Material not found</h1></div>;
  }

  // Defensively eliminate sensitive url if not subscribed
  if (!isSubscribed) {
     material.url = null;
  }

  // Fetch quizzes and related questions dynamically for this exact material
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*, quiz_questions(*)')
    .eq('material_id', material.id);

  return (
    <div className="dashboard-container" style={{ paddingBottom: '6rem', maxWidth: '1000px' }}>
       <div style={{ marginBottom: '2.5rem' }}>
          <a href="/dashboard" style={{ color: '#a1a1aa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', transition: 'color 0.2s' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Catalogue
          </a>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', fontSize: '0.75rem', border: '1px solid var(--card-border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {material.type}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#52525b' }}>{new Date(material.created_at).toLocaleDateString()}</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', backgroundImage: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{material.title}</h1>
          <p style={{ color: '#e4e4e7', fontSize: '1.1rem', lineHeight: '1.7' }}>{material.description}</p>
       </div>

       {isSubscribed && material.url ? (
         <div className="glass-panel" style={{ overflow: 'hidden', padding: 0, border: '1px solid rgba(255,255,255,0.1)', background: 'black', borderRadius: '16px' }}>
            {material.type === 'video' ? (
              <video src={material.url} controls controlsList="nodownload" preload="metadata" style={{ width: '100%', maxHeight: '600px', display: 'block', backgroundColor: 'black' }} />
            ) : material.type === 'image' ? (
              <img src={material.url} alt={material.title} style={{ width: '100%', maxHeight: '800px', objectFit: 'contain', display: 'block', backgroundColor: '#0f0f11' }} />
            ) : material.type === 'pdf' ? (
              /* State of the art cross-browser PDF rendering: 
                 1. Native <object> executes seamlessly on Desktop.
                 2. If mobile OS rejects native object binding, it cascades into the iframe.
                 3. The iframe utilizes Google Docs Viewer to force an HTML5 canvas render of the PDF natively! */
              <object data={`${material.url}#toolbar=0&view=FitH`} type="application/pdf" width="100%" height="800px" style={{ display: 'block' }}>
                 <div style={{ width: '100%', height: '800px', overflow: 'hidden' }}>
                   <iframe 
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(material.url)}&embedded=true`} 
                      width="100%" 
                      height="850px" 
                      style={{ border: 'none', display: 'block', backgroundColor: '#fff', marginTop: '-50px' }} 
                   >
                      <p style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Your browser does not support inline premium PDFs. Please use a modern desktop browser like Chrome or Safari.</p>
                   </iframe>
                 </div>
              </object>
            ) : (
              <iframe src={material.url} style={{ width: '100%', height: '800px', border: 'none', backgroundColor: '#fff', display: 'block' }} />
            )}
         </div>
       ) : (
         <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(16, 185, 129, 0.1))', opacity: 0.5, zIndex: 0 }}></div>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '400px', margin: '0 auto' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.5" style={{ margin: '0 auto 1.5rem auto' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>Premium Portal</h2>
              <p style={{ color: '#e4e4e7', marginBottom: '2.5rem', lineHeight: 1.6 }}>Subscribe to unlock full access to the source files for '{material.title}' and its exclusive graded quizzes.</p>
              <SubscriptionCTA userEmail={user.email} userId={user.id} />
            </div>
         </div>
       )}

       {/* Secure Assessment Portal Hook */}
       {quizzes && quizzes.length > 0 && (
         <div style={{ marginTop: '5rem' }}>
           <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>Knowledge Assessments Available</h2>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
             {quizzes.map((quiz: any) => (
               <div key={quiz.id} className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #8b5cf6' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{quiz.title}</h3>
                  <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Mandatory strict-testing environment. 1 attempt permitted.</p>
                  
                  {isSubscribed ? (
                     <Link href={`/dashboard/exams/${quiz.id}`} className="btn-primary" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.9rem' }}>
                        Begin Assessment
                     </Link>
                  ) : (
                     <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: '#71717a', fontSize: '0.85rem', borderRadius: '8px', textAlign: 'center' }}>
                        Premium Only
                     </div>
                  )}
               </div>
             ))}
           </div>
         </div>
       )}
    </div>
  );
}
