import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, ArrowRight, Zap, Brain, Code, Shield } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const CompareChatGPT: React.FC = () => {
  const navigate = useNavigate();

  const faqs = [
    { q: 'Is MonsterX AI really free compared to ChatGPT?', a: 'Yes, MonsterX AI offers a generous free tier with 30 messages per day. ChatGPT requires a $20/month subscription for GPT-4 access.' },
    { q: 'Does ChatGPT have memory like MonsterX AI?', a: 'ChatGPT has a limited memory feature, but MonsterX AI was built from the ground up with persistent, long-term memory across all chats.' },
    { q: 'Can MonsterX AI write code?', a: 'Yes, MonsterX AI has a dedicated coding agent that provides syntax highlighting, copy buttons, and handles complex debugging.' },
    { q: 'Can I switch from ChatGPT to MonsterX AI easily?', a: 'Absolutely. Just create a free account, and you can start chatting immediately. There is no complex setup or migration process.' }
  ];

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };

  return (
    <>
      <SEO
        title="MonsterX AI vs ChatGPT: Which is Better in 2026?"
        description="An honest comparison between MonsterX AI and ChatGPT. Compare pricing, memory, coding capabilities, and features to choose the best AI assistant for you."
        canonical="https://www.xoneai.in/compare/monsterx-vs-chatgpt"
        keywords="MonsterX AI vs ChatGPT, ChatGPT alternative, free ChatGPT, AI with memory"
        schema={faqSchema}
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/home')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Home
            </button>
            <div className="font-bold text-slate-900 dark:text-white">Comparison</div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-16">
          {/* TL;DR Section (Answer First for AI Extraction) */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              MonsterX AI vs ChatGPT
            </h1>
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 mb-12 text-left">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">TL;DR — Quick Verdict</h2>
              <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed mb-4">
                <strong>Choose MonsterX AI if:</strong> You want a free, fast AI with persistent memory across all chats, a dedicated coding agent, and no credit card required.
              </p>
              <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                <strong>Choose ChatGPT if:</strong> You need deep integration with the OpenAI ecosystem, advanced DALL-E image generation, or enterprise-level data compliance.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 mb-16">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900">
                  <th className="p-4 font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">Feature</th>
                  <th className="p-4 font-bold text-emerald-600 border-b border-slate-200 dark:border-slate-800">MonsterX AI</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">ChatGPT</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: 'Free Tier', m: true, c: false, mt: '30 msgs/day', ct: 'Limited GPT-3.5' },
                  { f: 'Persistent Memory', m: true, c: 'Limited', mt: 'Across all chats', ct: 'Beta feature' },
                  { f: 'Coding Agent', m: true, c: true, mt: 'With syntax highlighting', ct: 'Yes' },
                  { f: 'Image Vision', m: true, c: true, mt: 'Upload & analyze', ct: 'Yes' },
                  { f: 'No Credit Card Required', m: true, c: false, mt: 'Sign up in 10s', ct: 'Need card for Plus' },
                  { f: 'Price for Premium', m: 'Coming Soon', c: '$20/mo', mt: 'Affordable', ct: 'ChatGPT Plus' }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{row.f}</td>
                    <td className="p-4 text-emerald-600 font-medium">
                      {typeof row.m === 'boolean' ? (row.m ? <Check size={20} /> : <X size={20} />) : row.mt}
                    </td>
                    <td className="p-4 text-slate-500">
                      {typeof row.c === 'boolean' ? (row.c ? <Check size={20} /> : <X size={20} />) : row.ct}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Where MonsterX Wins */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Where MonsterX AI Wins</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <Brain className="w-8 h-8 text-emerald-600 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">True Persistent Memory</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">MonsterX AI remembers your projects, code, and preferences across every single chat. ChatGPT forgets unless you re-paste the context every time.</p>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <Zap className="w-8 h-8 text-emerald-600 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Free to Start</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Get 30 messages per day for free. No credit card, no trial period. ChatGPT's best model (GPT-4) requires a $20/month subscription.</p>
              </div>
            </div>
          </div>

          {/* Where ChatGPT Wins */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Where ChatGPT Wins</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <Shield className="w-8 h-8 text-slate-500 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Enterprise Ecosystem</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">ChatGPT offers deep integrations with enterprise tools, SOC 2 compliance, and advanced data privacy controls that MonsterX AI is still building.</p>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <Code className="w-8 h-8 text-slate-500 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Image Generation</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">ChatGPT includes DALL-E 3 for high-quality image generation, while MonsterX AI currently focuses on image *analysis* (vision).</p>
              </div>
            </div>
          </div>

          {/* Who Should Choose */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
              <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-4">Choose MonsterX AI if:</h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> You want a free, fast AI assistant</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> You need memory across all chats</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> You want a dedicated coding agent</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-emerald-600 mt-0.5" /> You prefer a simple, indie-built tool</li>
              </ul>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Choose ChatGPT if:</h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2"><Check size={16} className="text-slate-500 mt-0.5" /> You need enterprise-grade compliance</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-slate-500 mt-0.5" /> You need DALL-E image generation</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-slate-500 mt-0.5" /> You are already in the OpenAI ecosystem</li>
                <li className="flex items-start gap-2"><Check size={16} className="text-slate-500 mt-0.5" /> You don't mind paying $20/month</li>
              </ul>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  <summary className="cursor-pointer px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    {faq.q}
                    <span className="text-slate-400 text-xl group-open:rotate-45 transition">+</span>
                  </summary>
                  <div className="px-6 pb-4 text-slate-600 dark:text-slate-400">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-10 border border-emerald-500 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to try MonsterX AI?</h2>
            <p className="text-emerald-50 mb-6">Experience the power of real memory for free. No credit card required.</p>
            <button onClick={() => navigate('/chat')} className="bg-white text-emerald-700 px-8 py-3.5 rounded-xl font-bold transition hover:bg-emerald-50 inline-flex items-center gap-2 shadow-lg">
              Start Chatting Free <ArrowRight size={18} />
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CompareChatGPT;
