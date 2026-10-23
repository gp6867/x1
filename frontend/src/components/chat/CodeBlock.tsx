import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang">{language || 'code'}</span>
        <button
          type="button"
          className="code-block-copy-btn"
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy code'}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          padding: '14px 16px',
          fontSize: '13px',
          lineHeight: 1.5,
          background: 'transparent',
          borderRadius: 0,
        }}
        codeTagProps={{
          style: {
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
            fontSize: '13px',
          },
        }}
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
