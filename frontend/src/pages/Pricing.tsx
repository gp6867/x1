import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Check, X, Mail } from 'lucide-react';
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
      priceLabel: '$0',
      usdHint: 'Free forever',
      available: true,
      features: ['30 messages / day', 'Groq AI model', 'Basic memory', 'Image vision (limited)'],
    },
    {
      id: 'starter',
      name: 'Starter',
      priceLabel: '$19',
      usdHint: 'billed monthly',
      available: false,
      popular: true,
      features: ['60 messages / day', 'GPT-4o-mini + DeepSeek', 'Full memory system', 'Priority processing'],
    },
    {
      id: 'pro',
      name: 'Pro',
      priceLabel: '$29',
      usdHint: 'billed monthly',
      available: false,
      features: ['80 messages / day', '+ Gemini 3.8 Flash', 'Deep research mode', 'Priority speed'],
    },
    {
      id: 'ultra',
      name: 'Ultra',
      priceLabel: '$39',
      usdHint: 'billed monthly',
      available: false,
      features: ['120 messages / day', '+ Claude 3.5 Sonnet', 'Early access features', 'Best for professionals'],
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
    if (!waitlistEmail.trim() || !waitlistEmail.includes('@')) return;
    const planId = plans.find(p => p.name === waitlistPlan)?.id;
    if (planId) localStorage.setItem(`waitlist_${planId}`, waitlistEmail);
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
        title="Pricing — MonsterX AI"
        description="Simple, honest pricing for MonsterX AI. Free forever plan with premium plans coming soon."
        canonical="https://www.xoneai.in/pricing"
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/home')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm">
              ← Back to Home
            </button>
            <div className="font-bold text-slate-900 dark:text-white">Pricing</div>
          </div>
        </header>

        <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Simple, honest pricing.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            No hidden caps. Start free, upgrade when premium plans launch.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className={`relative bg-white dark:bg-slate-900 rounded-2xl border p-6 flex flex-col ${plan.popular ? 'border-emerald-500 shadow-lg' : 'border-slate-200 dark:border-slate-800'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    Recommended
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.priceLabel}</span>
                  <span className="text-sm text-slate-500 block mt-1">{plan.usdHint}</span>
                </div>

                <button
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition mb-6 ${plan.available ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
                >
                  {plan.available ? 'Start Free' : 'Join Waitlist'}
                </button>

                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">Pricing FAQ</h2>
          <div className="space-y-4">
            {[
              { q: 'Is the Free plan really free?', a: 'Yes — 30 messages per day, forever, no credit card required.' },
              { q: 'When will paid plans launch?', a: 'Soon. Join the waitlist and we will email you the moment they are live.' },
              { q: 'Will you remove the free plan?', a: 'No. The Free plan stays forever. Paid plans are for users who need more.' },
            ].map((faq, i) => (
              <details key={i} className="group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                <summary className="cursor-pointer px-5 py-4 font-medium text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  {faq.q}
                  <span className="text-slate-400 text-lg group-open:rotate-45 transition">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        <Footer />
      </div>

      {waitlistPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !waitlistSubmitted && setWaitlistPlan(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 relative border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
            {!waitlistSubmitted && (
              <button onClick={() => setWaitlistPlan(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            )}
            {!waitlistSubmitted ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Mail className="text-slate-700 dark:text-slate-300" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Join {waitlistPlan} Waitlist</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">We'll email you when it launches.</p>
                <form onSubmit={handleWaitlistSubmit}>
                  <input type="email" value={waitlistEmail} onChange={(e) => setWaitlistEmail(e.target.value)} placeholder="you@example.com" required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent mb-3 text-sm focus:outline-none focus:border-emerald-500" />
                  <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 transition">Notify Me</button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">You're on the list!</h3>
                <p className="text-sm text-slate-500">We'll email you at {waitlistEmail}.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Pricing;
