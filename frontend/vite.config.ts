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
        { path: '/tools/python-error-fixer', tags: { title: 'Fix Python Error with AI — Free Debugger (No Signup)', description: 'Fix Python error with AI instantly. Free online code debugger, no login required.', canonical: 'https://www.xoneai.in/tools/python-error-fixer' } },
        { path: '/tools/regex-generator', tags: { title: 'AI Regex Generator — Create Regex from Plain English', description: 'AI regex generator free. Create complex regex patterns from plain English instantly.', canonical: 'https://www.xoneai.in/tools/regex-generator' } },
        { path: '/tools/code-explainer', tags: { title: 'Free AI Code Explainer — Understand Code Instantly (No Login)', description: 'Free AI code explainer no signup. Understand any code line-by-line instantly.', canonical: 'https://www.xoneai.in/tools/code-explainer' } },
        { path: '/guides/ai-coding-assistants', tags: { title: 'Ultimate Guide to AI Coding Assistants', description: 'Everything you need to know about AI coding assistants in 2026.', canonical: 'https://www.xoneai.in/guides/ai-coding-assistants' } },
        { path: '/compare/monsterx-vs-chatgpt', tags: { title: 'Xoneai vs ChatGPT for Coding (Free Alternative)', description: 'Compare xoneai.in vs ChatGPT. Free alternative with no login and persistent memory.', canonical: 'https://www.xoneai.in/compare/monsterx-vs-chatgpt' } },
        { path: '/alternatives/chatgpt', tags: { title: 'Free ChatGPT Alternatives for Coding (No Login)', description: 'Discover the best free alternative to ChatGPT with no login. Compare xoneai vs Copilot.', canonical: 'https://www.xoneai.in/alternatives/chatgpt' } },
        { path: '/blog', tags: { title: 'Blog — MonsterX AI', description: 'Tutorials and comparisons for MonsterX AI.', canonical: 'https://www.xoneai.in/blog' } },
        { path: '/blog/best-free-ai-tools-for-developers-2027', tags: { title: 'Best Free AI Tools for Developers in 2027', description: 'Discover the best free AI tools for coding and debugging in 2027.', canonical: 'https://www.xoneai.in/blog/best-free-ai-tools-for-developers-2027' } },
        { path: '/blog/best-ai-tools-for-college-students-usa', tags: { title: 'Best AI Tools for College Students (USA)', description: 'Top AI study assistant and coding tools for USA students.', canonical: 'https://www.xoneai.in/blog/best-ai-tools-for-college-students-usa' } },
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
