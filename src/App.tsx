import React, { useState, useEffect } from 'react';
import { PageTab, ThemeMode, VideoData, FormatOption, DownloadHistoryItem } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroInput } from './components/HeroInput.tsx';
import { VideoResult } from './components/VideoResult.tsx';
import { DownloadHistory } from './components/DownloadHistory.tsx';
import { HowToUsePage } from './components/HowToUsePage.tsx';
import { FaqPage } from './components/FaqPage.tsx';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { Footer } from './components/Footer.tsx';
import { Toast, ToastMessage } from './components/Toast.tsx';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Music,
  Download,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const STORAGE_KEY_HISTORY = 'tt_pro_download_history_v1';
const STORAGE_KEY_THEME = 'tt_pro_theme_preference';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('home');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [sampleVideos, setSampleVideos] = useState<VideoData[]>([]);
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize theme and load history from localStorage
  useEffect(() => {
    // Theme setup
    const savedTheme = (localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode) || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Load history
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('Failed to parse history:', e);
    }

    // Fetch samples from backend API
    fetch('/api/samples')
      .then((res) => res.json())
      .then((data) => {
        if (data?.samples) {
          setSampleVideos(data.samples);
        }
      })
      .catch((err) => {
        console.warn('Failed to load sample videos:', err);
      });
  }, []);

  // Theme toggle
  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY_THEME, nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toast notification helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Analyze video URL
  const handleAnalyze = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || url).trim();
    if (!targetUrl) {
      addToast('Please enter a TikTok video URL.', 'error');
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingStep('Resolving TikTok link and canonical address...');

    try {
      // Step 2
      setTimeout(() => {
        setLoadingStep('Checking creator permissions and download settings...');
      }, 600);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to inspect TikTok video.');
      }

      setCurrentVideo(data.data);
      addToast('Video analyzed successfully!', 'success');

      // Scroll to result smoothly
      setTimeout(() => {
        const resultEl = document.getElementById('video-result-anchor');
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } catch (err: any) {
      const errMsg = err?.message || 'Unable to inspect video. Please verify the URL.';
      setError(errMsg);
      addToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Select sample video
  const handleSelectSample = (sample: VideoData) => {
    setUrl(sample.originalUrl);
    setError(null);
    setCurrentVideo(sample);
    addToast(`Loaded sample by ${sample.author.name}`, 'info');

    setTimeout(() => {
      const resultEl = document.getElementById('video-result-anchor');
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Download handler
  const handleDownload = (fmt: FormatOption) => {
    if (!currentVideo) return;

    // Check permission
    if (!currentVideo.downloadPermitted) {
      addToast('Download is disabled by the creator for this video.', 'error');
      return;
    }

    // Add to download history
    const historyItem: DownloadHistoryItem = {
      id: Date.now().toString(),
      videoId: currentVideo.id,
      title: currentVideo.title,
      authorName: currentVideo.author.name,
      authorUsername: currentVideo.author.username,
      thumbnail: currentVideo.thumbnail,
      formatType: fmt.type,
      formatLabel: fmt.quality,
      downloadUrl: fmt.url,
      filename: fmt.filename,
      originalUrl: currentVideo.canonicalUrl || currentVideo.originalUrl,
      timestamp: Date.now(),
    };

    const updatedHistory = [historyItem, ...history.filter((h) => h.videoId !== currentVideo.id)];
    setHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('Storage error:', e);
    }

    // Trigger download via anchor element
    const link = document.createElement('a');
    link.href = fmt.url;
    link.setAttribute('download', fmt.filename);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(`Download started: ${fmt.filename}`, 'success');
  };

  // Re-download from history
  const handleReDownload = (item: DownloadHistoryItem) => {
    const link = document.createElement('a');
    link.href = item.downloadUrl;
    link.setAttribute('download', item.filename);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`Re-downloading: ${item.filename}`, 'success');
  };

  // Remove single history item
  const handleRemoveHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    addToast('Item removed from history.', 'info');
  };

  // Clear entire history
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    addToast('Download history cleared.', 'info');
  };

  // Copy link
  const handleCopyLink = async (linkText: string) => {
    try {
      await navigator.clipboard.writeText(linkText);
      addToast('TikTok link copied to clipboard!', 'success');
    } catch {
      addToast('Failed to copy link.', 'error');
    }
  };

  // Share application
  const handleShareApp = async () => {
    const shareData = {
      title: 'TikTok Downloader Pro',
      text: 'Fast, high-quality TikTok Video & MP3 Downloader respecting creator permissions.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addToast('Application shared!', 'success');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyAppUrl();
        }
      }
    } else {
      copyAppUrl();
    }
  };

  const copyAppUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      addToast('App link copied to clipboard! Share it with friends.', 'success');
    } catch {
      addToast('Unable to share.', 'info');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-purple-600/30 selection:text-purple-200">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onShareApp={handleShareApp}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Hero Input Section */}
            <HeroInput
              url={url}
              onChangeUrl={setUrl}
              onAnalyze={() => handleAnalyze()}
              isLoading={isLoading}
              loadingStep={loadingStep}
              error={error}
              onClearError={() => setError(null)}
              sampleVideos={sampleVideos}
              onSelectSample={handleSelectSample}
              onToast={addToast}
            />

            {/* Video Result Anchor & Card */}
            <div id="video-result-anchor">
              {currentVideo && (
                <VideoResult
                  video={currentVideo}
                  onDownload={handleDownload}
                  onCopyLink={handleCopyLink}
                  onShare={(vid) => handleCopyLink(vid.canonicalUrl || vid.originalUrl)}
                />
              )}
            </div>

            {/* Download History Section */}
            <DownloadHistory
              history={history}
              onClearHistory={handleClearHistory}
              onRemoveItem={handleRemoveHistoryItem}
              onReDownload={handleReDownload}
            />

            {/* Feature Highlights Grid */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 my-16">
              <div className="text-center space-y-3 mb-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Engineered for Reliability</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Why Creators & Viewers Choose <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Pro</span>
                </h2>
                <p className="text-slate-400 text-sm">
                  We blend high-definition media extraction with strict adherence to creator permissions and platform copyright.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Full HD Quality</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Downloads the original highest available resolution without re-compression degradation.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Music className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Audio Soundtrack MP3</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Extract original trending audio tracks and creator sounds directly in crisp MP3 format.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Creator Rights Respected</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Downloads are only permitted when authorized by the creator and TikTok platform settings.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">100% Private & Local</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    No sign-up, no login credentials required. Your download history is stored solely on your device.
                  </p>
                </div>
              </div>
            </section>

            {/* How It Works Teaser Banner */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 my-14">
              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#111827] to-blue-950/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                    Simple 4-Step Process
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Need help saving videos to iPhone or Android?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                    Check out our illustrated walkthrough covering Safari photo saving, Android files, and desktop browser shortcuts.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('how-to-use');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-2 shrink-0 transition-colors"
                >
                  <span>View How to Use Guide</span>
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'how-to-use' && <HowToUsePage onGoHome={() => setActiveTab('home')} />}
        {activeTab === 'faq' && <FaqPage />}
        {activeTab === 'privacy' && <PrivacyPolicyPage />}
        {activeTab === 'contact' && <ContactPage onToast={addToast} />}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}
