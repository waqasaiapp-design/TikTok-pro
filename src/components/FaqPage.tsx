import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, FileCheck, AlertCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqs = [
    {
      category: 'legal',
      q: 'Is it legal to download videos with TikTok Downloader Pro?',
      a: 'Yes, provided that you download publicly accessible videos where the creator and TikTok have explicitly permitted downloading, and you use the downloaded files for personal, non-commercial offline viewing or fair use. We strictly prohibit unauthorized redistribution or commercial exploitation.',
    },
    {
      category: 'permissions',
      q: 'Why does the app show "Downloads Restricted by Creator" for some videos?',
      a: 'TikTok provides creators with the choice to disable downloads on their account or specific videos. TikTok Downloader Pro strictly honors creator permissions and platform policies. If a creator turns off downloads or the video is private, downloading is disabled in our app.',
    },
    {
      category: 'legal',
      q: 'Does this app remove TikTok watermarks or bypass DRM?',
      a: 'No. In strict compliance with copyright standards and TikTok terms of service, this application does not strip creator watermarks, bypass platform security, or crack private DRM. It retrieves original authorized public media streams with full attribution to the creator.',
    },
    {
      category: 'technical',
      q: 'Which video formats and qualities are supported?',
      a: 'We support High Definition MP4 video streams, original soundtrack MP3 audio files, and high-resolution JPEG cover posters. The resolution matches the original upload provided by the creator (up to 1080p).',
    },
    {
      category: 'devices',
      q: 'How do I download videos on an iPhone or iPad?',
      a: 'Copy the TikTok link, open Safari, paste it into TikTok Downloader Pro, and tap Download MP4. When the download finishes, tap the Safari Downloads arrow in the bottom bar, tap the file, tap the Share icon, and select "Save Video" to store it directly in your iOS Photos app.',
    },
    {
      category: 'devices',
      q: 'Where are downloaded videos stored on Android?',
      a: 'On Android, downloaded files are saved to your default "Download" folder. You can access them immediately through Google Files, Samsung Gallery, or any file manager app on your phone.',
    },
    {
      category: 'technical',
      q: 'Do I need to create an account or provide my TikTok password?',
      a: 'No! You never need to register, create an account, or enter your TikTok credentials. We never ask for personal login info, ensuring complete privacy and security.',
    },
    {
      category: 'technical',
      q: 'Is there a limit on how many videos I can analyze or download?',
      a: 'There is no limit for personal authorized use. You can inspect and save public videos whenever you need to archive your own content or study creative references offline.',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'permissions', label: 'Permissions & Rights' },
    { id: 'technical', label: 'Formats & Quality' },
    { id: 'devices', label: 'iPhone & Android' },
    { id: 'legal', label: 'Terms & Compliance' },
  ];

  const filteredFaqs =
    activeCategory === 'all' ? faqs : faqs.filter((f) => f.category === activeCategory);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-in fade-in">
      {/* Page Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Frequently Asked <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Questions</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Find clear answers regarding downloading permissions, supported devices, audio extraction, and our strict copyright compliance.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setOpenIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.q}
              className="rounded-2xl bg-[#111827]/80 border border-slate-800 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-sm sm:text-base text-slate-100">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-200">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust Callout */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-white text-sm sm:text-base">Have more questions?</h4>
          <p className="text-xs sm:text-sm text-slate-400">
            Reach out through our Contact page or read our Privacy Policy for more details on data safety.
          </p>
        </div>
      </div>
    </div>
  );
};
