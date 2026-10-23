import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Sparkles, Brain, Zap, Shield, Code, Search,
  Check, X, Star, MessageSquare, TrendingUp, Clock,
} from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { value: '1000+', label: 'Messages Sent', icon: MessageSquare },
    { value: '<1s', label: 'Avg Response', icon: Zap },
    { value: '24/7', label: 'Always Online', icon: Clock },
    { value: '100%', label: 'Free Forever', icon: Star },
  ];

  const features = [
    { icon: Brain, title: 'Real AI Memory', desc: 'Remembers your name, projects, code, and context across every chat — like talking to the same person.' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Replies in under a second. No more waiting for spinners or reloading the page.' },
    { icon: Code, title: 'Coding Agent', desc: 'Writes, debugs, and explains code in Python, JavaScript, TypeScript, React — any language.' },
    { icon: Search, title: 'Deep Search', desc: 'Multi-source research assistant that summarizes complex topics and cites its reasoning.' },
    { icon: Shield, title: 'Never Down', desc: 'Automatic failover keeps you connected — if one AI is unavailable, another seamlessly takes over.' },
    { icon: Sparkles, title: 'Truly Free', desc: 'No credit card. No hidden fees. No "free trial". Advanced AI for everyone, forever.' },
  ];

  const comparison = [
    { feature: 'Real AI Memory', monsterx: true, chatgpt: true, claude: true },
    { feature: 'Free Forever', monsterx: true, chatgpt: false, claude: false },
    { feature: 'Coding Agent', monsterx: true, chatgpt: true, claude: true },
    { feature: 'Deep Search', monsterx: true, chatgpt: true, claude: false },
    { feature: 'Hinglish Support', monsterx: true, chatgpt: true, claude: false },
    { feature: 'Automatic Failover', monsterx: true, chatgpt: false, claude: false },
    { feature: 'No Credit Card', monsterx: true, chatgpt: false, claude: false },
  ];

  const faqs = [
    { q: 'Is MonsterX AI really free?', a: 'Yes — 100% free, no credit card required. We have premium plans for power users, but core AI chat is free forever.' },
    { q: 'How is MonsterX different from ChatGPT?', a: 'MonsterX AI has real persistent memory that remembers your projects, code, and context across chats. Plus it is completely free and built for speed.' },
    { q: 'Can I use it for coding?', a: 'Absolutely. MonsterX AI has a built-in coding agent that writes, debugs, and explains code in Python, JavaScript, TypeScript, React, and more.' },
    { q: 'Does it remember my previous chats?', a: 'Yes! Our advanced memory system remembers your name, projects, code patterns, and preferences — across all chats, not just one conversation.' },
    { q: 'Is my data safe?', a: 'Yes. Passwords are encrypted, data is transmitted over HTTPS, and we never share your chats with third parties. See our Privacy Policy for full details.' },
    { q: 'Do I need to install anything?', a: 'No. MonsterX AI runs entirely in your browser. Works on desktop, tablet, and mobile — just sign up and start chatting.' },
  ];

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <SEO
        title="MonsterX AI by Xone AI — Free Advanced AI Chat, Coding Agent & Deep Search"
        description="Meet MonsterX AI — advanced AI assistant by Xone AI with real memory, coding agent, and deep search. Free forever, no credit card. ChatGPT & Claude alternative."
        canonical="https://www.xoneai.in/home"
        keywords="MonsterX AI, Xone AI, AI chat, coding agent, deep search, ChatGPT alternative, Claude alternative, free AI assistant"
        schema={faqSchema}
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-3">
              <img src="/favicon-192.png" alt="MonsterX AI logo" className="w-11 h-11 rounded-xl shadow-md" />
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight tracking-tight">MonsterX AI</div>
                <div className="text-xs text-slate-500 font-medium">by Xone AI</div>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link to="/home" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition">Home</Link>
              <Link to="/blog" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition">Blog</Link>
              <Link to="/pricing" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition">Pricing</Link>
              <Link to="/contact" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition">Contact</Link>
            </nav>
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-emerald-600/20"
            >
              Open Chat <ArrowRight size={16} />
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 -z-10"></div>
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-8 shadow-sm">
              <Sparkles size={14} /> Now with real AI memory
            </div>

            <img
              src="/favicon-192.png"
              alt="MonsterX AI"
              className="w-32 h-32 md:w-44 md:h-44 mx-auto rounded-3xl shadow-2xl shadow-emerald-500/30 mb-8 hero-logo"
            />

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.05]">
              Meet <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">MonsterX AI</span>
              <br />
              <span className="text-3xl md:text-4xl font-bold text-slate-600 dark:text-slate-400">by Xone AI</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The advanced AI assistant that <strong className="text-slate-900 dark:text-white">actually remembers you</strong>. Coding agent, deep search, and blazing-fast replies — <strong className="text-emerald-600">free forever</strong>.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/chat')}
                className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-base transition shadow-xl shadow-emerald-600/30 flex items-center gap-2"
              >
                Start Chatting Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-bold text-base hover:border-emerald-500 dark:hover:border-emerald-600 transition"
              >
                View Pricing
              </button>
            </div>

            <div className="flex gap-6 justify-center mt-10 text-sm text-slate-500 flex-wrap font-medium">
              <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-600" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-600" /> AI memory</span>
              <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-600" /> Instant replies</span>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <s.icon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-sm text-slate-500 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Everything you need. <span className="text-emerald-600">Nothing you don't.</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Built from the ground up for developers, students, and creators who want serious AI without the subscription.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="feature-card bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">How we compare</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Honest comparison. No fluff.</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-4 px-6 font-bold text-slate-900 dark:text-white text-sm">Feature</th>
                    <th className="py-4 px-6 font-bold text-emerald-600 text-sm">MonsterX AI</th>
                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm">ChatGPT</th>
                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm">Claude</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="py-4 px-6 text-slate-700 dark:text-slate-300 text-sm font-medium">{row.feature}</td>
                      <td className="py-4 px-6 text-center">
                        {row.monsterx ? <Check size={20} className="text-emerald-600 inline" /> : <X size={20} className="text-slate-300 inline" />}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.chatgpt ? <Check size={20} className="text-slate-400 inline" /> : <X size={20} className="text-slate-300 inline" />}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.claude ? <Check size={20} className="text-slate-400 inline" /> : <X size={20} className="text-slate-300 inline" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Frequently asked questions</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Everything you need to know before you start.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <summary className="cursor-pointer px-6 py-5 font-semibold text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  {faq.q}
                  <span className="text-emerald-600 text-xl group-open:rotate-45 transition">+</span>
                </summary>
                <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
          <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Ready to try the future of AI?</h2>
            <p className="text-lg md:text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
              Join users worldwide who already switched to a smarter, faster, and truly free AI assistant.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-base hover:bg-emerald-50 transition shadow-xl inline-flex items-center gap-2"
            >
              Start Chatting — Free <ArrowRight size={18} />
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;
