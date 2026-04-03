import FloatingNavbar from '@/components/FloatingNavbar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FloatingNavbar />
      {children}
    </>
  );
}
