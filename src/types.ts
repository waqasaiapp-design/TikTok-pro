export interface AuthorInfo {
  name: string;
  username: string;
  avatar: string;
  profileUrl: string;
  verified?: boolean;
}

export interface FormatOption {
  type: 'video' | 'audio' | 'cover';
  quality: string;
  format: string;
  sizeApprox: string;
  url: string;
  directUrl?: string;
  filename: string;
}

export interface VideoData {
  id: string;
  originalUrl: string;
  canonicalUrl: string;
  title: string;
  author: AuthorInfo;
  thumbnail: string;
  duration: number;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  music: {
    title: string;
    author: string;
    duration: number;
  };
  downloadPermitted: boolean;
  restrictionReason?: string | null;
  formats: FormatOption[];
  publishDate?: string;
}

export interface DownloadHistoryItem {
  id: string;
  videoId: string;
  title: string;
  authorName: string;
  authorUsername: string;
  thumbnail: string;
  formatType: 'video' | 'audio' | 'cover';
  formatLabel: string;
  downloadUrl: string;
  filename: string;
  originalUrl: string;
  timestamp: number;
}

export type PageTab = 'home' | 'how-to-use' | 'faq' | 'privacy' | 'contact';
export type ThemeMode = 'dark' | 'light';
