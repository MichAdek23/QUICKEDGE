import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the powerhouse team behind Quick-Hedge and our core values. We are a quantified performance syndicate built to elevate your exact position in the market.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "About Quick-Hedge | Our Mission & Team",
    description: "Learn about the powerhouse team behind Quick-Hedge and our core values.",
    url: "/about",
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
