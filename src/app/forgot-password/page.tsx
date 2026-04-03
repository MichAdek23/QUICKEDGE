import Link from 'next/link';
import { resetPassword } from '../auth/actions';
import AuthLayout from '@/components/AuthLayout';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ForgotPasswordPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error as string | undefined;
  const message = searchParams?.message as string | undefined;

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset link.">
      {error && (
        <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      
      {message && (
        <div style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      <form action={resetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#e4e4e7' }}>Email Address</label>
          <input type="email" name="email" placeholder="you@example.com" className="input-field" required />
        </div>
        
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Send Reset Link</button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#a1a1aa' }}>
        Remember your password? <Link href="/login" style={{ color: '#a78bfa', fontWeight: 600 }}>Log in</Link>
      </p>
    </AuthLayout>
  );
}
