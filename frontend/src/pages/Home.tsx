import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Code, Search, Check, PenTool, Globe, Image as ImageIcon, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Expanded skills
  const skills = [
    {
      icon: Brain,
      title: 'Real AI Memory',
      desc: 'Remembers your name, projects, code, and context across every chat — not just the last conversation.',
    },
    {
      icon: Code,
      title: 'Coding Agent',
      desc: 'Writes, debugs, and explains code in Python, JavaScript, React, and more. With syntax highlighting and one-click copy.',
    },
    {
      icon: PenTool,
      title: 'Writing & Content',
      desc: 'Drafts emails, blogs, and social posts. Edits for tone, grammar, and clarity in seconds.',
    },
    {
      icon: Globe,
      title: 'Web Design & Dev',
      desc: 'Generates HTML, CSS, and Tailwind layouts. Prototypes UIs and fixes responsive design bugs.',
    },
    {
      icon: Search,
      title: 'Deep Research',
      desc: 'Multi-source search for complex questions. Get thorough answers and summaries, not just links.',
    },
    {
      icon: ImageIcon,
      title: 'Image Vision',
      desc: 'Upload screenshots, charts, or photos. The AI analyzes them and answers questions about what it sees.',
    },
  ];

  return (
    <>
      <SEO
        title="MonsterX AI — Advanced AI Chat, Coding & Writing Assistant"
        description="MonsterX AI is a free AI assistant with real memory, coding agent, web design, writing, and image vision. Built by an indie developer. No credit card required."
        canonical="https://www.xoneai.in/home"
        keywords="AI chat, coding agent, AI memory, free AI, MonsterX AI, Xone AI, AI writing, web design AI"
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
              <Link to="/home" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium">Home</Link>
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

        {/* Hero — Split layout, CSS mockup, no gradients */}
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-3 py-1 rounded-full mb-5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Free · No credit card
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
                Your AI that actually remembers you.
              </h1>

              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-7 leading-relaxed">
                Chat, write, code, design, and research — with persistent memory across every conversation. Built for serious work, free to start.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => navigate('/chat')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  Start Chatting Free <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                >
                  View Pricing
                </button>
              </div>

              <div className="flex flex-wrap gap-5 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-600" /> 30 messages/day free</span>
                <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-600" /> Sign up in 10 seconds</span>
              </div>
            </div>

            {/* Right: Premium CSS Mockup */}
            <div className="relative">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl bg-white dark:bg-slate-900">
                <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="ml-2 text-xs font-medium text-slate-500">MonsterX AI</span>
                </div>
                <div className="p-6 space-y-5">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-emerald-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                      Build a responsive navbar in React with Tailwind
                    </div>
                  </div>
                  {/* AI Message */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={16} className="text-emerald-600" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                        Here is a clean, mobile-friendly navbar component:
                      </p>
                      <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-slate-700">
                        <div className="flex items-center justify-between px-3 py-2 bg-[#2d2d2d] border-b border-slate-700">
                          <span className="text-xs text-slate-400 font-mono">Navbar.tsx</span>
                          <span className="text-[10px] text-slate-500">Copy</span>
                        </div>
                        <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto">
{`export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="text-xl font-bold">Logo</div>
      <div className="hidden md:flex gap-4">
        <a href="#">Home</a>
        <a href="#">About</a>
      </div>
    </nav>
  )
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder story */}
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

        {/* Skills Grid — 6 skills */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Everything you need in one place
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No more switching between ChatGPT, Claude, and specialized tools. MonsterX AI handles it all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((f, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-emerald-300 dark:hover:border-emerald-700 transition group">
                <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center mb-5 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition">
                  <f.icon size={24} className="text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing preview */}
        <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Start free. Upgrade when we launch.
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-lg">
                  30 messages per day, no credit card. Premium plans (Starter, Pro, Ultra) are coming soon —
                  with access to DeepSeek, Gemini, and Claude. Join the waitlist and be first to know.
                </p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition flex items-center gap-2 inline-flex"
                >
                  Explore Plans <ArrowRight size={16} />
                </button>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-8 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/20 dark:shadow-none">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Free Plan</div>
                    <div className="text-4xl font-extrabold text-slate-900 dark:text-white">₹0</div>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                    Active
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-3"><Check size={18} className="text-emerald-600 flex-shrink-0" /> 30 messages per day</li>
                  <li className="flex items-center gap-3"><Check size={18} className="text-emerald-600 flex-shrink-0" /> Real AI memory</li>
                  <li className="flex items-center gap-3"><Check size={18} className="text-emerald-600 flex-shrink-0" /> Coding & writing agent</li>
                  <li className="flex items-center gap-3"><Check size={18} className="text-emerald-600 flex-shrink-0" /> Image vision analysis</li>
                  <li className="flex items-center gap-3"><Check size={18} className="text-emerald-600 flex-shrink-0" /> No credit card needed</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
              Common questions
            </h2>
            <div className="space-y-4">
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
                  className="group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900"
                >
                  <summary className="cursor-pointer px-6 py-5 font-medium text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    {faq.q}
                    <span className="text-slate-400 text-xl group-open:rotate-45 transition">+</span>
                  </summary>
                  <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Simple CTA */}
        <section className="border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to try it?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
              30 free messages per day. No credit card required.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-medium transition inline-flex items-center gap-2 shadow-lg shadow-emerald-600/20 text-lg"
            >
              Start Chatting Free <ArrowRight size={20} />
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;
