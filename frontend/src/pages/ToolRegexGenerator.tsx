import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, ArrowRight, Loader, Copy, Check } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ToolRegexGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [promptText, setPromptText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setLoading(true);
    setResult('');
    
    try {
      const response = await axios.post(`${API_URL}/chat/guest`, {
        message: `Write a Regex pattern for the following requirement: "${promptText}". Provide the Regex code first, and then a brief explanation of how it works.`
      });
      if (response.data.success) {
        setResult(response.data.message);
      }
    } catch (err) {
      setResult('Sorry, the tool is busy right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO
        title="Free AI Regex Generator — MonsterX AI"
        description="Generate Regular Expressions (Regex) from plain English instantly. Free AI-powered regex generator by MonsterX AI. No login required."
        canonical="https://www.xoneai.in/tools/regex-generator"
      />

      <div className="h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <button onClick={() => navigate('/home')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Home
            </button>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Code2 className="text-emerald-600" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              AI Regex Generator
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Describe what you want to match in plain English. Our AI will write the Regex for you.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Example: Match all valid email addresses, or Find dates in DD/MM/YYYY format"
              className="w-full h-32 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-sm resize-none focus:outline-none focus:border-emerald-500 mb-4"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'Generate Regex'} <ArrowRight size={20} />
            </button>
          </form>

          {result && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <h3 className="font-bold text-slate-900 dark:text-white">Generated Result</h3>
                <button onClick={copyToClipboard} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5">
                  {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-6 text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed font-mono">
                {result}
              </div>
            </div>
          )}

          <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center text-white">
            <h3 className="font-bold mb-2">Want an AI that remembers your code?</h3>
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

export default ToolRegexGenerator;
