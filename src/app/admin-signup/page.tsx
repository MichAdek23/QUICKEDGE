import { registerAdmin } from '@/app/auth/actions';

export default async function AdminSignupPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error as string | undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center', backgroundImage: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Admin Registration
        </h1>
        <p style={{ color: '#a1a1aa', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Only authorized personnel can create an administrative account.
        </p>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form action={registerAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#e4e4e7', fontWeight: 600 }}>Secret Passphrase</label>
            <input 
              type="password" 
              name="admin_secret" 
              placeholder="Enter master code..." 
              required 
              className="input-field" 
              style={{ borderColor: 'var(--accent)' }}
            />
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '0.5rem 0' }} />

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#e4e4e7' }}>Full Name</label>
            <input type="text" name="full_name" placeholder="John Doe" required className="input-field" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#e4e4e7' }}>Email</label>
            <input type="email" name="email" placeholder="you@company.com" required className="input-field" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#e4e4e7' }}>Password</label>
            <input type="password" name="password" placeholder="••••••••" required className="input-field" />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '0.8rem' }}>
            Create Admin Account
          </button>
        </form>
      </div>
    </div>
  );
}
