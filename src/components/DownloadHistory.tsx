import React from 'react';
import { DownloadHistoryItem } from '../types.ts';
import { Clock, Trash2, Download, ExternalLink, FileVideo, FileAudio, Image as ImageIcon } from 'lucide-react';

interface DownloadHistoryProps {
  history: DownloadHistoryItem[];
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
  onReDownload: (item: DownloadHistoryItem) => void;
}

export const DownloadHistory: React.FC<DownloadHistoryProps> = ({
  history,
  onClearHistory,
  onRemoveItem,
  onReDownload,
}) => {
  if (history.length === 0) {
    return null;
  }

  const formatTimestamp = (ts: number): string => {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 my-10 animate-in fade-in">
      <div className="bg-[#111827]/70 rounded-3xl border border-slate-800 p-6 sm:p-8 backdrop-blur-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Recent Downloads</h2>
            <span className="text-xs text-slate-400 font-mono">({history.length})</span>
          </div>

          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>

        {/* History Item List */}
        <div className="mt-4 divide-y divide-slate-800/80">
          {history.map((item) => {
            const iconMap = {
              video: <FileVideo className="w-4 h-4 text-purple-400" />,
              audio: <FileAudio className="w-4 h-4 text-blue-400" />,
              cover: <ImageIcon className="w-4 h-4 text-emerald-400" />,
            };

            return (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-3 sm:gap-4 hover:bg-slate-800/30 px-2 rounded-xl transition-colors group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-16 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0 relative">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs flex items-center justify-center py-0.5">
                      {iconMap[item.formatType]}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-200 truncate group-hover:text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>@{item.authorUsername}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-purple-300">{item.formatLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onReDownload(item)}
                    className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white transition-colors"
                    title="Download again"
                    aria-label="Download again"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <a
                    href={item.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="View original on TikTok"
                    aria-label="View original on TikTok"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove from history"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
