import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, ArrowRight, Loader, Shield } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';
import axios from 'axios';
import { pythonErrors } from '../data/pythonErrors';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PythonErrorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const error = pythonErrors.find(e => e.slug === slug);

  if (!error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Error page not found</h1>
          <button onClick={() => navigate('/tools/python-error-fixer')} className="text-emerald-600 hover:underline">
            ← Go to Python Fixer
          </button>
        </div>
      </div>
    );
  }

  const handleGetFix = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await axios.post(`${API_URL}/chat/guest`, {
        message: `Fix this Python error and explain briefly:\n\n${error.exactMessage}\n\nContext: ${error.cause}`
      });
      if (response.data.success) {
        setResult(response.data.message);
      }
    } catch (err) {
      setResult('Sorry, the tool is busy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: error.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a }
    }))
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: error.title,
    description: error.shortAnswer,
    step: error.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s
    }))
  };

  return (
    <>
      <SEO
        title={error.metaTitle}
        description={error.metaDescription}
        canonical={`https://www.xoneai.in/python-errors/${error.slug}`}
        type="article"
        schema={[faqSchema, howToSchema]}
      />

      <div className="h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/tools/python-error-fixer')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Python Fixer
            </button>
            <button onClick={() => navigate('/chat')} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              Try MonsterX AI →
            </button>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <nav className="mb-6 text-xs text-slate-500 dark:text-slate-500">
            <span>Home</span> / <span>Python Errors</span> / <span className="text-slate-900 dark:text-white">{error.slug}</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase mb-3">
              <AlertTriangle size={14} /> Python Error
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
              {error.title}
            </h1>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase mb-2">Exact message</p>
              <pre className="text-sm font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">{error.exactMessage}</pre>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 mb-8">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">Quick answer</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{error.shortAnswer}</p>
          </div>

          <div className="mb-8">
            <button
              onClick={handleGetFix}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'Get AI Fix for This Error'} <ArrowRight size={20} />
            </button>
          </div>

          {result && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">AI Suggested Fix</h3>
              <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
              <p className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-500">
                AI suggestions can be wrong. Review and test before applying.
              </p>
            </div>
          )}

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Why this error happens</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{error.cause}</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Example: Wrong vs Right</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-4">
                <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase mb-2">Wrong</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">{error.badCode}</pre>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">Right</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">{error.goodCode}</pre>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How to fix it (step by step)</h2>
            <ol className="space-y-3 text-slate-700 dark:text-slate-300 list-decimal pl-6">
              {error.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Frequently asked questions</h2>
            <div className="space-y-6">
              {error.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Related Python errors</h2>
            <div className="flex flex-wrap gap-2">
              {error.related.map(relSlug => {
                const rel = pythonErrors.find(e => e.slug === relSlug);
                if (!rel) return null;
                return (
                  <button
                    key={relSlug}
                    onClick={() => navigate(`/python-errors/${relSlug}`)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition text-xs font-medium"
                  >
                    {rel.slug}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mb-8 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-start gap-3">
            <Shield size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Need a fix for a different error?</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Use the free <button onClick={() => navigate('/tools/python-error-fixer')} className="text-emerald-600 hover:underline font-semibold">Python Error Fixer</button> to paste any traceback and get an AI-suggested fix in seconds.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center text-white">
            <h3 className="font-bold mb-2">Want an AI with memory for your project?</h3>
            <p className="text-emerald-50 text-sm mb-4">MonsterX AI remembers your codebase across chats.</p>
            <button onClick={() => navigate('/register')} className="bg-white text-emerald-700 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-50 transition">
              Try MonsterX AI Free
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PythonErrorPage;
