export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-use-monsterx-ai-for-coding',
    title: 'How to Use MonsterX AI for Faster Coding',
    excerpt: 'Learn how AI coding assistants can help you write, debug, and explain code faster than ever before.',
    date: '2026-10-20',
    category: 'Tutorial',
    readTime: '5 min read',
  },
  {
    slug: 'chatgpt-vs-claude-vs-monsterx-ai',
    title: 'ChatGPT vs Claude vs MonsterX AI: 2026 Comparison',
    excerpt: 'Which AI assistant is best for coding, research, and everyday tasks? We compare pricing, features, and speed.',
    date: '2026-10-18',
    category: 'Comparison',
    readTime: '8 min read',
  },
  {
    slug: '10-ways-ai-boosts-productivity',
    title: '10 Ways AI Can Boost Your Productivity',
    excerpt: 'From coding to content creation, discover practical ways to leverage AI in your daily workflow.',
    date: '2026-10-15',
    category: 'Productivity',
    readTime: '6 min read',
  },
  {
    slug: 'introducing-ai-memory-monsterx',
    title: 'Introducing AI Memory: MonsterX AI Never Forgets You',
    excerpt: 'Our new memory system remembers your projects, preferences, and context across every conversation.',
    date: '2026-10-12',
    category: 'Announcement',
    readTime: '4 min read',
  },
];
