import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const PillarGuide: React.FC = () => {
  const navigate = useNavigate();

  const clusters = [
    { title: 'MonsterX AI vs ChatGPT (Honest Comparison)', path: '/compare/monsterx-vs-chatgpt', desc: 'A detailed look at pricing, memory, and coding capabilities.' },
    { title: 'Best ChatGPT Alternatives in 2026', path: '/alternatives/chatgpt', desc: 'Top 4 alternatives for coding, writing, and research.' },
    { title: 'How to Use AI for Python Debugging', path: '/blog/how-to-use-ai-for-python-debugging', desc: 'Step-by-step guide to fix errors in seconds.' },
    { title: 'Why AI Needs Persistent Memory', path: '/blog/why-ai-needs-memory', desc: 'The future of personalized AI assistants.' },
    { title: 'Best Free AI Tools for Students', path: '/blog/best-free-ai-tools-for-students', desc: 'Top free tools for learning and coding.' }
  ];

  return (
    <>
      <SEO
        title="The Ultimate Guide to AI Coding Assistants (2026) — Xone AI"
        description="Everything you need to know about AI coding assistants in 2026. Compare tools, learn debugging, and discover why memory matters. By Xone AI."
        canonical="https://www.xoneai.in/guides/ai-coding-assistants"
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/home')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Home
            </button>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><BookOpen size={18} /> Guide</div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-12 text-center border-b border-slate-200 dark:border-slate-800 pb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
              The Ultimate Guide to AI Coding Assistants (2026)
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to choose the right AI, fix code faster, and understand why memory is the future of AI. Curated by Xone AI.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Table of Contents</h2>
            {clusters.map((c, i) => (
              <Link to={c.path} key={i} className="block p-6 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-500 transition group bg-white dark:bg-slate-900">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition mb-2">{c.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{c.desc}</p>
                  </div>
                  <ChevronRight className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PillarGuide;
