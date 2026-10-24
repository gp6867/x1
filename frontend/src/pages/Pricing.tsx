import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Crown, Zap, Sparkles, Check, Rocket, Clock, X, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [waitlistPlan, setWaitlistPlan] = useState<string | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      tagline: 'Try MonsterX AI — no card needed',
      price: 0,
      priceLabel: 'Free',
      usdHint: '',
      icon: Sparkles,
      popular: false,
      available: true,
      dailyLimit: 20,
      features: [
        '20 messages per day',
        'Groq AI (default model)',
        'Basic memory system',
        'Code blocks + syntax highlighting',
        'Image analysis (limited)',
        'Hinglish support',
      ],
    },
    {
      id: 'starter',
      name: 'Starter',
      tagline: 'For daily users',
      price: 1699,
      priceLabel: '₹1,699',
      usdHint: '~$19 / month',
      icon: Rocket,
      popular: true,
      available: false,
      dailyLimit: 60,
      features: [
        '60 messages per day (1,800/month)',
        'GPT-4o-mini + DeepSeek models',
        'Full memory system',
        'Advanced coding agent',
        'Priority processing',
        'Email support within 24h',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      tagline: 'For power users',
      price: 2599,
      priceLabel: '₹2,599',
      usdHint: '~$29 / month',
      icon: Zap,
      popular: false,
      available: false,
      dailyLimit: 80,
      features: [
        '80 messages per day (2,400/month)',
        '+ Gemini 3.8 Flash access',
        '400 Gemini messages/month',
        'Deep research mode',
        'Priority speed',
        'All Starter features',
      ],
    },
    {
      id: 'ultra',
      name: 'Ultra',
      tagline: 'For professionals',
      price: 3499,
      priceLabel: '₹3,499',
      usdHint: '~$39 / month',
      icon: Crown,
      popular: false,
      available: false,
      dailyLimit: 120,
      features: [
        '120 messages per day (3,600/month)',
        '+ Claude Haiku (unlimited fair use)',
        'Claude Sonnet (150/month)',
        'Best of every AI model',
        'Early access to new features',
        'All Pro features',
      ],
    },
  ];

  const handlePlanClick = (plan: any) => {
    if (plan.id === 'free') {
      navigate('/chat');
      return;
    }
    const stored = localStorage.getItem(`waitlist_${plan.id}`);
    if (stored) {
      alert(`You're already on the ${plan.name} waitlist! We'll notify you at ${stored}.`);
      return;
    }
    setWaitlistPlan(plan.name);
    setWaitlistEmail(user?.email || '');
    setWaitlistSubmitted(false);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim() || !waitlistEmail.includes('@')) {
      alert('Please enter a valid email');
      return;
    }
    const planId = plans.find(p => p.name === waitlistPlan)?.id;
    if (planId) {
      localStorage.setItem(`waitlist_${planId}`, waitlistEmail);
    }
    setWaitlistSubmitted(true);
    setTimeout(() => {
      setWaitlistPlan(null);
      setWaitlistEmail('');
      setWaitlistSubmitted(false);
    }, 2500);
  };

  return (
    <>
      <SEO
        title="Pricing — MonsterX AI by Xone AI"
        description="Simple pricing for MonsterX AI. Free forever plan + upcoming Starter, Pro, and Ultra plans with GPT-4o-mini, DeepSeek, Gemini and Claude access."
        canonical="https://www.xoneai.in/pricing"
        keywords="MonsterX AI pricing, AI chat pricing, free AI, DeepSeek, GPT-4o-mini, Gemini, Claude, ChatGPT alternative price"
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/home')}
              className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm"
            >
              ← Back to Home
            </button>
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              MonsterX AI Pricing
            </h1>
          </div>
        </header>

        <section className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-6">
            <Sparkles size={14} /> Free plan available now
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Simple, honest pricing
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            No hidden caps. No "unlimited then locked out". Just clear daily limits.
            Start free — upgrade when we launch premium plans.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isFree = plan.id === 'free';
              const isComingSoon = !plan.available;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white dark:bg-slate-900 rounded-2xl border-2 p-6 flex flex-col transition ${
                    plan.popular
                      ? 'border-emerald-500 dark:border-emerald-500 shadow-xl shadow-emerald-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  {isComingSoon && (
                    <div className="absolute top-4 right-4 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                      <Clock size={11} /> Soon
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    plan.popular
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                  }`}>
                    <Icon size={22} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {plan.tagline}
                  </p>

                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                        {plan.priceLabel}
                      </span>
                      {!isFree && (
                        <span className="text-sm text-slate-500 dark:text-slate-400">/mo</span>
                      )}
                    </div>
                    {plan.usdHint && (
                      <div className="text-xs text-slate-400 mt-1">{plan.usdHint}</div>
                    )}
                  </div>

                  <button
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition mb-5 ${
                      isFree
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isFree ? 'Start Chatting Free' : 'Join Waitlist'}
                  </button>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-5 mb-4">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                      What's included
                    </div>
                  </div>

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-emerald-600 mb-1">No</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                hidden caps, no "unlimited" tricks
              </div>
            </div>
            <div className="text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-emerald-600 mb-1">₹0</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                to start. Free plan forever, no card required
              </div>
            </div>
            <div className="text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-emerald-600 mb-1">24h</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                email support response time
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-12 pb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-10">
            Pricing FAQ
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is the Free plan really free?',
                a: 'Yes — 20 messages per day, forever, no credit card required. We only ask for your email to create an account.',
              },
              {
                q: 'When will paid plans launch?',
                a: 'We are actively working on premium AI model access. Join the waitlist for your preferred plan and we will email you the moment it goes live.',
              },
              {
                q: 'Can I use paid AI models like GPT-4o or Claude?',
                a: 'Not yet. Once we launch paid plans, you will get access to premium models like DeepSeek, Gemini, GPT-4o-mini and Claude — all in one place, without separate subscriptions.',
              },
              {
                q: 'Will you remove the free plan?',
                a: 'No. The Free plan stays forever. Paid plans are for users who need more messages, faster responses, or premium AI model access.',
              },
              {
                q: 'Do you store my payment details?',
                a: 'Once we launch paid plans, all payments will be processed by Razorpay (PCI-DSS compliant). We never see or store your card details.',
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
              >
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

        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-10 md:p-14 text-center text-white">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-3">
              Start free today
            </h2>
            <p className="text-emerald-50 mb-6 max-w-xl mx-auto">
              Join thousands of users using MonsterX AI for coding, research and everyday questions.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-white text-emerald-700 px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-50 transition"
            >
              Start Chatting Free →
            </button>
          </div>
        </section>

        <Footer />
      </div>

      {waitlistPlan && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !waitlistSubmitted && setWaitlistPlan(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {!waitlistSubmitted && (
              <button
                onClick={() => setWaitlistPlan(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            )}

            {!waitlistSubmitted ? (
              <>
                <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 mx-auto">
                  <Mail className="text-emerald-600" size={26} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
                  Join the {waitlistPlan} Waitlist
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">
                  We'll email you the moment <strong>{waitlistPlan}</strong> launches.
                  No spam — just one email.
                </p>
                <form onSubmit={handleWaitlistSubmit}>
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Notify Me
                  </button>
                </form>
                <p className="text-xs text-slate-400 text-center mt-3">
                  We'll only email you about {waitlistPlan} launch.
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 mx-auto">
                  <Check className="text-emerald-600" size={30} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  You're on the list!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  We'll email <strong>{waitlistEmail}</strong> when {waitlistPlan} launches.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Pricing;
