import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Terms of Service — MonsterX AI by Xone AI"
        description="Terms of Service for using MonsterX AI by Xone AI."
        canonical="https://www.xoneai.in/terms"
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Terms of Service</h1>
          <p className="text-sm text-slate-500 mb-8">Last updated: October 23, 2026</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using MonsterX AI ("Service"), operated by Xone AI, you agree to these Terms of Service. If you do not agree, do not use the Service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Who Can Use</h2>
              <p>You must be at least 13 years old to use MonsterX AI. If you are under 18, you confirm that you have parental permission.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Your Account</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for keeping your password secure.</li>
                <li>You must provide accurate information during registration.</li>
                <li>You may not share your account with others.</li>
                <li>You are responsible for all activity on your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Acceptable Use</h2>
              <p>You agree <strong>not</strong> to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any law or regulation.</li>
                <li>Generate illegal, harmful, or abusive content.</li>
                <li>Infringe on intellectual property rights.</li>
                <li>Send spam or unsolicited messages.</li>
                <li>Attempt to hack, scrape, or reverse-engineer the Service.</li>
                <li>Automate access without written permission (no bots, crawlers).</li>
                <li>Impersonate others or misrepresent your identity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. AI-Generated Content</h2>
              <p>MonsterX AI generates responses using large language models. AI can make mistakes, hallucinate, or produce inaccurate information. You agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>AI responses are not professional advice (legal, medical, financial).</li>
                <li>You will verify important information independently.</li>
                <li>You are responsible for any actions taken based on AI output.</li>
                <li>We do not guarantee accuracy, reliability, or completeness.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Payments & Subscriptions</h2>
              <p>Paid plans are billed via Razorpay/PhonePe. All prices are in INR and include applicable taxes. Subscriptions auto-renew unless cancelled. Refunds are not provided once a plan is activated, unless required by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">7. Intellectual Property</h2>
              <p>The Service, branding, and underlying code are owned by Xone AI. You may not copy, distribute, or modify our code without permission. AI-generated content (chat responses) is yours to use — we don't claim ownership over your AI-generated text.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">8. Service Availability</h2>
              <p>We aim for 99% uptime but do not guarantee uninterrupted service. We may modify, suspend, or discontinue features at any time without notice.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">9. Limitation of Liability</h2>
              <p>To the maximum extent allowed by law, Xone AI is not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability for any claim is limited to the amount you paid us in the last 12 months (or ₹100 if you're a free user).</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">10. Termination</h2>
              <p>We may suspend or terminate your account if you violate these Terms. You may delete your account anytime from Settings. Upon termination, your right to use the Service ends immediately.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">11. Governing Law</h2>
              <p>These Terms are governed by the laws of India. Any disputes will be resolved in the courts of [Your City], India.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">12. Changes to Terms</h2>
              <p>We may update these Terms. Continued use of the Service means acceptance of the new Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">13. Contact</h2>
              <p>For questions about these Terms:<br />
                <strong>Xone AI</strong><br />
                Email: <a href="mailto:legal@xoneai.in" className="text-emerald-600 hover:underline">legal@xoneai.in</a>
              </p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Terms;
