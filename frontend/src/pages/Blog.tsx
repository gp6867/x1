import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Blog: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Blog — MonsterX AI by Xone AI"
        description="Tutorials, comparisons, and productivity tips for MonsterX AI — the advanced AI assistant by Xone AI."
        canonical="https://www.xoneai.in/blog"
        keywords="MonsterX AI blog, AI tutorials, coding with AI, ChatGPT vs Claude, AI productivity"
      />

      <div className="h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition"
            >
              <ArrowLeft size={18} /> Back to Home
            </button>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white">MonsterX AI Blog</h1>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Insights & Tutorials
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Learn how to get the most out of MonsterX AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-600 transition cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold mb-2">
                  <Tag size={12} /> {post.category}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
