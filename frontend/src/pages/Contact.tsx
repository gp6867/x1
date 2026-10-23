import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Clock, Shield, Zap, Users, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Contact: React.FC = () => {
  const navigate = useNavigate();

  const contactCards = [
    {
      icon: Mail,
      title: 'Email Support',
      email: 'gp686771@gmail.com',
      description: 'Technical issues, bugs, and account help',
      responseTime: 'We reply within 24 hours',
      gradient: 'from-emerald-500 to-teal-600',
      subject: 'Support%20Request%20-%20MonsterX%20AI',
    },
    {
      icon: MessageCircle,
      title: 'General Inquiries',
      email: 'hackersamrat29@gmail.com',
      description: 'Business, partnerships, and press',
      responseTime: 'Response within 2 business days',
      gradient: 'from-blue-500 to-indigo-600',
      subject: 'General%20Inquiry%20-%20MonsterX%20AI',
    },
  ];

  const faqs = [
    { q: 'How do I reset my password?', a: 'Go to the login page and click "Forgot Password". We will email you a 6-digit OTP within seconds.' },
    { q: 'Do you offer refunds?', a: 'Please email support for refund requests. We review each case individually within 3 business days.' },
    { q: 'Can I delete my account?', a: 'Yes — go to Settings → Delete Account. All your data is permanently removed within 30 days.' },
    { q: 'Is my data safe with MonsterX AI?', a: 'Absolutely. Passwords are encrypted, data is transmitted over HTTPS, and we never share your chats with third parties.' },
    { q: 'Why is my AI response slow?', a: 'If the server was sleeping (Render free tier), the first message may take 30-60 seconds. Subsequent messages are instant.' },
    { q: 'Do you support Hindi?', a: 'Yes! MonsterX AI understands English, Hindi, and Hinglish. Just type in whatever language you prefer.' },
  ];

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <SEO
        title="Contact & Support — MonsterX AI by Xone AI"
        description="Get in touch with Xone AI team. Email support, general inquiries, and business partnerships for MonsterX AI. We reply within 24 hours."
        canonical="https://www.xoneai.in/contact"
        keywords="MonsterX AI contact, Xone AI support, AI assistant help, contact AI team"
        schema={faqSchema}
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium"
            >
              <ArrowLeft size={18} /> Back to Home
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-6">
              <Mail className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Contact & Support
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Have a question, feedback, or need help? We're here. Real humans, real replies.
            </p>
          </div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {contactCards.map((card, i) => (
              <a
                key={i}
                href={`mailto:${card.email}?subject=${card.subject}`}
                className="group block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-2xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} mb-5 shadow-lg`}>
                  <card.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {card.title}
                </h2>
                <p className="text-base text-slate-600 dark:text-slate-400 mb-4">
                  {card.description}
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg mb-2 break-all">
                  {card.email}
                </p>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Clock size={14} /> {card.responseTime}
                </p>
              </a>
            ))}
          </div>

          {/* Value props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <Zap className="w-7 h-7 text-emerald-600 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Fast Response</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Usually within 24 hours on business days</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <Shield className="w-7 h-7 text-emerald-600 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Secure & Private</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your messages are never shared with third parties</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <Users className="w-7 h-7 text-emerald-600 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">English & Hindi</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">We support both languages — write in any</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-8">
              Common Questions
            </h2>
            <div className="space-y-3 max-w-3xl mx-auto">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <summary className="cursor-pointer px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    {faq.q}
                    <ChevronDown size={18} className="text-emerald-600 group-open:rotate-180 transition" />
                  </summary>
                  <div className="px-6 pb-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
