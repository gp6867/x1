import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Terminal, ArrowRight, Loader, Shield, Zap } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ToolPythonFixer: React.FC = () => {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFix = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!errorText.trim()) return;
    setLoading(true);
    setResult('');
    
    try {
      const response = await axios.post(`${API_URL}/chat/guest`, {
        message: `Fix this Python error and explain the solution briefly:\n\n${errorText}`
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
        title="Fix Python Error with AI — Free Python Debugger (No Signup)"
        description="Fix Python errors instantly with AI. Free online Python debugger handles TypeError, NameError, IndentationError, ModuleNotFoundError, AttributeError and full tracebacks. No login."
        canonical="https://www.xoneai.in/tools/python-error-fixer"
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
              <Terminal className="text-emerald-600" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Fix Python Error with AI
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Paste your Python traceback below. Our AI reads the full error, finds the root cause, and gives you a working fix in seconds. Free, no signup.
            </p>
          </div>

          <form onSubmit={handleFix} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-4">
            <textarea
              value={errorText}
              onChange={(e) => setErrorText(e.target.value)}
              placeholder="Traceback (most recent call last):&#10;  File...&#10;TypeError: can only concatenate str..."
              className="w-full h-40 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-sm resize-none focus:outline-none focus:border-emerald-500 mb-4"
              maxLength={8000}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'Fix My Code'} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mb-8 grid md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <Shield size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Privacy</p>
                <p className="text-slate-600 dark:text-slate-400">Guest fixes are processed in memory and never stored. Sign up to save your fixes.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <Zap size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Limits</p>
                <p className="text-slate-600 dark:text-slate-400">8,000 chars per error • 30 free fixes/day for guests • No login required.</p>
              </div>
            </div>
          </div>

          {result && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Solution</h3>
              <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
            </div>
          )}

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Example: Before & After</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-4">
                <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase mb-2">Before (paste this)</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">{`Traceback (most recent call last):
  File "app.py", line 12, in <module>
    total = "Total: " + 100
TypeError: can only concatenate str
(not "int") to str`}</pre>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">After (AI gives you)</p>
                <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap">{`Fix: Convert the int to str.

total = "Total: " + str(100)
# or use an f-string:
total = f"Total: {100}"

Cause: Python can't add a str
and int directly. Wrap the int
in str() or use f-strings.`}</pre>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What is the Python Error Fixer?</h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              The Python Error Fixer is a free AI-powered debugger that reads your full Python traceback and generates a working fix in seconds. Paste any error — <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-600 dark:text-emerald-400">TypeError</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-600 dark:text-emerald-400">NameError</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-600 dark:text-emerald-400">AttributeError</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-600 dark:text-emerald-400">ModuleNotFoundError</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-600 dark:text-emerald-400">ImportError</code>, or <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-600 dark:text-emerald-400">IndentationError</code> — and get the corrected code plus a plain-English explanation of why the bug happened.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Unlike generic chatbots, this tool is tuned for Python debugging. It parses the entire stack trace (not just the last line), understands framework exceptions from Django, Flask, FastAPI, and library errors from Pandas, NumPy, and PyTorch. Works with Python 2.7 and Python 3.10–3.13.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Common Python Errors We Fix</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">TypeError</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">"can only concatenate str (not int) to str" — mixing incompatible types. Fix: use str(), int(), or f-strings.</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">NameError</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">"name 'x' is not defined" — variable used before assignment or a typo in the name.</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">AttributeError</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">"'NoneType' object has no attribute 'X'" — calling a method on a None value. Fix: check for None or use getattr with a default.</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">IndentationError</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Mixed tabs and spaces, or inconsistent indentation in a block. Fix: use 4 spaces consistently.</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">ModuleNotFoundError</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Package not installed or wrong virtual environment. Fix: pip install the package or activate the right venv.</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">KeyError</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Dictionary key not found. Fix: use .get(key, default) or check if key in dict before accessing.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How to Fix a Python Error (3 Steps)</h2>
            <ol className="space-y-3 text-slate-700 dark:text-slate-300 list-decimal pl-6">
              <li><strong className="text-slate-900 dark:text-white">Copy the full traceback</strong> — from your terminal or IDE, including the file path, line number, and final error message.</li>
              <li><strong className="text-slate-900 dark:text-white">Paste and submit</strong> — paste it into the box above and click "Fix My Code". The AI analyzes it in 2–5 seconds.</li>
              <li><strong className="text-slate-900 dark:text-white">Copy the fix</strong> — you get the corrected code plus an explanation of what went wrong.</li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I debug Python code with AI?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Paste the full traceback into the box above. The AI reads the file path, line number, and error message, then generates a working fix with an explanation.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Does it support Python 3.12 and 3.13?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Yes. The tool supports Python 2.7 and Python 3.x, including 3.10, 3.11, 3.12, 3.13, and future versions.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Is my code stored or shared?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Guest fixes are processed in memory and never stored on our servers. If you sign up, your fixes are saved to your account so you can revisit them.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How is this different from Stack Overflow?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Stack Overflow needs you to find a matching question. This tool reads your exact traceback and gives a fix tailored to your code — in under 5 seconds.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What's the character limit per error?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Up to 8,000 characters per error. That's enough for a full traceback plus surrounding code context. Guests get 30 fixes per day.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Related Free Tools</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/tools/code-explainer')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition text-sm font-medium">
                AI Code Explainer →
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
            <h3 className="font-bold mb-2">Want a full AI with memory?</h3>
            <p className="text-emerald-50 text-sm mb-4">MonsterX AI remembers your entire project across chats.</p>
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

export default ToolPythonFixer;
