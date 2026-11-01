import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Blog: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Blog — MonsterX AI"
        description="Tutorials, comparisons, and productivity tips for MonsterX AI."
        canonical="https://www.xoneai.in/blog"
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/home')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Home
            </button>
            <div className="font-bold text-slate-900 dark:text-white">Blog</div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
          <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              MonsterX AI Blog
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Thoughts on AI, coding, and building a product in public.
            </p>
          </div>

          <div className="space-y-10">
            {blogPosts.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.slug} className="block group">
                <article className="cursor-pointer">
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mb-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="text-emerald-600">{post.category}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 transition">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {post.excerpt}
                  </p>
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
