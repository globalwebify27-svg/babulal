import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MUVA Industries | Precision Manufacturing & Engineering Legacy',
  description: 'MUVA Industries — Engineering excellence, precision manufacturing, industrial component fabrication, and metallurgical innovation by Babulal Premsons Group.',
  alternates: {
    canonical: 'https://babulalpremkumar.com/muva-industries',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'MUVA Industries | Precision Manufacturing & Engineering Legacy',
    description: 'Precision manufacturing and industrial component fabrication by Babulal Premsons Group.',
    url: 'https://babulalpremkumar.com/muva-industries',
    type: 'website',
  },
};

export default function MuvaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
