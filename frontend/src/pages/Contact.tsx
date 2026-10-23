import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Clock, Shield } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Contact: React.FC = () => {
  const navigate = useNavigate();

  const contactCards = [
    {
      icon: Mail,
      title: 'Email Support',
      email: 'gp686771@gmail.com',
      description: 'We reply within 24 hours',
      gradient: 'from-emerald-500 to-teal-600',
      mailto: 'mailto:gp686771@gmail.com?subject=Support%20Request%20-%20MonsterX%20AI',
    },
    {
      icon: MessageCircle,
      title: 'General Inquiries',
      email: 'hackersamrat29@gmail.com',
      description: 'For business and partnerships',
      gradient: 'from-blue-500 to-indigo-600',
      mailto: 'mailto:hackersamrat29@gmail.com?subject=General%20Inquiry%20-%20MonsterX%20AI',
    },
  ];

  return (
    <>
      <SEO
        title="Contact & Support — MonsterX AI by Xone AI"
        description="Get in touch with Xone AI team. Email support, general inquiries, and business partnerships for MonsterX AI."
        canonical="https://www.xoneai.in/contact"
        keywords="MonsterX AI contact, Xone AI support, AI assistant help, contact AI team"
      />

      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition"
            >
              <ArrowLeft size={18} /> Back to Home
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-4">
              <Mail className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Contact & Support
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Have a question, feedback, or need help? We're here to help you get the most out of MonsterX AI.
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {contactCards.map((card, i) => (
              <a
                key={i}
                href={card.mailto}
                className="group block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} mb-4 shadow-lg`}
                >
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {card.title}
                </h2>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-2 break-all">
                  {card.email}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {card.description}
                </p>
              </a>
            ))}
          </div>

          {/* Additional info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <Clock className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                Fast Response
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Usually within 24 hours on business days
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <Shield className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                Secure & Private
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Your messages are never shared with third parties
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <MessageCircle className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                English & Hindi
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                We support both languages — write in any
              </p>
            </div>
          </div>

          {/* FAQ snippet */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Common Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  How do I reset my password?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Go to the login page and click "Forgot Password". We'll email you an OTP.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  Do you offer refunds?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Please email support for refund requests. We review each case individually.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  Can I delete my account?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Yes — go to Settings → Delete Account. All your data is removed within 30 days.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
