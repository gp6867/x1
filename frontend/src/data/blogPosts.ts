export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  featured?: boolean;
  author: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'introducing-ai-memory-monsterx',
    title: 'Introducing AI Memory: MonsterX AI Now Remembers You Across Every Chat',
    excerpt: 'Our biggest update yet. MonsterX AI now remembers your name, projects, code patterns, and preferences — across every conversation. No more repeating yourself.',
    date: '2026-10-23',
    category: 'Announcement',
    readTime: '4 min read',
    featured: true,
    author: 'Xone AI Team',
  },
  {
    slug: 'chatgpt-vs-claude-vs-monsterx-ai',
    title: 'ChatGPT vs Claude vs MonsterX AI: An Honest 2026 Comparison',
    excerpt: 'Which AI assistant is actually best for coding, research, and daily work? We compare pricing, memory, speed, and real-world performance.',
    date: '2026-10-20',
    category: 'Comparison',
    readTime: '9 min read',
    author: 'Samrat',
  },
  {
    slug: '10-ways-ai-boosts-productivity',
    title: '10 Ways AI Can Boost Your Productivity (Backed by Real Workflows)',
    excerpt: 'From debugging code to writing content, discover practical AI workflows that save hours every week — no hype, just results.',
    date: '2026-10-18',
    category: 'Productivity',
    readTime: '7 min read',
    author: 'Xone AI Team',
  },
  {
    slug: 'how-to-debug-python-errors-with-ai',
    title: 'How to Debug Python Errors Using AI in 2026',
    excerpt: 'Stop Googling cryptic tracebacks. Learn how MonsterX AI helps you fix Python errors 10x faster with actual examples.',
    date: '2026-10-15',
    category: 'Tutorial',
    readTime: '6 min read',
    author: 'Samrat',
  },
  {
    slug: 'what-is-deep-search-ai',
    title: "What Is Deep Search? AI's Hidden Superpower Explained",
    excerpt: 'Deep search isn\'t just a fancy Google. Here\'s how AI-powered research works — and when you should use it.',
    date: '2026-10-12',
    category: 'Guide',
    readTime: '5 min read',
    author: 'Xone AI Team',
  },
  {
    slug: 'why-we-chose-groq-for-speed',
    title: 'Why We Chose Groq: Building the Fastest AI Assistant in India',
    excerpt: 'A technical deep dive into our infrastructure — how Groq, Gemini, and Supabase combine to power a sub-second AI experience.',
    date: '2026-10-08',
    category: 'Tech',
    readTime: '8 min read',
    author: 'Xone AI Team',
  },
  {
    slug: 'getting-started-monsterx-ai',
    title: 'Getting Started with MonsterX AI: A 5-Minute Guide',
    excerpt: 'New to MonsterX AI? This quick guide walks you through signing up, sending your first message, and unlocking AI memory.',
    date: '2026-10-05',
    category: 'Tutorial',
    readTime: '5 min read',
    author: 'Xone AI Team',
  },
  {
    slug: 'best-free-ai-coding-assistant-2026',
    title: 'The Best Free AI Coding Assistant in 2026 (No Credit Card)',
    excerpt: 'We tested 6 free AI coding tools so you don\'t have to. Here\'s the winner — and why it wins.',
    date: '2026-10-01',
    category: 'Comparison',
    readTime: '10 min read',
    author: 'Samrat',
  },
];
