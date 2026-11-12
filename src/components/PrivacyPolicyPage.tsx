import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, Database } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-in fade-in">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Security Standard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Last revised: November 2026 · Effective immediately
        </p>
      </div>

      {/* Highlights Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#111827]/80 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <ServerOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">No Server Logs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We do not store your IP address, device fingerprints, or download history on our servers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/80 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Local Storage Only</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your recent downloads list is saved exclusively inside your browser's private localStorage.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/80 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Zero Account Needed</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No signup, no TikTok login credentials, and no cookies required to use TikTok Downloader Pro.
          </p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-[#111827]/50 p-6 sm:p-8 rounded-3xl border border-slate-800">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Information We Do NOT Collect</h2>
          <p>
            TikTok Downloader Pro is designed as a client-first utility. When you analyze a TikTok URL, the link is processed solely in memory to resolve official oEmbed metadata and verify creator permissions. We do not maintain user databases, behavioral tracking cookies, or profiling telemetry.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Browser Local Storage</h2>
          <p>
            To enhance your experience, the application allows you to view your recent downloads on the homepage. This data (video title, author name, thumbnail, and download timestamp) is stored strictly within your browser's <code>localStorage</code>. It is never transmitted to us or third-party advertising brokers. You can purge this data at any moment using the "Clear History" button.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Third-Party Platforms and Attribution</h2>
          <p>
            TikTok Downloader Pro is an independent web application and is not affiliated with, endorsed by, or sponsored by ByteDance Ltd. or TikTok. All TikTok trademarks, logos, audio sounds, and video copyrights remain the exclusive property of their respective creators and ByteDance Ltd.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Permitted Content & Fair Use</h2>
          <p>
            Users are solely responsible for ensuring that they have the legal right or explicit creator permission to save and view any video content. Downloading videos for unauthorized commercial reproduction, redistribution, or copyright infringement is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">5. Changes to This Policy</h2>
          <p>
            We may occasionally update this Privacy Policy to reflect technical or legal modifications. Any revisions will be reflected on this page with an updated revision date.
          </p>
        </section>
      </div>
    </div>
  );
};
