import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Contact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Contact — MonsterX AI"
        description="Get in touch with the Xone AI team. Email support and business inquiries."
        canonical="https://www.xoneai.in/contact"
      />

      <div className="h-screen overflow-y-auto bg-white dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/home')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Home
            </button>
            <div className="font-bold text-slate-900 dark:text-white">Contact</div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-16 md:py-24">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Get in touch
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We usually reply within 24 hours on business days.
            </p>
          </div>

          <div className="space-y-8">
            {/* Email Support - Monika Pareek */}
            <div className="flex gap-4 items-start p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Email Support</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Technical issues, bugs, and account help.</p>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">Monika Pareek</span>
                  <a href="mailto:gp686771@gmail.com" className="font-medium text-emerald-600 hover:underline">
                    gp686771@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* General Inquiries - Samrat */}
            <div className="flex gap-4 items-start p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white mb-1">General Inquiries</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Business, partnerships, and press.</p>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">Samrat</span>
                  <a href="mailto:hackersamrat29@gmail.com" className="font-medium text-emerald-600 hover:underline">
                    hackersamrat29@gmail.com
                  </a>
                </div>
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
