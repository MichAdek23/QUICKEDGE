'use client';

import HeroCarousel from '@/components/HeroCarousel';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const teamMembers = [
    { name: 'Founder & CEO', role: 'Strategic Visionary', bio: 'Pioneered the quantified performance revolution with 15+ years of industry expertise.' },
    { name: 'Chief Analytics Officer', role: 'Data Architect', bio: 'Built proprietary algorithms that power our predictive performance analytics engine.' },
    { name: 'VP of Mentorship', role: 'Talent Developer', bio: 'Curates elite mentor network and personalizes success pathways for every user.' },
    { name: 'Head of Product', role: 'Experience Designer', bio: 'Transforms complex data into intuitive interfaces that drive breakthrough insights.' },
    { name: 'Director of Community', role: 'Engagement Catalyst', bio: 'Builds thriving communities where members share wins and accelerate together.' },
    { name: 'Lead Technical Architect', role: 'Infrastructure Expert', bio: 'Ensures 24/7 platform reliability, security, and blazing-fast performance metrics.' },
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0c', color: '#f4f4f5' }}>
      <HeroCarousel 
         preTitle="Who We Are"
         title="The Architecture of"
         gradientSpan="Excellence."
         subtitle="We are not just a consultancy. We are a quantified performance syndicate built to elevate your exact position in the market."
      />
      <div style={{ maxWidth: '1000px', margin: '-5rem auto 0 auto', position: 'relative', zIndex: 5, padding: '0 2rem 6rem' }}>
         <div className="glass-panel" style={{ padding: '4rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#ffffff' }}>Our Mission</h2>
            <p style={{ fontSize: '1.2rem', color: '#a1a1aa', lineHeight: 1.8, marginBottom: '2rem' }}>
               Quick-Hedge was forged for one reason: bridging the gap between average performance and elite market execution. Through aggressive tracking, premium analytics, and tailored frameworks, we tear down traditional barriers.
            </p>
         </div>
      </div>

      {/* Values Section */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
         <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '1.5rem' }}>Core Values</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>The principles that drive every decision we make and every solution we build.</p>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {[
              { icon: '📊', title: 'Data-Driven Excellence', desc: 'Every insight backed by rigorous analytics and real-world validation.' },
              { icon: '🤝', title: 'Community First', desc: 'We rise by lifting others. Your success is our greatest achievement.' },
              { icon: '🔒', title: 'Trust & Transparency', desc: 'Security, privacy, and honesty in every interaction.' },
              { icon: '⚡', title: 'Relentless Innovation', desc: 'Constantly evolving to stay ahead of market trends and user needs.' },
            ].map((value, i) => (
              <div key={i} className="glass-panel" style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{value.icon}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '1rem' }}>{value.title}</h3>
                <p style={{ color: '#a1a1aa', lineHeight: 1.6 }}>{value.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Full-Width Team Section */}
      <section style={{ padding: '8rem 2rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05))', width: '100%' }}>
         <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
               <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '1.5rem' }}>Meet Our Powerhouse Team</h2>
               <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>World-class experts dedicated to transforming how you achieve peak performance.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
               {teamMembers.map((member, i) => (
                  <div 
                     key={i} 
                     style={{
                        borderRadius: '16px',
                        background: 'rgba(15, 15, 17, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '2.5rem',
                        textAlign: 'center',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        cursor: 'pointer'
                     }}
                     onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.2)';
                     }}
                     onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                     }}
                  >
                     <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, #8b5cf6, #ec4899)`,
                        margin: '0 auto 1.5rem auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: 'white'
                     }}>
                        {member.name.split(' ')[0][0]}{member.name.split(' ')[1]?.[0] || ''}
                     </div>
                     <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.5rem' }}>{member.name}</h3>
                     <p style={{ fontSize: '0.95rem', color: '#8b5cf6', fontWeight: 600, marginBottom: '1rem' }}>{member.role}</p>
                     <p style={{ color: '#a1a1aa', lineHeight: 1.6, fontSize: '0.95rem' }}>{member.bio}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Timeline/Journey Section */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
         <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '1.5rem' }}>Our Journey</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>From visionary startup to industry leader in performance analytics.</p>
         </div>

         <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {[
              { year: '2020', event: 'Founded with a mission', desc: 'Started with a simple idea: democratize elite performance metrics.' },
              { year: '2021', event: 'First 1000 Users', desc: 'Launched beta program and saw overwhelming early adoption and success stories.' },
              { year: '2022', event: 'AI Engine Released', desc: 'Introduced proprietary algorithms that revolutionized predictive analytics.' },
              { year: '2023', event: 'Global Expansion', desc: 'Expanded to 50+ countries with localized mentorship and support.' },
              { year: '2024', event: 'Certification Programs', desc: 'Launched accredited courses earning industry recognition worldwide.' },
              { year: '2025', event: 'Industry Leadership', desc: 'Recognized as the top performance analytics platform for athletes and traders.' },
            ].map((milestone, i) => (
              <div key={i} style={{ display: 'flex', gap: '3rem', marginBottom: '3rem', position: 'relative' }}>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                     width: '24px',
                     height: '24px',
                     borderRadius: '50%',
                     background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                     border: '3px solid #0a0a0c',
                     zIndex: 10
                  }} />
                  {i < 5 && (
                     <div style={{
                        width: '2px',
                        height: '120px',
                        background: 'linear-gradient(to bottom, #8b5cf6, transparent)',
                        marginTop: '10px'
                     }} />
                  )}
                </div>
                <div style={{ paddingTop: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ec4899', marginBottom: '0.5rem' }}>{milestone.year}</h4>
                  <h5 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f4f4f5', marginBottom: '0.5rem' }}>{milestone.event}</h5>
                  <p style={{ color: '#a1a1aa', lineHeight: 1.6 }}>{milestone.desc}</p>
                </div>
              </div>
            ))}
         </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))', borderRadius: '20px', maxWidth: '1200px', margin: '4rem auto' }}>
         <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f4f4f5', marginBottom: '1.5rem' }}>Join Our Movement</h2>
         <p style={{ color: '#a1a1aa', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '550px', margin: '0 auto 2rem auto' }}>Become part of the ecosystem transforming how elite performers achieve their goals.</p>
         <a href="/signup" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem', background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', borderRadius: '999px', textDecoration: 'none', display: 'inline-block' }}>
            Get Started With Quick-Hedge
         </a>
      </section>
    </main>
  );
}
