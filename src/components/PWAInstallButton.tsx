import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Download, Smartphone, X, CheckCircle2, Share, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'hero' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside standalone installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback for browsers without beforeinstallprompt or desktop
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md shadow-purple-600/20 active:scale-[0.98] transition-all shrink-0"
          title="Install TikTok Downloader Pro App"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'hero' && (
        <div className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-purple-500/30 text-xs text-slate-200 transition-all cursor-pointer shadow-lg shadow-purple-500/10 group"
          onClick={handleInstallClick}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
            <Download className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-slate-300 group-hover:text-white">
            Install Web App for Android & iOS
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold uppercase tracking-wider ml-1">
            Install
          </span>
        </div>
      )}

      {variant === 'banner' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#111827] to-blue-950/60 border border-purple-500/30 flex items-center justify-between gap-4 my-6 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-white truncate">Install TikTok Downloader Pro</h4>
              <p className="text-xs text-slate-300 truncate">
                Add to your home screen for quick 1-tap access and offline downloads.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md shadow-purple-600/25 shrink-0 transition-transform active:scale-95"
          >
            Install Now
          </button>
        </div>
      )}

      {/* Guided Installation Modal (for iOS or browsers without native prompt) */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#111827] border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-white">
                  {isIOS ? 'Install on iPhone & iPad' : 'Install on Your Device'}
                </h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 shrink-0">
                      <Share className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Step 1: Tap the Share Button</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        In Safari bottom toolbar, tap the square Share icon with an arrow pointing up.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 shrink-0">
                      <PlusSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Step 2: Add to Home Screen</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Scroll down the menu list and tap "Add to Home Screen".
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Step 3: Confirm & Launch</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Tap "Add" in the top right. The app will launch in genuine full-screen standalone mode!
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    To install TikTok Downloader Pro as a native application:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-400">
                    <li>
                      On <strong>Android Chrome</strong>: Tap the three dots menu (<span className="text-white">⋮</span>) at the top right, then select <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home screen"</strong>.
                    </li>
                    <li>
                      On <strong>Desktop Chrome / Edge / Brave</strong>: Click the install icon in the browser address bar.
                    </li>
                  </ol>
                </>
              )}
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
