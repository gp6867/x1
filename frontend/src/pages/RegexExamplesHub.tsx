import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, ArrowRight, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../components/layout/Footer';
import { regexExamples } from '../data/regexExamples';

const RegexExamplesHub: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Regex Pattern Examples — Email, Password, URL Validation"
        description="Browse our complete list of Regular Expression examples. Copy patterns for email, password, URL, IP address, and more."
        canonical="https://www.xoneai.in/regex-examples"
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
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Code2 className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Regex Pattern Examples
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A complete library of common Regular Expressions. Copy tested patterns for validation, parsing, and data extraction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {regexExamples.map((example) => (
              <button
                key={example.slug}
                onClick={() => navigate(`/regex-examples/${example.slug}`)}
                className="group flex flex-col text-left p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition"
              >
                <div className="flex items-start gap-3 mb-2">
                  <BookOpen size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                  <h2 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                    {example.title}
                  </h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  {example.shortAnswer}
                </p>
                <span className="mt-auto text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Pattern <ArrowRight size={14} />
                </span>
              </button>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h3 className="font-bold text-xl mb-2">Need a custom regex?</h3>
            <p className="text-blue-50 mb-6">Describe your requirement in plain English and our AI will write the regex for you.</p>
            <button onClick={() => navigate('/tools/regex-generator')} className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg">
              Try AI Regex Generator
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default RegexExamplesHub;
