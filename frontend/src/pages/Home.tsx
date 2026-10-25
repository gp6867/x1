import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Code, Search, Check } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Real memory',
      desc: 'Remembers your projects, code, and preferences across every chat. Not just the last conversation — all of them.',
    },
    {
      icon: Code,
      title: 'Coding agent',
      desc: 'Writes, debugs, and explains code in any language. With syntax highlighting and one-click copy.',
    },
    {
      icon: Search,
      title: 'Deep search',
      desc: 'Multi-source research for complex questions. Get thorough answers, not just quick replies.',
    },
  ];

  return (
    <>
      <SEO
        title="MonsterX AI — AI chat with memory, coding, and image vision"
        description="Free AI assistant with persistent memory, coding agent, and image analysis. Built by an indie developer. No credit card needed."
        canonical="https://www.xoneai.in/home"
        keywords="AI chat, coding agent, AI memory, free AI, MonsterX AI, Xone AI"
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-2.5">
              <img src="/favicon-192.png" alt="MonsterX AI" className="w-9 h-9 rounded-lg" />
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm leading-tight">MonsterX AI</div>
                <div className="text-xs text-slate-500 leading-tight">by Xone AI</div>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/home" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition">Home</Link>
              <Link to="/blog" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition">Blog</Link>
              <Link to="/pricing" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition">Pricing</Link>
              <Link to="/contact" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition">Contact</Link>
            </nav>
            <button
              onClick={() => navigate('/chat')}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition"
            >
              Open Chat
            </button>
          </div>
        </header>

        {/* Hero — Split layout, no big text, no gradients */}
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-3 py-1 rounded-full mb-5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Free · No credit card
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                Your AI that remembers.
              </h1>

              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-7 leading-relaxed">
                Chat, code, and analyze images — with memory that persists across every conversation. Free to start.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => navigate('/chat')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition flex items-center gap-2"
                >
                  Start chatting <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                >
                  View pricing
                </button>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> 30 free messages/day</span>
                <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> No signup required to try</span>
              </div>
            </div>

            {/* Right: Real Screenshot */}
            <div className="relative">
              <img
                src="/chat-screenshot.jpg"
                alt="MonsterX AI Chat Interface"
                className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl w-full"
              />
              <p className="text-xs text-slate-400 text-center mt-3">Actual chat from MonsterX AI</p>
            </div>
          </div>
        </section>

        {/* Founder story — human touch */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-6 py-10 md:py-14">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 text-2xl">
                👨‍💻
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Built by an indie developer, not a corporation
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  I'm Samrat, a solo developer from India. I was tired of paying $20/month for AI tools
                  that forget everything after each chat. So I built my own — with real memory, honest pricing,
                  and no "unlimited then locked out" tricks. It's early days, and I'm building this in public.
                  Your feedback shapes what comes next.
                </p>
                <a
                  href="mailto:hackersamrat29@gmail.com"
                  className="inline-block mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Say hi → hackersamrat29@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features — 3 not 6 */}
        <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              What it actually does
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Three things, done well. No feature bloat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-slate-300 dark:hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing preview — simple */}
        <section className="border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  Start free. Upgrade when we launch.
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                  30 messages per day, no credit card. Premium plans (Starter, Pro, Ultra) are coming soon —
                  with access to DeepSeek, Gemini, and Claude. Join the waitlist and be first to know.
                </p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition"
                >
                  See plans →
                </button>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-slate-500">Free plan</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">₹0</div>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-2 py-1 rounded">
                    Active now
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> 30 messages per day</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Memory across chats</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Image analysis</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> No credit card needed</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — 3 only */}
        <section className="border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Common questions
            </h2>
            <div className="space-y-3">
              {[
                {
                  q: 'Is it really free?',
                  a: 'Yes — 30 messages per day, forever. No credit card, no trial period. Premium plans will launch later for power users who need more.',
                },
                {
                  q: 'How is this different from ChatGPT?',
                  a: 'MonsterX has persistent memory across every conversation (ChatGPT forgets unless you re-paste context). Plus it is built by an indie team, not a $100B company — so we can be honest about limits.',
                },
                {
                  q: 'Do you store my chats?',
                  a: 'Chats are stored securely in your account so you can return to them. We never train models on your data, and we do not share it with third parties. Read our Privacy Policy for details.',
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
                >
                  <summary className="cursor-pointer px-5 py-4 font-medium text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition text-sm">
                    {faq.q}
                    <span className="text-slate-400 text-lg group-open:rotate-45 transition">+</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Simple CTA */}
        <section className="border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-6 py-14 md:py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Ready to try it?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              30 free messages per day. No signup form to see the chat — just start.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition inline-flex items-center gap-2"
            >
              Start chatting <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;
