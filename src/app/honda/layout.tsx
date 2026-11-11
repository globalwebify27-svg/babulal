import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premsons Honda | Authorized Honda 2-Wheeler Dealership Ranchi',
  description: 'Explore the complete range of Honda two-wheelers, Activa, Shine, SP125, and genuine service excellence at Premsons Honda Ranchi (Babulal Premsons Group).',
  alternates: {
    canonical: 'https://babulalpremkumar.com/honda',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Premsons Honda | Authorized Honda 2-Wheeler Dealership Ranchi',
    description: 'Explore the complete range of Honda two-wheelers, Activa, Shine, SP125, and genuine service excellence at Premsons Honda Ranchi.',
    url: 'https://babulalpremkumar.com/honda',
    type: 'website',
  },
};

export default function HondaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
