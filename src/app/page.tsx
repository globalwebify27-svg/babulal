// Server Component Wrapper
// Forces the homepage to never be cached (like /textiles, /honda).
// The old "use client" page was being cached by Hostinger's CDN
// with stale CSS file hashes from the broken build.
export const revalidate = 60;

import HomeClient from './HomeClient';

export default function HomePage() {
  return <HomeClient />;
}
