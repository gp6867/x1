import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(blogPosts.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const featured = blogPosts.find((p) => p.featured);
  const others = blogPosts.filter((p) => !p.featured);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return others;
    return others.filter((p) => p.category === activeCategory);
  }, [activeCategory, others]);

  const blogSchema = {
    '@type': 'Blog',
    name: 'MonsterX AI Blog',
    description: 'Tutorials, comparisons, and productivity tips for MonsterX AI by Xone AI.',
    url: 'https://www.xoneai.in/blog',
    publisher: { '@id': 'https://www.xoneai.in/#organization' },
    blogPost: blogPosts.slice(0, 5).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: { '@type': 'Person', name: post.author },
      url: `https://www.xoneai.in/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <SEO
        title="Blog — MonsterX AI by Xone AI | AI Tutorials & Comparisons"
        description="Tutorials, comparisons, and productivity tips for MonsterX AI — the advanced AI assistant by Xone AI. Learn to use AI for coding, research, and daily work."
        canonical="https://www.xoneai.in/blog"
        keywords="MonsterX AI blog, AI tutorials, coding with AI, ChatGPT vs Claude, AI productivity, free AI assistant"
        schema={blogSchema}
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium"
            >
              <ArrowLeft size={18} /> Back to Home
            </button>
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">MonsterX AI Blog</h1>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Insights & Tutorials
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Learn how to get the most out of MonsterX AI — from coding tricks to productivity workflows.
            </p>
          </div>

          {/* Featured */}
          {featured && (
            <div className="mb-16">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 md:p-12">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                  <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-full">FEATURED</span>
                  <span className="flex items-center gap-1"><Tag size={12} /> {featured.category}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                  {featured.title}
                </h2>
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 max-w-3xl leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1.5"><User size={14} /> {featured.author}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {featured.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {featured.readTime}</span>
                </div>
              </div>
            </div>
          )}

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((post) => (
              <article
                key={post.slug}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-3">
                  <Tag size={12} /> {post.category}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              No posts in this category yet.
            </div>
          )}

          {/* CTA */}
          <div className="mt-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-12 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Ready to try MonsterX AI?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Free forever. No credit card. Start chatting in seconds.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg shadow-emerald-600/30"
            >
              Start Chatting Free
            </button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
