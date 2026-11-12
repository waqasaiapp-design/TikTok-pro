import React from 'react';
import { PageTab } from '../types.ts';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070b14] py-12 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand lockup */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-500/20">
              TT
            </div>
            <div>
              <span className="font-bold text-sm text-white">TikTok Downloader Pro</span>
              <p className="text-[11px] text-slate-400">Save videos you are authorized to download</p>
            </div>
          </div>

          {/* Clean links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
            <button onClick={() => onSelectTab('home')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => onSelectTab('how-to-use')} className="hover:text-white transition-colors">
              How to Use
            </button>
            <button onClick={() => onSelectTab('faq')} className="hover:text-white transition-colors">
              FAQ
            </button>
            <button onClick={() => onSelectTab('privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onSelectTab('contact')} className="hover:text-white transition-colors">
              Contact Us
            </button>
          </nav>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-6 border-t border-slate-800/60 text-slate-400 text-[11px] leading-relaxed space-y-2">
          <p>
            <strong>Disclaimer:</strong> TikTok Downloader Pro is an independent web application and is not affiliated with, sponsored by, or endorsed by TikTok or ByteDance Ltd. We encourage all users to respect creator rights and copyright laws. Downloading is only supported for publicly accessible videos where the creator and platform permit downloading.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compliant with creator permissions & platform policies</span>
            </div>
            <div>
              © {new Date().getFullYear()} TikTok Downloader Pro. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
