import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, ArrowRight, Loader, Code } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ErrorFixerPage: React.FC = () => {
  const { errorSlug } = useParams<{ errorSlug: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // URL slug ko human readable title me convert karein (e.g., python-attributeerror -> Python AttributeError)
  const errorTitle = errorSlug
    ? errorSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Code Error';

  const fetchFix = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await axios.post(`${API_URL}/chat/guest`, {
        message: `How to fix ${errorTitle} in programming? Provide the solution with a code example and explanation.`
      });
      if (response.data.success) {
        setResult(response.data.message);
      }
    } catch (err) {
      setResult('Sorry, the AI is busy right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Page load hote hi fix fetch karein
  useEffect(() => {
    if (errorSlug) {
      fetchFix();
    }
  }, [errorSlug]);

  return (
    <>
      <SEO
        title={`How to Fix ${errorTitle} — MonsterX AI`}
        description={`Learn how to fix ${errorTitle} instantly with AI. Free code debugger by MonsterX AI. No login required.`}
        canonical={`https://www.xoneai.in/fix/${errorSlug}`}
      />

      <div className="h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <button onClick={() => navigate('/tools/python-error-fixer')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Fixer
            </button>
            <button onClick={() => navigate('/chat')} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              Try MonsterX Chat →
            </button>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              How to Fix {errorTitle}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Our AI has analyzed this error and generated a fix. Use the code below to resolve your issue.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[200px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-emerald-600">
                <Loader className="animate-spin mb-4" size={32} />
                <p className="text-slate-600 dark:text-slate-400">AI is writing the solution...</p>
              </div>
            ) : result ? (
              <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-mono">
                {result}
              </div>
            ) : (
              <div className="text-center">
                <button onClick={fetchFix} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">
                  Generate Fix Now
                </button>
              </div>
            )}
          </div>

          <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center text-white">
            <h3 className="font-bold mb-2">Want an AI with memory to fix all your code?</h3>
            <p className="text-emerald-50 text-sm mb-4">MonsterX AI remembers your entire project context across chats.</p>
            <button onClick={() => navigate('/register')} className="bg-white text-emerald-700 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-50 transition">
              Try MonsterX AI Free
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ErrorFixerPage;
