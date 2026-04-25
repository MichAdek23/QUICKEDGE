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
        src: '/images/Logo_icon.png',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any'
      },
      {
        src: '/images/Logo_icon.png',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any'
      }
    ],
  }
}
