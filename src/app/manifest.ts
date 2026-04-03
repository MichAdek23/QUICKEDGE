import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quickedge',
    short_name: 'Quickedge',
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
    ],
  }
}
