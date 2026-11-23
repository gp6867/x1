import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Terminal, ArrowRight, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';
import { pythonErrors } from '../data/pythonErrors';

const PythonErrorsHub: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="All Python Errors — Fix List, String, and Type Errors"
        description="Browse our complete list of Python errors. Learn how to fix TypeError, ValueError, IndexError, ImportError, and more with AI-powered solutions."
        canonical="https://www.xoneai.in/python-errors"
      />

      <div className="h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <button onClick={() => navigate('/home')} className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition font-medium text-sm flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Home
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Terminal className="text-red-600" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Python Error Solutions
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A complete library of common Python errors. Click on any error to see the cause, the fix, and AI-powered solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {pythonErrors.map((error) => (
              <button
                key={error.slug}
                onClick={() => navigate(`/python-errors/${error.slug}`)}
                className="group flex flex-col text-left p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition"
              >
                <div className="flex items-start gap-3 mb-2">
                  <BookOpen size={18} className="text-red-500 mt-1 flex-shrink-0" />
                  <h2 className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                    {error.title}
                  </h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  {error.shortAnswer}
                </p>
                <span className="mt-auto text-sm font-medium text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Solution <ArrowRight size={14} />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white">
            <h3 className="font-bold text-xl mb-2">Don't see your error?</h3>
            <p className="text-emerald-50 mb-6">Paste your full traceback into our AI tool and get an instant fix.</p>
            <button onClick={() => navigate('/tools/python-error-fixer')} className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition shadow-lg">
              Fix Python Error with AI
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PythonErrorsHub;
