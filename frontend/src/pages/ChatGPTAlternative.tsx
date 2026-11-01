import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ArrowRight, Star, Zap, Brain } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const ChatGPTAlternative: React.FC = () => {
  const navigate = useNavigate();

  const alternatives = [
    {
      name: 'MonsterX AI',
      tagline: 'Best for free memory & coding',
      description: 'A free AI assistant with persistent memory, a coding agent, and image vision. Built by an indie developer. No credit card required.',
      pros: ['Free tier with 30 messages/day', 'Persistent memory across all chats', 'Dedicated coding agent', 'Image analysis'],
      cons: ['Newer platform (less established)', 'No DALL-E image generation'],
      isTop: true
    },
    {
      name: 'Claude',
      tagline: 'Best for long context',
      description: 'Anthropic\'s AI assistant, excellent for long documents and nuanced reasoning.',
      pros: ['200K context window', 'Strong reasoning', 'Good for writers'],
      cons: ['Requires $20/month for Pro', 'Strict usage limits on free tier'],
      isTop: false
    },
    {
      name: 'Gemini',
      tagline: 'Best for Google integration',
      description: 'Google\'s AI assistant, deeply integrated with Google Workspace.',
      pros: ['Google Workspace integration', 'Free tier available', 'Fast responses'],
      cons: ['Memory is limited', 'Less capable for complex coding'],
      isTop: false
    },
    {
      name: 'DeepSeek',
      tagline: 'Best for coding',
      description: 'A coding-focused AI assistant with strong debugging capabilities.',
      pros: ['Excellent for code', 'Very cheap API', 'Fast'],
      cons: ['Less conversational', 'Limited memory'],
      isTop: false
    }
  ];

  return (
    <>
      <SEO
        title="Best ChatGPT Alternatives in 2026: Top 4 Picks"
        description="Looking for a ChatGPT alternative? Compare MonsterX AI, Claude, Gemini, and DeepSeek. Find the best free AI assistant for coding, writing, and everyday tasks."
        canonical="https://www.xoneai.in/alternatives/chatgpt"
        keywords="ChatGPT alternatives, best ChatGPT alternative 2026, free AI assistant, MonsterX AI vs ChatGPT"
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/home')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Home
            </button>
            <div className="font-bold text-slate-900 dark:text-white">Alternatives</div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              Best ChatGPT Alternatives in 2026
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              ChatGPT is a great tool, but it's not perfect for everyone. Here are the top alternatives that offer free plans, better memory, or specialized coding capabilities.
            </p>
          </div>

          <div className="space-y-8 mb-16">
            {alternatives.map((alt, i) => (
              <div key={i} className={`border rounded-2xl overflow-hidden ${alt.isTop ? 'border-emerald-500 shadow-xl relative' : 'border-slate-200 dark:border-slate-800'}`}>
                {alt.isTop && (
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg flex items-center gap-1">
                    <Star size={12} fill="currentColor" /> Top Pick
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{alt.name}</h2>
                      <p className="text-sm font-medium text-emerald-600">{alt.tagline}</p>
                    </div>
                    {alt.isTop && (
                      <button onClick={() => navigate('/chat')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition inline-flex items-center gap-2">
                        Try for Free <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-6">{alt.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Check size={16} className="text-emerald-600" /> Pros
                      </h3>
                      <ul className="space-y-2">
                        {alt.pros.map((pro, j) => (
                          <li key={j} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">•</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <X size={16} className="text-red-400" /> Cons
                      </h3>
                      <ul className="space-y-2">
                        {alt.cons.map((con, j) => (
                          <li key={j} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                            <span className="text-red-400 mt-0.5">•</span> {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Why MonsterX is different */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Why MonsterX AI is different</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Brain className="w-8 h-8 text-emerald-600 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Real Memory</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">It remembers your projects, code, and preferences across every chat — something ChatGPT only partially does.</p>
              </div>
              <div>
                <Zap className="w-8 h-8 text-emerald-600 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Truly Free</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">30 messages per day, no credit card. ChatGPT requires $20/month for the best experience.</p>
              </div>
              <div>
                <Check className="w-8 h-8 text-emerald-600 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Built for Developers</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">A dedicated coding agent with syntax highlighting, copy buttons, and debugging support.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button onClick={() => navigate('/chat')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg shadow-emerald-600/20 inline-flex items-center gap-2 text-lg">
              Start Chatting Free <ArrowRight size={20} />
            </button>
            <p className="text-sm text-slate-500 mt-3">No credit card required. 30 free messages per day.</p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ChatGPTAlternative;
