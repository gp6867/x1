import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Copy, Check, Code2, Shield, Search } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';
import { regexExamples } from '../data/regexExamples';

const RegexExamplePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  const example = regexExamples.find(e => e.slug === slug);

  if (!example) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Regex example not found</h1>
          <button onClick={() => navigate('/tools/regex-generator')} className="text-emerald-600 hover:underline">
            ← Go to Regex Generator
          </button>
        </div>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(example.pattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: example.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a }
    }))
  };

  return (
    <>
      <SEO
        title={example.metaTitle}
        description={example.metaDescription}
        canonical={`https://www.xoneai.in/regex-examples/${example.slug}`}
        type="article"
        schema={[faqSchema]}
      />

      <div className="h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/tools/regex-generator')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Regex Generator
            </button>
            <button onClick={() => navigate('/chat')} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              Try MonsterX AI →
            </button>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <nav className="mb-6 text-xs text-slate-500 dark:text-slate-500">
            <span>Home</span> / <span>Regex Examples</span> / <span className="text-slate-900 dark:text-white">{example.slug}</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-3">
              <Code2 size={14} /> Regex Pattern
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
              {example.title}
            </h1>
            
            {/* Pattern Box */}
            <div className="bg-slate-900 rounded-xl overflow-hidden mb-4 border border-slate-700">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                <span className="text-xs text-slate-400 font-mono">Regex Pattern</span>
                <button onClick={copyToClipboard} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-4 overflow-x-auto">
                <code className="text-emerald-300 font-mono text-sm whitespace-pre-wrap">{example.pattern}</code>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4 mb-8">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-2">Quick answer</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{example.shortAnswer}</p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">How it works</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{example.explanation}</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Code Examples</h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">✅ Correct Usage</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">{example.goodCode}</pre>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase mb-2">❌ What NOT to do</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">{example.badCode}</pre>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Frequently asked questions</h2>
            <div className="space-y-6">
              {example.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Search size={18} /> Related Search Terms
            </h2>
            <div className="flex flex-wrap gap-2">
              {example.searchKeywords.map((keyword, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs">
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Related Regex Patterns</h2>
            <div className="flex flex-wrap gap-2">
              {example.related.map(relSlug => {
                const rel = regexExamples.find(e => e.slug === relSlug);
                if (!rel) return null;
                return (
                  <button
                    key={relSlug}
                    onClick={() => navigate(`/regex-examples/${relSlug}`)}
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
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Need a custom regex pattern?</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Use the free <button onClick={() => navigate('/tools/regex-generator')} className="text-emerald-600 hover:underline font-semibold">AI Regex Generator</button> to describe what you need in plain English.</p>
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

export default RegexExamplePage;
