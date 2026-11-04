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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Post not found</h1>
          <button onClick={() => navigate('/blog')} className="text-emerald-600 hover:underline">
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // ✅ Claude/ChatGPT Level: BlogPosting Schema for AI Search
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://www.xoneai.in/about'
    },
    publisher: {
      '@type': 'Organization',
      name: 'MonsterX AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.xoneai.in/favicon-512.png'
      }
    },
    datePublished: post.date,
    dateModified: post.date, // Future updates ke liye
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.xoneai.in/blog/${post.slug}`
    },
    image: 'https://www.xoneai.in/og-image.png'
  };

  return (
    <>
      <SEO
        title={`${post.title} — MonsterX AI Blog`}
        description={post.excerpt}
        canonical={`https://www.xoneai.in/blog/${post.slug}`}
        type="article"
        schema={articleSchema} // ✅ Schema passed to Helmet
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
          <div className="mb-10 text-center border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 mb-4 uppercase tracking-wider">
              {post.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
            </div>
          </div>

          {/* Article Content (React Markdown with Tailwind Components) */}
          <div className="text-base">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-slate-900 dark:text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-6 mb-3 text-slate-900 dark:text-white" {...props} />,
                p: ({node, ...props}) => <p className="mb-5 leading-relaxed text-slate-700 dark:text-slate-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-5 text-slate-700 dark:text-slate-300 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-5 text-slate-700 dark:text-slate-300 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="pl-1 leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-6 italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-r-lg" {...props} />,
                a: ({node, ...props}) => <a className="text-emerald-600 hover:underline font-medium" {...props} />,
                code: ({node, ...props}) => <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-600 dark:text-emerald-400" {...props} />
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* CTA at the end of article */}
          <div className="mt-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white shadow-xl">
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
