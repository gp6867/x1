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
          tags: { title: 'MonsterX AI by Xone AI — Advanced AI Chat', description: 'Your AI that actually remembers you. Free AI chat with coding agent and image vision.', canonical: 'https://www.xoneai.in/' },
        },
        {
          path: '/home',
          tags: { title: 'MonsterX AI — AI with Memory & Coding Agent', description: 'Free AI assistant with real persistent memory across chats. No credit card required.', canonical: 'https://www.xoneai.in/home' },
        },
        {
          path: '/chat',
          tags: { title: 'Chat with MonsterX AI — Free AI Assistant', description: 'Chat with MonsterX AI. Real memory, coding agent, and image vision. Start free.', canonical: 'https://www.xoneai.in/chat' },
        },
        {
          path: '/login',
          tags: { title: 'Login — MonsterX AI', description: 'Sign in to your MonsterX AI account.', canonical: 'https://www.xoneai.in/login' },
        },
        {
          path: '/register',
          tags: { title: 'Create Account — MonsterX AI', description: 'Create your free MonsterX AI account and start chatting today.', canonical: 'https://www.xoneai.in/register' },
        },
        {
          path: '/pricing',
          tags: { title: 'Pricing — MonsterX AI', description: 'Simple, honest pricing. Start free with 30 messages a day. Premium plans coming soon.', canonical: 'https://www.xoneai.in/pricing' },
        },
        {
          path: '/blog',
          tags: { title: 'Blog — MonsterX AI', description: 'Tutorials, comparisons, and productivity tips for MonsterX AI.', canonical: 'https://www.xoneai.in/blog' },
        },
        {
          path: '/compare/monsterx-vs-chatgpt',
          tags: { title: 'MonsterX AI vs ChatGPT: Which is Better in 2026?', description: 'An honest comparison between MonsterX AI and ChatGPT. Compare pricing, memory, and coding capabilities.', canonical: 'https://www.xoneai.in/compare/monsterx-vs-chatgpt' },
        },
        {
          path: '/alternatives/chatgpt',
          tags: { title: 'Best ChatGPT Alternatives in 2026: Top 4 Picks', description: 'Looking for a ChatGPT alternative? Compare MonsterX AI, Claude, Gemini, and DeepSeek.', canonical: 'https://www.xoneai.in/alternatives/chatgpt' },
        },
        {
          path: '/about',
          tags: { title: 'About Us — MonsterX AI', description: 'Learn about Xone AI, the team behind MonsterX AI.', canonical: 'https://www.xoneai.in/about' },
        },
        {
          path: '/contact',
          tags: { title: 'Contact & Support — MonsterX AI', description: 'Get in touch with the Xone AI team.', canonical: 'https://www.xoneai.in/contact' },
        },
        {
          path: '/privacy',
          tags: { title: 'Privacy Policy — MonsterX AI', description: 'Learn how Xone AI collects, uses, and protects your data.', canonical: 'https://www.xoneai.in/privacy' },
        },
        {
          path: '/terms',
          tags: { title: 'Terms of Service — MonsterX AI', description: 'Terms of Service for using MonsterX AI by Xone AI.', canonical: 'https://www.xoneai.in/terms' },
        }
      ],
      render: (route) => {
        return `<div id="root"><div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,sans-serif;"><p>Loading ${route.path}...</p></div></div>`
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // INP Optimization (Code Splitting)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          markdown: ['react-markdown', 'remark-gfm', 'remark-breaks'],
          syntax: ['react-syntax-highlighter'],
          icons: ['lucide-react'],
        },
      },
    },
  },
})
