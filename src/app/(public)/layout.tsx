import FloatingNavbar from '@/components/FloatingNavbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Quick-Hedge | Elite Consulting & Analytics",
  description: "Quick-Hedge was forged for one reason: bridging the gap between average performance and elite market execution. Access premium tools, data sets, and expert consulting.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Quick-Hedge | Elite Consulting & Analytics",
    description: "Quick-Hedge was forged for one reason: bridging the gap between average performance and elite market execution.",
    url: "/",
  }
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FloatingNavbar />
      {children}
    </>
  );
}
