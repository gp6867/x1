import React, { useState } from 'react';
import { Loader, ArrowRight, Shield, Check, Copy } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface InlineErrorFixerProps {
  initialText: string;
  toolType: 'python' | 'js' | 'regex';
  toolName: string;
  toolLink: string;
  promptPrefix: string;
}

const InlineErrorFixer: React.FC<InlineErrorFixerProps> = ({ 
  initialText, 
  toolName, 
  toolLink, 
  promptPrefix 
}) => {
  const [text, setText] = useState(initialText);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleFix = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const response = await axios.post(`${API_URL}/chat/guest`, {
        message: `${promptPrefix}\n\n${text}`
      });
      if (response.data.success) {
        setResult(response.data.message);
      }
    } catch (err) {
      setResult('Sorry, the tool is busy right now. Please try the full tool page.');
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
    // Min-height set kiya taaki layout shift (CLS) na ho
    <div className="bg-slate-50 dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-10 min-h-[300px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          🛠️ Fix it right here with {toolName}
        </h3>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Edit the traceback below if needed, then let our AI suggest a fix without leaving this page.
      </p>

      <form onSubmit={handleFix}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your code or error here..."
          className="w-full h-32 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-sm resize-none focus:outline-none focus:border-emerald-500 mb-3"
          required
        />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="animate-spin" size={18} /> : 'Get AI Fix'} <ArrowRight size={18} />
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate(toolLink)}
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition"
          >
            Open full {toolName} →
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">AI Solution</span>
            <button onClick={copyToClipboard} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-4 text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed font-mono">
            {result}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
        <Shield size={14} /> AI suggestions can be wrong. Review and test before applying.
      </div>
    </div>
  );
};

export default InlineErrorFixer;
