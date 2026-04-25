import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Get in touch with the Quick-Hedge team for elite consulting, account support, and general inquiries.",
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    title: "Contact Quick-Hedge",
    description: "Reach out to the Quick-Hedge support and consultancy team.",
    url: "/contact",
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
