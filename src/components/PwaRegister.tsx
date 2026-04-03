'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('PWA SW Registered!', registration.scope);
        })
        .catch((err) => {
          console.error('PWA SW Registration failed:', err);
        });
    }
  }, []);

  return null;
}
