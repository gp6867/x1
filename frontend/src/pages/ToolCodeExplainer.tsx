import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, ArrowRight, Loader, Shield, Zap } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ToolCodeExplainer: React.FC = () => {
  const navigate = useNavigate();
  const [codeText, setCodeText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeText.trim()) return;
    setLoading(true);
    setResult('');
    
    try {
      const response = await axios.post(`${API_URL}/chat/guest`, {
        message: `Explain this code step-by-step. What does it do, and are there any bugs or improvements? Keep it easy to understand for a developer.\n\nCode:\n${codeText}`
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

  return (
    <>
      <SEO
        title="AI Code Explainer — Understand Any Code Line-by-Line (Free)"
        description="Free AI code explainer. Paste Python, JavaScript, TypeScript, Java, C++ or any language and get a line-by-line explanation, bug check, and improvement tips. No login."
        canonical="https://www.xoneai.in/tools/code-explainer"
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
              <Code className="text-emerald-600" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              AI Code Explainer for Beginners
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Paste any code and our AI explains exactly how it works, step-by-step — plus flags bugs and suggests improvements. Free, no signup.
            </p>
          </div>

          <form onSubmit={handleExplain} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-4">
            <textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              placeholder="Paste your code here (e.g., a complex JavaScript function or Python script)..."
              className="w-full h-48 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-sm resize-none focus:outline-none focus:border-emerald-500 mb-4"
              maxLength={12000}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'Explain Code'} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mb-8 grid md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <Shield size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Privacy</p>
                <p className="text-slate-600 dark:text-slate-400">Guest explanations are processed in memory and never stored. Sign up to save them.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <Zap size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Limits</p>
                <p className="text-slate-600 dark:text-slate-400">12,000 chars per paste • 30 free explanations/day for guests • No login.</p>
              </div>
            </div>
          </div>

          {result && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Explanation</h3>
              <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
            </div>
          )}

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Example: Before & After</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase mb-2">You paste</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">{`def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)`}</pre>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">AI explains</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{`Line 1: def fib(n): — defines
a function that computes the
nth Fibonacci number.

Line 2: base case. If n is 0
or 1, return n directly.

Line 3: recursive call. Adds
the two previous Fibonacci
numbers.

⚠️ Bug risk: this is O(2^n).
Use @lru_cache or an
iterative approach for n > 30.`}</pre>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What is the AI Code Explainer?</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              The AI Code Explainer reads any code snippet you paste and produces a line-by-line explanation in plain English. It's built for two audiences: developers who inherited unfamiliar code (legacy files, open-source pulls, teammate handoffs), and beginners learning a new language who can't fully parse what they're reading yet.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Unlike raw AI chats, this tool is tuned to also flag bugs, highlight performance risks, suggest cleaner alternatives, and call out non-obvious edge cases. It works on entire files or single functions, in any language, without requiring you to sign up or install anything.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Languages & Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Python, JavaScript, TypeScript</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Understand complex functions, decorators, async code, generators, closures.</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Java, C++, Go, Rust</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Explain algorithms, memory layout, concurrency patterns, and idiomatic patterns.</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Legacy & inherited code</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Paste 10-year-old code and get an explanation that reads like a modern tutorial.</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Learning & interviews</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Understand an algorithm's logic before a coding interview, line by line.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How to Use the Code Explainer</h2>
            <ol className="space-y-3 text-slate-700 dark:text-slate-300 list-decimal pl-6">
              <li><strong className="text-slate-900 dark:text-white">Paste your code</strong> — a function, a file, or a snippet that confuses you.</li>
              <li><strong className="text-slate-900 dark:text-white">Click Explain Code</strong> — the AI walks through it line-by-line in plain English.</li>
              <li><strong className="text-slate-900 dark:text-white">Read the bug/improvement notes</strong> — the AI also flags issues you didn't spot.</li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can AI explain code line by line?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Yes. For most snippets the AI produces a numbered or bulleted walkthrough — each line or logical block is explained in plain English.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Does it work for any programming language?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Yes. The AI understands Python, JavaScript, TypeScript, Java, C, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, Bash, SQL, and more. If a language uses mainstream syntax, the AI will read it.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Will it also find bugs and suggest improvements?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Yes. Besides the explanation, the AI calls out potential bugs (null dereferences, off-by-one errors, performance issues) and suggests cleaner patterns when relevant.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Is my code stored?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Guest explanations are processed in memory and never stored. Sign up if you want your history saved in your account.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What's the character limit?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">12,000 characters per paste — enough for most full files and all individual functions. Guests get 30 explanations per day.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Related Free Tools</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/tools/python-error-fixer')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition text-sm font-medium">
                Python Error Fixer →
              </button>
              <button onClick={() => navigate('/tools/regex-generator')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition text-sm font-medium">
                AI Regex Generator →
              </button>
              <button onClick={() => navigate('/compare/monsterx-vs-chatgpt')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition text-sm font-medium">
                MonsterX AI vs ChatGPT →
              </button>
            </div>
          </section>

          <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center text-white">
            <h3 className="font-bold mb-2">Want an AI that remembers your project?</h3>
            <p className="text-emerald-50 text-sm mb-4">MonsterX AI remembers your tech stack and code across chats.</p>
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

export default ToolCodeExplainer;
