import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premsons Poddar Trucking | Commercial Logistics Solutions Jharkhand',
  description: 'Premsons Poddar Trucking — Industrial scale fleet logistics, commercial trucking, and regional supply chain transport across Jharkhand and Eastern India.',
  alternates: {
    canonical: 'https://babulalpremkumar.com/trucking',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Premsons Poddar Trucking | Commercial Logistics Solutions Jharkhand',
    description: 'Industrial scale fleet logistics and commercial trucking across Jharkhand.',
    url: 'https://babulalpremkumar.com/trucking',
    type: 'website',
  },
};

export default function TruckingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
