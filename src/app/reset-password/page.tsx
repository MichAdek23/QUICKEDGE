import { updatePassword } from '../auth/actions';
import AuthLayout from '@/components/AuthLayout';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ResetPasswordPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error as string | undefined;

  return (
    <AuthLayout title="Reset Password" subtitle="Please enter your new secure password.">
      {error && (
        <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <form action={updatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#e4e4e7' }}>New Password</label>
          <input type="password" name="password" placeholder="Enter new password" className="input-field" required minLength={6} />
        </div>
        
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Update Password</button>
      </form>
    </AuthLayout>
  );
}
