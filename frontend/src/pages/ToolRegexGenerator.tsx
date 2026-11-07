import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, ArrowRight, Loader, Copy, Check, Shield, Zap } from 'lucide-react';
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
        title="AI Regex Generator — Create Regex from Plain English (Free)"
        description="Free AI regex generator. Describe what you want to match in plain English and get a regex pattern for email, phone, URL, password, dates and more. No signup."
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
              AI Regex Generator from Plain English
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Describe what you want to match in plain English. Our AI proposes a regex pattern and explains how it works. Always test on regex101 before using in production.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-4">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Example: Match valid email addresses, or Find dates in DD/MM/YYYY format"
              className="w-full h-32 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium text-sm resize-none focus:outline-none focus:border-emerald-500 mb-4"
              maxLength={2000}
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

          <div className="mb-8 grid md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <Shield size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Privacy</p>
                <p className="text-slate-600 dark:text-slate-400">Descriptions are processed in memory and never stored. Sign up to save history.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <Zap size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Limits</p>
                <p className="text-slate-600 dark:text-slate-400">2,000 chars per prompt • 30 free generations/day for guests • No login.</p>
              </div>
            </div>
          </div>

          {result && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <h3 className="font-bold text-slate-900 dark:text-white">Generated Result</h3>
                <button onClick={copyToClipboard} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5">
                  {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-6 text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed font-mono">
                {result}
              </div>
              <p className="px-6 pb-4 text-xs text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-4">
                Test the pattern on regex101.com before using it in production. AI suggestions may miss edge cases.
              </p>
            </div>
          )}

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Example: Before & After</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase mb-2">You write</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{`Match standard email addresses:
letters, digits, dots, + tags,
and a valid 2+ letter TLD.`}</pre>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">AI suggests</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">{`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$

Explanation: allows letters,
digits, dots, underscores,
%, +, - before @; domain with
letters/digits/hyphens; TLD 2+
letters. This is a permissive
pattern — test on regex101.`}</pre>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What is the AI Regex Generator?</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              The AI Regex Generator converts plain English into a regex pattern. Regex is powerful but easy to get wrong — one misplaced <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-600 dark:text-emerald-400">*</code> or a missing <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-600 dark:text-emerald-400">\</code> can break the whole pattern. Describe what you want in a normal sentence and get a pattern you can refine in JavaScript, Python, PHP, Java, Go, or any language that supports regex.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Each output also includes a plain-English explanation of how the pattern works. Because AI suggestions can miss edge cases, always test the pattern on regex101.com before using it in production.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Popular Regex Patterns</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Email validation</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">"Match valid email addresses with optional + tag and subdomains."</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">US phone number</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">"Match (555) 123-4567 and 555-123-4567 in one pattern."</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">URL / domain</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">"Match http and https URLs including subdomains and ports."</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Strong password</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">"Require uppercase, lowercase, a digit, and a special character, min 8 chars."</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Indian phone & PIN code</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">"Match Indian mobile numbers (+91 format) and 6-digit PIN codes."</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Date formats</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">"Match dates in DD/MM/YYYY and YYYY-MM-DD in one regex."</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How to Use the Regex Generator</h2>
            <ol className="space-y-3 text-slate-700 dark:text-slate-300 list-decimal pl-6">
              <li><strong className="text-slate-900 dark:text-white">Describe what you want to match</strong> — in plain English, like "find dates in DD/MM/YYYY".</li>
              <li><strong className="text-slate-900 dark:text-white">Click Generate Regex</strong> — the AI proposes a pattern plus an explanation.</li>
              <li><strong className="text-slate-900 dark:text-white">Test on regex101.com</strong> — verify with real examples before pasting into your code.</li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can AI write a regex from plain English?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">For most common patterns — email, phone, URL, password, dates — yes. For complex edge cases (nested groups, lookaheads, backreferences), always test on regex101.com before production use.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Which regex flavours are supported?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">JavaScript, Python, PHP, Java, Go, Ruby, .NET, Rust — practically every major flavour. Mention the language in your prompt for dialect-specific features.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Does it support lookaheads and backreferences?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">JavaScript, Python, PHP, Java, and .NET support lookaheads and backreferences. Go's RE2 and Rust's regex crate do not — mention your language so the AI skips unsupported features.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Is my prompt stored?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Guest prompts are processed in memory and not stored. Sign up if you want to save your generated patterns in your account.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What's the limit per prompt?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">2,000 characters per prompt. Guests get 30 generations per day, no login required.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Related Free Tools</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/tools/python-error-fixer')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition text-sm font-medium">
                Python Error Fixer →
              </button>
              <button onClick={() => navigate('/tools/code-explainer')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition text-sm font-medium">
                AI Code Explainer →
              </button>
              <button onClick={() => navigate('/compare/monsterx-vs-chatgpt')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition text-sm font-medium">
                MonsterX AI vs ChatGPT →
              </button>
            </div>
          </section>

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
