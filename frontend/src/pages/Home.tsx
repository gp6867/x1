import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Brain, Zap, Shield, Code, Search } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Brain, title: 'AI Memory', desc: 'Never forgets you — remembers your projects, code, and business context across chats.' },
    { icon: Zap, title: 'Blazing Fast', desc: 'Powered by Groq inference — responses in under a second, always.' },
    { icon: Code, title: 'Coding Agent', desc: 'Writes, debugs, and explains code in Python, JavaScript, TypeScript, and more.' },
    { icon: Search, title: 'Deep Search', desc: 'Multi-source research assistant for complex questions and projects.' },
    { icon: Shield, title: 'Always Online', desc: 'Groq primary with Gemini auto-fallback — never down, never slow.' },
    { icon: Sparkles, title: 'Truly Free', desc: 'No credit card. No hidden fees. Advanced AI available to everyone.' },
  ];

  return (
    <>
      <SEO
        title="MonsterX AI by Xone AI — Advanced AI Chat, Coding Agent & Deep Search"
        description="Meet MonsterX AI — the powerful AI assistant by Xone AI with real memory, coding agent, and deep search. Free forever. ChatGPT & Claude alternative."
        canonical="https://www.xoneai.in/home"
        keywords="MonsterX AI, Xone AI, AI chat, coding agent, deep search, ChatGPT alternative, Claude alternative"
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-3">
              <img src="/favicon-192.png" alt="MonsterX AI" className="w-10 h-10 rounded-lg" />
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-lg leading-tight">MonsterX AI</div>
                <div className="text-xs text-slate-500">by Xone AI</div>
              </div>
            </Link>
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Open Chat <ArrowRight size={16} />
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <img src="/favicon-192.png" alt="MonsterX AI Logo" className="w-24 h-24 mx-auto rounded-2xl shadow-lg mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            MonsterX AI <span className="text-emerald-600">by Xone AI</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Advanced AI chat, coding agent & deep search — with real memory that remembers you. Free forever.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate('/chat')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Start Chatting Free
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              View Pricing
            </button>
          </div>
          <div className="flex gap-6 justify-center mt-8 text-sm text-slate-500 flex-wrap">
            <span>✓ No credit card</span>
            <span>✓ AI memory</span>
            <span>✓ Instant replies</span>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">
            Why choose MonsterX AI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition"
              >
                <f.icon className="w-8 h-8 text-emerald-600 mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;
