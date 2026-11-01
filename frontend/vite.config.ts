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
            title: 'MonsterX AI by Xone AI — Advanced AI Chat', 
            description: 'Your AI that actually remembers you. Free AI chat with coding agent and image vision.' 
          },
        },
        {
          path: '/home',
          tags: { 
            title: 'MonsterX AI — AI with Memory & Coding Agent', 
            description: 'Free AI assistant with real persistent memory across chats. No credit card required.' 
          },
        },
        {
          path: '/chat',
          tags: { 
            title: 'Chat with MonsterX AI — Free AI Assistant', 
            description: 'Chat with MonsterX AI. Real memory, coding agent, and image vision. Start free.' 
          },
        },
        {
          path: '/pricing',
          tags: { 
            title: 'Pricing — MonsterX AI', 
            description: 'Simple, honest pricing. Start free with 30 messages a day. Premium plans coming soon.' 
          },
        },
        {
          path: '/blog',
          tags: { 
            title: 'Blog — MonsterX AI', 
            description: 'Tutorials, comparisons, and productivity tips for MonsterX AI.' 
          },
        },
        {
          path: '/compare/monsterx-vs-chatgpt',
          tags: { 
            title: 'MonsterX AI vs ChatGPT: Which is Better in 2026?', 
            description: 'An honest comparison between MonsterX AI and ChatGPT. Compare pricing, memory, and coding capabilities.' 
          },
        },
        {
          path: '/alternatives/chatgpt',
          tags: { 
            title: 'Best ChatGPT Alternatives in 2026: Top 4 Picks', 
            description: 'Looking for a ChatGPT alternative? Compare MonsterX AI, Claude, Gemini, and DeepSeek.' 
          },
        },
        {
          path: '/about',
          tags: { 
            title: 'About Us — MonsterX AI', 
            description: 'Learn about Xone AI, the team behind MonsterX AI — an advanced, memory-powered AI assistant.' 
          },
        },
        {
          path: '/contact',
          tags: { 
            title: 'Contact & Support — MonsterX AI', 
            description: 'Get in touch with the Xone AI team. Email support and business inquiries.' 
          },
        },
        {
          path: '/privacy',
          tags: { 
            title: 'Privacy Policy — MonsterX AI', 
            description: 'Learn how Xone AI collects, uses, and protects your data on MonsterX AI.' 
          },
        },
        {
          path: '/terms',
          tags: { 
            title: 'Terms of Service — MonsterX AI', 
            description: 'Terms of Service for using MonsterX AI by Xone AI.' 
          },
        }
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
