import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quick-Hedge',
    short_name: 'Quick-Hedge',
    description: 'Expert consultancy and educational materials platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f11',
    theme_color: '#6d28d9',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ],
  }
}
