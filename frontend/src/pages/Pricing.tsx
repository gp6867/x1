import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Crown, Zap, Sparkles, Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: ['5 videos', '5 sec', '720p', 'Watermark'],
      icon: Sparkles,
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 399,
      features: ['50 videos', '10 sec', '720p', 'No watermark'],
      icon: Zap,
      popular: true
    },
    {
      id: 'pro_plus',
      name: 'Pro+',
      price: 1999,
      features: ['200 videos', '30 sec', '2K', 'No watermark'],
      icon: Crown,
      popular: false
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: 4999,
      features: ['Unlimited', '60 sec', '4K', 'API access'],
      icon: Crown,
      popular: false
    }
  ];

  // ✅ SAFE PARSER (main fix)
  const parseJSON = async (res: Response) => {
    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid server response");
    }
  };

  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (plan: any) => {
    if (plan.id === 'free') {
      navigate('/chat');
      return;
    }

    setLoading(true);
    setSelectedPlan(plan.id);

    try {
      const orderRes = await fetch('/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ plan: plan.id })
      });

      const orderData = await parseJSON(orderRes);

      if (!orderData) {
        throw new Error("Server not responding");
      }

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData?.message || "Failed to create order");
      }

      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay failed to load");

      const options = {
        key: orderData.key_id,
        amount: orderData.amount * 100,
        currency: orderData.currency || 'INR',
        name: 'XONE AI',
        description: `${plan.name} Plan`,
        order_id: orderData.order_id,

        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                plan: plan.id
              })
            });

            const result = await parseJSON(verifyRes);

            if (verifyRes.ok && result?.success) {
              alert("✅ Payment successful!");
              window.location.reload();
            } else {
              throw new Error(result?.message || "Verification failed");
            }
          } catch (err: any) {
            alert(err.message);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            setSelectedPlan(null);
          }
        },

        theme: {
          color: '#10b981'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Payment failed");
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const currentPlan = user?.plan || 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-10">
      <div className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Choose Your Plan
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Start free, upgrade anytime 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.id;
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg transition hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-emerald-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="text-xs bg-emerald-500 text-white px-2 py-1 rounded mb-2">
                    Popular
                  </div>
                )}

                <Icon className="w-6 h-6 mb-3 text-emerald-500" />

                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-2xl font-bold mt-2">₹{plan.price}</p>

                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={isCurrent || loading}
                  className="mt-5 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  {loading && isSelected
                    ? 'Processing...'
                    : isCurrent
                    ? 'Current Plan'
                    : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/chat')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Chat
          </button>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
