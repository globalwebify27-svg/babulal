import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Our 100+ Years Legacy | Babulal Premkumar',
  description: 'Discover the 100+ years heritage of Babulal Premkumar (Babulal Premsons Group) — from foundational textile trading in Ranchi to a multi-vertical regional powerhouse.',
  alternates: {
    canonical: 'https://babulalpremkumar.com/about',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'About Our 100+ Years Legacy | Babulal Premkumar',
    description: 'Discover the 100+ years heritage of Babulal Premkumar (Babulal Premsons Group) in Ranchi, Jharkhand.',
    url: 'https://babulalpremkumar.com/about',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
