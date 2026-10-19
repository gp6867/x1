import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import prerenderStatic from 'vite-plugin-prerender-static'

export default defineConfig({
  plugins: [
    react(),
    prerenderStatic({
      routes: [
        {
          path: '/',
          tags: {
            title: 'MonsterX AI — Your Intelligent AI Assistant | Xone AI',
            description: 'Meet MonsterX AI, the powerful AI assistant by Xone AI. Chat, generate images, and get instant smart answers — all in one place.',
            canonical: 'https://www.xoneai.in/',
            robots: 'index, follow',
          },
        },
        {
          path: '/login',
          tags: {
            title: 'Login to MonsterX AI | Xone AI',
            description: 'Sign in to your Xone AI account and chat with MonsterX AI — your personal AI assistant.',
            canonical: 'https://www.xoneai.in/login',
            robots: 'noindex, follow',
          },
        },
        {
          path: '/register',
          tags: {
            title: 'Create Your MonsterX AI Account | Xone AI',
            description: 'Create a free Xone AI account and start chatting with MonsterX AI today.',
            canonical: 'https://www.xoneai.in/register',
            robots: 'noindex, follow',
          },
        },
        {
          path: '/pricing',
          tags: {
            title: 'Pricing — MonsterX AI Plans | Xone AI',
            description: 'Choose the perfect MonsterX AI plan for your needs. Flexible pricing for individuals and teams.',
            canonical: 'https://www.xoneai.in/pricing',
            robots: 'index, follow',
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
