import React, { useState } from 'react';
import { Clipboard, ArrowRight, Loader2, Sparkles, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { VideoData } from '../types.ts';

interface HeroInputProps {
  url: string;
  onChangeUrl: (val: string) => void;
  onAnalyze: (urlToAnalyze?: string) => void;
  isLoading: boolean;
  loadingStep: string;
  error: string | null;
  onClearError: () => void;
  sampleVideos: VideoData[];
  onSelectSample: (sample: VideoData) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const HeroInput: React.FC<HeroInputProps> = ({
  url,
  onChangeUrl,
  onAnalyze,
  isLoading,
  loadingStep,
  error,
  onClearError,
  sampleVideos,
  onSelectSample,
  onToast,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handlePaste = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        onToast('Clipboard access not supported. Please paste manually.', 'info');
        return;
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        onChangeUrl(text.trim());
        onClearError();
        onToast('Link pasted from clipboard!', 'success');
      } else {
        onToast('Clipboard is empty.', 'info');
      }
    } catch {
      onToast('Unable to read clipboard. Please paste manually.', 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      onToast('Please enter a TikTok video URL first.', 'error');
      return;
    }
    onAnalyze();
  };

  return (
    <div className="relative pt-6 sm:pt-10 pb-8 px-4 sm:px-6 max-w-4xl mx-auto text-center">
      {/* Background radial accent glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[540px] h-64 sm:h-80 bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-blue-500/15 blur-3xl rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Main Headings */}
      <div className="space-y-3 mb-8">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          Download <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">TikTok Videos</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          Save videos you are authorized to download. Fast, high-definition MP4 and audio extraction with creator rights respect.
        </p>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
        <div
          className={`relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-[#111827]/90 border transition-all duration-200 shadow-2xl ${
            isFocused
              ? 'border-purple-500/80 ring-4 ring-purple-500/20 shadow-purple-500/10'
              : 'border-slate-700/80 hover:border-slate-600'
          }`}
        >
          {/* Input field */}
          <div className="relative flex-1 w-full flex items-center">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                onChangeUrl(e.target.value);
                if (error) onClearError();
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Paste TikTok video link (e.g. tiktok.com/@creator/video/...)"
              disabled={isLoading}
              className="w-full bg-transparent pl-4 pr-16 py-3 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none disabled:opacity-60"
            />

            {/* In-field clear button if text exists */}
            {url && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  onChangeUrl('');
                  onClearError();
                }}
                className="absolute right-10 p-1 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* In-field paste shortcut */}
            {!isLoading && (
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2 px-2 py-1 text-xs font-semibold text-purple-300 hover:text-purple-200 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/40 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>
            )}
          </div>

          {/* Analyze Video CTA button */}
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze Video</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading Progress State Indicator */}
      {isLoading && (
        <div className="mt-6 max-w-md mx-auto p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 animate-in fade-in duration-300">
          <div className="flex items-center justify-center gap-3 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            <span>{loadingStep || 'Inspecting TikTok URL and creator permissions...'}</span>
          </div>
          <div className="w-full bg-purple-950/80 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-400 h-1.5 rounded-full w-2/3 animate-pulse" />
          </div>
        </div>
      )}

      {/* Error Message with Help */}
      {error && !isLoading && (
        <div className="mt-5 max-w-2xl mx-auto p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-left flex items-start gap-3 animate-in fade-in">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-rose-200">Unable to Process Video</p>
            <p className="text-rose-300/90">{error}</p>
            <div className="text-xs text-rose-400/80 pt-1">
              Tip: Make sure the video is public on TikTok and not restricted or removed.
            </div>
          </div>
          <button
            onClick={onClearError}
            className="text-rose-400 hover:text-rose-200 p-1 ml-auto shrink-0"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sample Quick-Test Links */}
      {sampleVideos.length > 0 && !isLoading && (
        <div className="mt-8 pt-6 border-t border-slate-800/80 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Quick Test Samples (Click to load)</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sampleVideos.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all text-left flex items-center gap-2 ${
                  sample.downloadPermitted
                    ? 'bg-slate-800/70 hover:bg-slate-700/80 text-slate-200 border-slate-700/70 hover:border-purple-500/50'
                    : 'bg-amber-950/30 hover:bg-amber-950/50 text-amber-200/90 border-amber-800/40'
                }`}
              >
                {sample.downloadPermitted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
                )}
                <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]">
                  {sample.author.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {sample.downloadPermitted ? 'Permitted' : 'Restricted demo'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
