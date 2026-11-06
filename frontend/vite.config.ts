import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import prerenderStatic from 'vite-plugin-prerender-static'

export default defineConfig({
  plugins: [
    react(),
    prerenderStatic({
      routes: [
        { path: '/', tags: { title: 'MonsterX AI by Xone AI — Advanced AI Chat', description: 'Your AI that actually remembers you. Free AI chat with coding agent and image vision.', canonical: 'https://www.xoneai.in/' } },
        { path: '/home', tags: { title: 'MonsterX AI — AI with Memory & Coding Agent', description: 'Free AI assistant with real persistent memory across chats. No credit card required.', canonical: 'https://www.xoneai.in/home' } },
        { path: '/chat', tags: { title: 'Chat with MonsterX AI — Free AI Assistant', description: 'Chat with MonsterX AI. Real memory, coding agent, and image vision. Start free.', canonical: 'https://www.xoneai.in/chat' } },
        { path: '/tools/python-error-fixer', tags: { title: 'Free Python Error Fixer — MonsterX AI', description: 'Paste your Python error and get an instant fix. Free AI-powered Python debugger.', canonical: 'https://www.xoneai.in/tools/python-error-fixer' } },
        { path: '/tools/regex-generator', tags: { title: 'Free AI Regex Generator — MonsterX AI', description: 'Generate Regex from plain English instantly.', canonical: 'https://www.xoneai.in/tools/regex-generator' } },
        { path: '/guides/ai-coding-assistants', tags: { title: 'Ultimate Guide to AI Coding Assistants', description: 'Everything you need to know about AI coding assistants in 2026.', canonical: 'https://www.xoneai.in/guides/ai-coding-assistants' } },
        { path: '/compare/monsterx-vs-chatgpt', tags: { title: 'MonsterX AI vs ChatGPT', description: 'Honest comparison between MonsterX AI and ChatGPT.', canonical: 'https://www.xoneai.in/compare/monsterx-vs-chatgpt' } },
        { path: '/alternatives/chatgpt', tags: { title: 'Best ChatGPT Alternatives', description: 'Top alternatives to ChatGPT for coding and research.', canonical: 'https://www.xoneai.in/alternatives/chatgpt' } },
        { path: '/blog', tags: { title: 'Blog — MonsterX AI', description: 'Tutorials and comparisons for MonsterX AI.', canonical: 'https://www.xoneai.in/blog' } },
        { path: '/pricing', tags: { title: 'Pricing — MonsterX AI', description: 'Simple, honest pricing. Start free.', canonical: 'https://www.xoneai.in/pricing' } },
        { path: '/about', tags: { title: 'About Us — MonsterX AI', description: 'Learn about Xone AI, the team behind MonsterX AI.', canonical: 'https://www.xoneai.in/about' } },
        { path: '/contact', tags: { title: 'Contact — MonsterX AI', description: 'Get in touch with the Xone AI team.', canonical: 'https://www.xoneai.in/contact' } },
      ],
      render: (route) => `<div id="root"><div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;"><h1>${route.path}</h1></div></div>`,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
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
