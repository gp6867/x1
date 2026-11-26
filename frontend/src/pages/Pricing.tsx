import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Check, Loader } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      priceLabel: '$0',
      usdHint: 'Free forever',
      popular: false,
      features: ['30 messages / day', 'Groq AI model (Llama 3)', 'Basic memory', 'Image vision (limited)'],
    },
    {
      id: 'starter',
      name: 'Starter',
      priceLabel: '$19',
      usdHint: 'billed monthly',
      popular: true,
      features: ['60 messages / day', 'GPT-4o-mini + DeepSeek', 'Full memory system', 'Priority processing'],
    },
    {
      id: 'pro',
      name: 'Pro',
      priceLabel: '$29',
      usdHint: 'billed monthly',
      popular: false,
      features: ['80 messages / day', '+ Gemini 1.5 Flash', 'Deep research mode', 'Priority speed'],
    },
    {
      id: 'ultra',
      name: 'Ultra',
      priceLabel: '$39',
      usdHint: 'billed monthly',
      popular: false,
      features: ['120 messages / day', '+ Claude 3.5 Sonnet', 'Early access features', 'Best for professionals'],
    },
  ];

  const handlePlanClick = async (plan: any) => {
    // 1. Free Plan Logic
    if (plan.id === 'free') {
      if (token) navigate('/chat');
      else navigate('/register');
      return;
    }

    // 2. Paid Plan Logic (Requires Login)
    if (!token) {
      alert("Please log in to upgrade your plan.");
      navigate('/login');
      return;
    }

    // 3. Backend Checkout Call
    setLoadingPlan(plan.id);
    try {
      // Yahan aap apna backend API endpoint dalenge (Razorpay/PhonePe)
      // Example: const response = await axios.post(`${API_URL}/payment/create-checkout`, { plan: plan.id }, { headers: { Authorization: `Bearer ${token}` } });
      
      // Filhal hum ek alert dikha rahe hain kyunki backend connect baaki hai
      await new Promise(resolve => setTimeout(resolve, 1000)); // Fake loading
      alert(`Backend integration pending. You clicked on ${plan.name} plan.`);
      
      // Agar Razorpay URL aata hai:
      // window.location.href = response.data.payment_url;

    } catch (err) {
      alert("Payment gateway error. Please try again later.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <SEO
        title="Pricing — MonsterX AI"
        description="Simple, honest pricing for MonsterX AI. Start free, upgrade to Pro for more AI memory and advanced models."
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
            No hidden caps. Choose the plan that fits your workflow.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className={`relative bg-white dark:bg-slate-900 rounded-2xl border p-6 flex flex-col ${plan.popular ? 'border-emerald-500 shadow-lg' : 'border-slate-200 dark:border-slate-800'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.priceLabel}</span>
                  <span className="text-sm text-slate-500 block mt-1">{plan.usdHint}</span>
                </div>

                <button
                  onClick={() => handlePlanClick(plan)}
                  disabled={loadingPlan === plan.id}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition mb-6 flex items-center justify-center gap-2 ${
                    plan.id === 'free' 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {loadingPlan === plan.id ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    plan.id === 'free' ? 'Start Free' : 'Upgrade Now'
                  )}
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
              { q: 'Can I cancel my subscription anytime?', a: 'Yes. You can cancel your subscription from your account settings at any time.' },
              { q: 'What payment methods do you accept?', a: 'We accept UPI, Credit/Debit Cards, and Net Banking via our secure payment partner.' },
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
    </>
  );
};

export default Pricing;
