import Link from 'next/link';
import { signup, signInWithGoogle } from '../auth/actions';
import AuthLayout from '@/components/AuthLayout';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function SignupPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error as string | undefined;
  const nextTarget = searchParams?.next as string | undefined;

  return (
    <AuthLayout title="Create Account" subtitle="Join to unlock premium consultancy.">
      {error && (
        <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <form action={signup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {nextTarget && <input type="hidden" name="next" value={nextTarget} />}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#e4e4e7' }}>Full Name</label>
          <input type="text" name="name" placeholder="John Doe" className="input-field" required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#e4e4e7' }}>Email</label>
          <input type="email" name="email" placeholder="you@example.com" className="input-field" required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#e4e4e7' }}>Password</label>
          <input type="password" name="password" placeholder="••••••••" className="input-field" required />
        </div>
        
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Sign Up</button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--card-border)' }}></div>
        <span style={{ padding: '0 1rem', fontSize: '0.85rem', color: '#a1a1aa' }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--card-border)' }}></div>
      </div>
      
      <form action={signInWithGoogle}>
        <button type="submit" className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#a1a1aa' }}>
        Already have an account? <Link href="/login" style={{ color: '#a78bfa', fontWeight: 600 }}>Log in</Link>
      </p>
    </AuthLayout>
  );
}
