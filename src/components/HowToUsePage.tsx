import React, { useState } from 'react';
import { Copy, Sparkles, CheckCircle2, Smartphone, Monitor, ShieldCheck, ArrowRight } from 'lucide-react';

interface HowToUsePageProps {
  onGoHome: () => void;
}

export const HowToUsePage: React.FC<HowToUsePageProps> = ({ onGoHome }) => {
  const [deviceTab, setDeviceTab] = useState<'mobile' | 'desktop'>('mobile');

  const steps = [
    {
      num: '01',
      title: 'Find the Video on TikTok',
      desc: 'Open the TikTok app on your smartphone or go to tiktok.com on your computer browser. Find the publicly accessible video you have permission to download.',
      tip: 'Check that the video creator has public sharing and downloading enabled.',
    },
    {
      num: '02',
      title: 'Copy the Video Link',
      desc: 'Tap the "Share" button (arrow icon on TikTok) on the right side of the video, then tap "Copy Link". On a desktop browser, you can copy the URL directly from the address bar.',
      tip: 'Supported formats include tiktok.com/@creator/video/..., vm.tiktok.com/..., and vt.tiktok.com/...',
    },
    {
      num: '03',
      title: 'Paste and Analyze in TikTok Downloader Pro',
      desc: 'Open TikTok Downloader Pro, paste the copied link into the input field using the "Paste" button, and tap "Analyze Video". Our system validates permissions and verifies the video streams.',
      tip: 'The app checks creator rights and permissions before generating download links.',
    },
    {
      num: '04',
      title: 'Save HD Video or MP3 Audio',
      desc: 'Choose your desired format (HD MP4 Video, MP3 Audio, or HD Cover Image) and tap "Download". Your browser will securely save the official file straight to your downloads folder.',
      tip: 'Files are saved with clean filenames ready for offline viewing on your device.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12 animate-in fade-in">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How to Use <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">TikTok Downloader Pro</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Follow our simple 4-step guide to download authorized TikTok videos in original quality on any device.
        </p>

        {/* Device Switcher */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 mt-2">
          <button
            onClick={() => setDeviceTab('mobile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              deviceTab === 'mobile'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile (iPhone / Android)</span>
          </button>
          <button
            onClick={() => setDeviceTab('desktop')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              deviceTab === 'desktop'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop (Mac / Windows)</span>
          </button>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-6 rounded-2xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {step.num}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-purple-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white">{step.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>

            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span>{step.tip}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Device-Specific Tips */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-500/20 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          {deviceTab === 'mobile' ? 'Mobile Best Practices' : 'Desktop Best Practices'}
        </h3>
        <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
          {deviceTab === 'mobile' ? (
            <>
              <li>
                <strong>iPhone (iOS):</strong> Videos download straight into Safari Downloads. You can tap the download icon in Safari and select "Save to Photos" to store it in your Camera Roll.
              </li>
              <li>
                <strong>Android:</strong> Downloads appear in your Notifications and Google Chrome "Downloads" folder, accessible through any Gallery or Files app.
              </li>
              <li>
                <strong>Clipboard Shortcut:</strong> Use the "Paste Link" button to avoid holding and manually selecting "Paste".
              </li>
            </>
          ) : (
            <>
              <li>
                <strong>Mac & PC:</strong> Files save directly into your primary Downloads folder as full `.mp4` or `.mp3` files.
              </li>
              <li>
                <strong>Original Audio:</strong> Choose MP3 if you only need the backing soundtrack for podcast or background listening.
              </li>
              <li>
                <strong>Browser Extension Friendly:</strong> Works smoothly across Google Chrome, Brave, Safari, Firefox, and Edge.
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <button
          onClick={onGoHome}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/20 transition-all"
        >
          <span>Try Downloading a Video Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
