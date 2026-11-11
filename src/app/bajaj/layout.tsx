import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premsons Commercial Vehicles | Authorized Bajaj Dealership Ranchi',
  description: 'Authorized Bajaj Commercial 3-Wheeler and Cargo dealership in Ranchi. Explore Bajaj Maxima, Compact RE, passenger and cargo logistics solutions.',
  alternates: {
    canonical: 'https://babulalpremkumar.com/bajaj',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Premsons Commercial Vehicles | Authorized Bajaj Dealership Ranchi',
    description: 'Authorized Bajaj Commercial 3-Wheeler and Cargo dealership in Ranchi.',
    url: 'https://babulalpremkumar.com/bajaj',
    type: 'website',
  },
};

export default function BajajLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
