import React, { useState } from 'react';
import { VideoData, FormatOption } from '../types.ts';
import {
  Download,
  Music,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ShieldCheck,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

interface VideoResultProps {
  video: VideoData;
  onDownload: (format: FormatOption) => void;
  onCopyLink: (link: string) => void;
  onShare: (video: VideoData) => void;
}

export const VideoResult: React.FC<VideoResultProps> = ({
  video,
  onDownload,
  onCopyLink,
  onShare,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'preview' | 'cover'>('preview');
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  // Format large numbers cleanly with tabular-nums
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const handleDownloadClick = async (fmt: FormatOption) => {
    setDownloadingFormat(fmt.type);
    try {
      await onDownload(fmt);
    } finally {
      setTimeout(() => {
        setDownloadingFormat(null);
      }, 1000);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 my-8 animate-in fade-in duration-300">
      <div className="bg-[#111827]/90 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Permission Status Header Banner */}
        <div
          className={`px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-medium ${
            video.downloadPermitted
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {video.downloadPermitted ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Authorized Media • Creator Downloads Permitted</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Download Restricted by Creator / Platform</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onCopyLink(video.canonicalUrl || video.originalUrl)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              title="Copy TikTok link"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
            <button
              onClick={() => onShare(video)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              title="Share video"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Media Preview */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-[9/16] max-h-[480px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group shadow-xl">
              {activeMediaTab === 'preview' ? (
                <video
                  key={video.id}
                  src={
                    video.previewStreamUrl ||
                    video.formats.find((f) => f.type === 'video')?.directUrl ||
                    video.formats.find((f) => f.type === 'video')?.url ||
                    ''
                  }
                  poster={video.thumbnail}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Duration badge */}
              {video.duration > 0 && (
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono font-medium text-white pointer-events-none">
                  0:{video.duration < 10 ? `0${video.duration}` : video.duration}
                </div>
              )}
            </div>

            {/* Media View Toggle Buttons */}
            <div className="flex items-center justify-center gap-2 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setActiveMediaTab('preview')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                  activeMediaTab === 'preview'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Video Preview
              </button>
              <button
                onClick={() => setActiveMediaTab('cover')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                  activeMediaTab === 'cover'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cover Poster
              </button>
            </div>
          </div>

          {/* Right Column: Video Details & Download Options */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Creator Profile Lockup */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={video.author.avatar}
                    alt={video.author.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/40 bg-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-white truncate">
                        {video.author.name}
                      </h3>
                      {video.author.verified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">@{video.author.username}</p>
                  </div>
                </div>

                <a
                  href={video.author.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 shrink-0 p-1.5 rounded-lg hover:bg-purple-950/40 transition-colors"
                >
                  <span>Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Title / Description */}
              <div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed break-words font-medium">
                  {video.title}
                </p>
              </div>

              {/* Music Soundtrack Tag */}
              {video.music && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                  <Music className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="truncate">{video.music.title}</span>
                </div>
              )}

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80">
                  <div className="flex items-center justify-center gap-1 text-rose-400 text-xs mb-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Likes</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-slate-100 tabular-nums">
                    {formatNumber(video.stats.likes)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80">
                  <div className="flex items-center justify-center gap-1 text-blue-400 text-xs mb-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Comments</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-slate-100 tabular-nums">
                    {formatNumber(video.stats.comments)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs mb-1">
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Shares</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-slate-100 tabular-nums">
                    {formatNumber(video.stats.shares)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80">
                  <div className="flex items-center justify-center gap-1 text-purple-400 text-xs mb-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Views</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-slate-100 tabular-nums">
                    {formatNumber(video.stats.views)}
                  </span>
                </div>
              </div>
            </div>

            {/* Download Options Section */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Available Downloads
              </h4>

              {video.downloadPermitted ? (
                <div className="space-y-2.5">
                  {video.formats.map((fmt) => {
                    const isCurrentLoading = downloadingFormat === fmt.type;
                    const iconMap = {
                      video: <FileVideo className="w-4 h-4 text-purple-400 shrink-0" />,
                      audio: <FileAudio className="w-4 h-4 text-blue-400 shrink-0" />,
                      cover: <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />,
                    };

                    const isPrimary = fmt.type === 'video';

                    return (
                      <button
                        key={fmt.type}
                        onClick={() => handleDownloadClick(fmt)}
                        disabled={isCurrentLoading}
                        className={`w-full p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 text-left group ${
                          isPrimary
                            ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-purple-400/30 shadow-lg shadow-purple-600/20'
                            : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/70 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-lg ${
                              isPrimary ? 'bg-white/20' : 'bg-slate-900/60'
                            }`}
                          >
                            {iconMap[fmt.type]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{fmt.quality}</p>
                            <p
                              className={`text-xs ${
                                isPrimary ? 'text-purple-100' : 'text-slate-400'
                              }`}
                            >
                              Format: {fmt.format.toUpperCase()} · Approx {fmt.sizeApprox}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isCurrentLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          ) : (
                            <div
                              className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${
                                isPrimary
                                  ? 'bg-white/20 text-white'
                                  : 'bg-purple-600/20 text-purple-300'
                              }`}
                            >
                              <Download className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Creator Restricted Warning */
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Download Disabled by Creator</span>
                  </div>
                  <p className="text-xs text-amber-300/80 leading-relaxed">
                    {video.restrictionReason ||
                      'The creator has disabled public downloads for this video in their TikTok privacy settings. TikTok Downloader Pro strictly respects creator choices and copyright protections.'}
                  </p>
                  <p className="text-[11px] text-amber-400/70 pt-1">
                    You can still bookmark or share the official link above.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
