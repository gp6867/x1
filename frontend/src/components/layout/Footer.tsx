import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/home" className="flex items-center gap-2 mb-3">
              <img src="/favicon-192.png" alt="MonsterX AI" className="w-9 h-9 rounded-lg" />
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">MonsterX AI</div>
                <div className="text-xs text-slate-500">by Xone AI</div>
              </div>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Advanced AI chat, coding agent & deep search. Free forever.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/home" className="hover:text-emerald-600 transition">Home</Link></li>
              <li><Link to="/chat" className="hover:text-emerald-600 transition">Chat</Link></li>
              <li><Link to="/pricing" className="hover:text-emerald-600 transition">Pricing</Link></li>
              <li><Link to="/blog" className="hover:text-emerald-600 transition">Blog</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-emerald-600 transition">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-600 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-600 transition">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-600 transition">Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="mailto:gp686771@gmail.com" className="hover:text-emerald-600 transition break-all">
                  gp686771@gmail.com
                </a>
              </li>
              <li>
                <a href="mailto:hackersamrat29@gmail.com" className="hover:text-emerald-600 transition break-all">
                  hackersamrat29@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <div>© 2026 Xone AI. All rights reserved.</div>
          <div>Made with ❤️ in India</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
