import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Babulal Premkumar Group Headquarters Ranchi',
  description: 'Get in touch with Babulal Premkumar Group. Visit our headquarters at Upper Bazar, Ranchi, Jharkhand or reach out for wholesale and business inquiries.',
  alternates: {
    canonical: 'https://babulalpremkumar.com/contact',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Contact Us | Babulal Premkumar Group Headquarters Ranchi',
    description: 'Get in touch with Babulal Premkumar Group in Ranchi, Jharkhand.',
    url: 'https://babulalpremkumar.com/contact',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
