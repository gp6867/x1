import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Users, Zap, Heart } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="About Us — MonsterX AI by Xone AI"
        description="Learn about Xone AI, the team behind MonsterX AI — an advanced, memory-powered AI assistant built in India."
        canonical="https://www.xoneai.in/about"
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-900">
        <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition">
              <ArrowLeft size={18} /> Back to Home
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <img src="/favicon-192.png" alt="MonsterX AI" className="w-20 h-20 mx-auto rounded-2xl shadow-lg mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">About MonsterX AI</h1>
            <p className="text-slate-600 dark:text-slate-400">Built by Xone AI — for everyone, everywhere</p>
          </div>

          <div className="space-y-10 text-slate-700 dark:text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Our Mission</h2>
              <p className="leading-relaxed">
                We believe advanced AI should be accessible to everyone — not just those who can afford $20/month subscriptions. MonsterX AI is our answer: a powerful, memory-enabled AI assistant that's <strong className="text-emerald-600">free forever</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">What We Build</h2>
              <p className="leading-relaxed mb-4">
                MonsterX AI combines the speed of Groq with the memory of Claude and the depth of ChatGPT — all in one platform:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Zap className="w-6 h-6 text-emerald-600 mb-2" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Blazing Fast Chat</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Lightning-fast responses in under a second.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Target className="w-6 h-6 text-emerald-600 mb-2" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Real AI Memory</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Remembers your projects, code, and context.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Users className="w-6 h-6 text-emerald-600 mb-2" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Coding Agent</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Writes, debugs, explains code in any language.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Heart className="w-6 h-6 text-emerald-600 mb-2" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Always Free</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No credit card. No hidden fees. Forever.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Our Story</h2>
              <p className="leading-relaxed">
                MonsterX AI started as a side project in 2026 — a frustration with expensive AI subscriptions and limited context windows. We asked: <em>why should great AI cost $20/month?</em> So we built our own. Built with a focus on speed, reliability, and privacy — MonsterX AI is our answer to that question.
              </p>
              <p className="leading-relaxed mt-3">
                Today, MonsterX AI is used by developers, students, and creators across India. And we're just getting started.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Why Choose Us?</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Truly free:</strong> No credit card, no trials, no limits on basic usage.</li>
                <li><strong>Real memory:</strong> Remembers across chats — like talking to the same person.</li>
                <li><strong>Blazing Fast:</strong> Responses in under 1 second — no waiting.</li>
                <li><strong>Global-first:</strong> Hinglish support, secure payments, and strong privacy protection.</li>
                <li><strong>Never down:</strong> Automatic failover keeps you connected — always online.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Get in Touch</h2>
              <p>
                Have a question, feedback, or partnership idea?<br />
                Email: <a href="mailto:hello@xoneai.in" className="text-emerald-600 hover:underline">hello@xoneai.in</a><br />
                Support: <a href="mailto:support@xoneai.in" className="text-emerald-600 hover:underline">support@xoneai.in</a>
              </p>
            </section>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/chat')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Try MonsterX AI Free
            </button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
