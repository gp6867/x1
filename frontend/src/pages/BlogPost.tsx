import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <button onClick={() => navigate('/blog')} className="text-emerald-600 hover:underline">
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${post.title} — MonsterX AI Blog`}
        description={post.excerpt}
        canonical={`https://www.xoneai.in/blog/${post.slug}`}
        type="article"
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/blog')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Blog
            </button>
            <div className="font-bold text-slate-900 dark:text-white">Article</div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
          {/* Article Header */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 mb-4 uppercase tracking-wider">
              {post.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
            </div>
          </div>

          {/* Article Content (Markdown) */}
          <div className="markdown-content prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* CTA at the end of article */}
          <div className="mt-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">Try MonsterX AI for Free</h3>
            <p className="text-emerald-50 mb-4 text-sm">30 messages/day. No credit card required.</p>
            <button onClick={() => navigate('/chat')} className="bg-white text-emerald-700 px-6 py-2.5 rounded-lg font-bold hover:bg-emerald-50 transition">
              Start Chatting
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
