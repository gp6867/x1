import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, ArrowRight, Loader, Shield, Zap, Check, Copy } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ToolCodeExplainer: React.FC = () => {
  const navigate = useNavigate();
  const [codeText, setCodeText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO
        title="AI Code Explainer — Understand Code Line-by-Line (Free)"
        description="Free AI code explainer. Paste Python, JavaScript, SQL, Bash, Java or most mainstream languages and get a line-by-line explanation, bug check and improvement tips."
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
              Paste any code and our AI explains how it works step by step — and flags likely bugs or improvements. Free, no signup.
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
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <h3 className="font-bold text-slate-900 dark:text-white">Explanation</h3>
                <button onClick={copyToClipboard} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5">
                  {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-6 text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
            </div>
          )}

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Example 1: Recursive Function</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase mb-2">You paste</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">{`def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)`}</pre>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">AI explains</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{`Line 1: def fib(n): defines
a function that computes the
nth Fibonacci number.

Line 2: base case. If n is 0
or 1, return n directly.

Line 3: recursive call. Adds
the two previous Fibonacci
numbers.

[Note] This is O(2^n). Use
@lru_cache or an iterative
approach for n > 30.`}</pre>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Example 2: Async JavaScript</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase mb-2">You paste</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">{`async function fetchUser(id) {
  const res = await fetch(
    \`/api/users/\${id}\`
  );
  if (!res.ok) throw new Error('Not found');
  return res.json();
}`}</pre>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">AI explains</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{`async function returns a Promise.
await fetch pauses until the
HTTP request completes.

!res.ok checks for 4xx/5xx
status codes.

throw rejects the Promise
with an error.

res.json() also returns a
Promise — the caller must
await it.

[Note] Wrap calls in try/catch
to handle network errors.`}</pre>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What is the AI Code Explainer?</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              The AI Code Explainer reads any code snippet you paste and produces a line-by-line explanation in plain English. It's built for two audiences: developers who inherited unfamiliar code (legacy files, open-source pulls, teammate handoffs), and beginners learning a new language who can't fully parse what they're reading yet.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Unlike raw AI chats, this tool also flags likely bugs, highlights performance risks, and suggests cleaner alternatives. It works best on mainstream languages — Python, JavaScript, TypeScript, Java, C++, C#, Go, SQL, Bash — and always recommends you verify edge cases in your own environment.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Languages & Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Python, JavaScript, TypeScript</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Complex functions, decorators, async code, generators, closures.</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Java, C++, Go, SQL, Bash</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Algorithms, memory layout, concurrency patterns, queries, shell scripts.</p>
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
              <li><strong className="text-slate-900 dark:text-white">Click Explain Code</strong> — the AI walks through it step by step.</li>
              <li><strong className="text-slate-900 dark:text-white">Read the bug/improvement notes</strong> — the AI also flags issues you didn't spot.</li>
            </ol>
          </section>

          {/* ✅ NAYA SECTION: Internal Linking to Error Pages */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Facing a specific error in your code?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">We have dedicated pages to fix the most common Python and JavaScript errors.</p>
            <div className="grid md:grid-cols-2 gap-3">
              <button onClick={() => navigate('/python-errors/typeerror-can-only-concatenate-str-not-int-to-str')} className="text-left p-3 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Python: TypeError: can only concatenate str</p>
              </button>
              <button onClick={() => navigate('/js-errors/typeerror-cannot-read-properties-of-undefined')} className="text-left p-3 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">JS: Cannot read properties of undefined</p>
              </button>
              <button onClick={() => navigate('/js-errors/cors-policy-error')} className="text-left p-3 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">JS: CORS Policy Error</p>
              </button>
              <button onClick={() => navigate('/python-errors/modulenotfounderror-no-module-named')} className="text-left p-3 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Python: ModuleNotFoundError</p>
              </button>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can AI explain code line by line?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Yes. For most snippets, the AI produces a numbered or bulleted walkthrough — each line or logical block is explained in plain English.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Which languages work best?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Python, JavaScript, TypeScript, Java, C++, C#, Go, SQL, and Bash produce the best explanations. Esoteric languages or very new syntax may need extra context in your prompt.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Will it also find bugs and suggest improvements?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Yes. Besides the explanation, the AI flags potential bugs (null dereferences, off-by-one errors, performance issues) and suggests cleaner patterns when relevant.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Is my code stored?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Guest explanations are processed in memory and not stored. Sign up if you want your history saved in your account.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What's the character limit?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">12,000 characters per paste — enough for most files and all individual functions. Guests get 30 explanations per day.</p>
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
