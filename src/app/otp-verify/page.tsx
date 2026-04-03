import { verifyOtpAction } from '../auth/actions';
import AuthLayout from '@/components/AuthLayout';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function OtpVerifyPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email as string | undefined;
  const error = searchParams?.error as string | undefined;
  const message = searchParams?.message as string | undefined;

  if (!email) {
    return (
      <AuthLayout title="Verification Error" subtitle="Missing email in verify link.">
         <p style={{textAlign: 'center'}}><a href="/login" style={{ color: '#a78bfa' }}>Return to Login</a></p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Verify Your Account" subtitle={`We sent a 6-digit code to ${email}`}>
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

      <form action={verifyOtpAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <input type="hidden" name="email" value={email} />
        
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#e4e4e7' }}>6-Digit Verification Code</label>
          <input 
            type="text" 
            name="token" 
            placeholder="123456" 
            className="input-field" 
            style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.5rem' }}
            required 
            maxLength={6}
          />
        </div>
        
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Verify Code</button>
      </form>
    </AuthLayout>
  );
}
