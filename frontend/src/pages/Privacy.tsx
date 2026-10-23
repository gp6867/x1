import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';

const Privacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Privacy Policy — MonsterX AI by Xone AI"
        description="Learn how Xone AI collects, uses, and protects your data on MonsterX AI. DPDP Act compliant privacy policy."
        canonical="https://www.xoneai.in/privacy"
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-8">Last updated: October 23, 2026</p>

          <div className="marketing-legal max-w-none space-y-6 text-slate-700 dark:text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">1. Introduction</h2>
              <p>MonsterX AI ("we", "our", "us") is operated by Xone AI. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our AI assistant at xoneai.in.</p>
              <p>By using MonsterX AI, you agree to this Privacy Policy. If you do not agree, please do not use our service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">2. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Email address, name, and password (encrypted) when you register.</li>
                <li><strong>Chat Messages:</strong> Your conversations with our AI, including queries and responses.</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, device type, browser, and IP address.</li>
                <li><strong>Payment Information:</strong> Handled securely by Razorpay/PhonePe — we never store your card details.</li>
                <li><strong>Cookies:</strong> Session cookies for authentication and analytics (Google Analytics).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide AI chat responses and maintain conversation memory.</li>
                <li>To improve the quality of our AI responses and user experience.</li>
                <li>To send transactional emails (OTP, password reset).</li>
                <li>To process payments and manage subscriptions.</li>
                <li>To prevent abuse, spam, and illegal activity.</li>
                <li>To analyze traffic via Google Analytics 4 (anonymized).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">4. Third-Party Services</h2>
              <p>We share limited data with trusted third parties strictly to operate our service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Groq & Google Gemini:</strong> For AI inference (your messages are sent to generate responses).</li>
                <li><strong>Supabase:</strong> Secure database hosting.</li>
                <li><strong>Resend:</strong> Transactional email delivery.</li>
                <li><strong>Razorpay / PhonePe:</strong> Payment processing.</li>
                <li><strong>Google Analytics:</strong> Anonymous usage tracking.</li>
              </ul>
              <p>We do <strong>not</strong> sell your personal data to advertisers or third parties.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">5. Data Security</h2>
              <p>We use industry-standard security: passwords are hashed (bcrypt), data is transmitted over HTTPS, and database access is restricted. However, no online service is 100% secure — use a strong password and keep your account safe.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">6. Your Rights (DPDP Act, India)</h2>
              <p>Under the Digital Personal Data Protection Act (2023), you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data.</li>
                <li>Correct inaccurate data.</li>
                <li>Request deletion of your account and data.</li>
                <li>Withdraw consent at any time.</li>
                <li>File a grievance with our Grievance Officer.</li>
              </ul>
              <p>To exercise these rights, email <a href="mailto:privacy@xoneai.in" className="text-emerald-600 hover:underline">privacy@xoneai.in</a>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">7. Data Retention</h2>
              <p>We retain your account and chat data until you delete your account. After deletion, data is purged within 30 days (except as required by law).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">8. Cookies</h2>
              <p>We use essential cookies for login sessions and Google Analytics for anonymous usage stats. You can disable cookies in your browser settings, but the service may not function properly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">9. Children's Privacy</h2>
              <p>MonsterX AI is not intended for users under 13. If we discover a child under 13 has created an account, we will delete it.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">10. Changes to This Policy</h2>
              <p>We may update this policy. Material changes will be notified via email or in-app notice. Continued use means acceptance.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">11. Contact</h2>
              <p>For privacy questions:<br />
                <strong>Xone AI</strong><br />
                Email: <a href="mailto:privacy@xoneai.in" className="text-emerald-600 hover:underline">privacy@xoneai.in</a><br />
                Support: <a href="mailto:support@xoneai.in" className="text-emerald-600 hover:underline">support@xoneai.in</a>
              </p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Privacy;
