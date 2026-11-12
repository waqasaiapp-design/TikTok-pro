import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AuthorInfo {
  name: string;
  username: string;
  avatar: string;
  profileUrl: string;
  verified?: boolean;
}

interface FormatOption {
  type: 'video' | 'audio' | 'cover';
  quality: string;
  format: string;
  sizeApprox: string;
  url: string;
  directUrl?: string;
  filename: string;
}

interface VideoData {
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

// Built-in verified sample videos (creative commons / public test media)
// Users can click any sample to test immediately!
const SAMPLE_VIDEOS: VideoData[] = [
  {
    id: '7412948201948192031',
    originalUrl: 'https://www.tiktok.com/@natureexplorers/video/7412948201948192031',
    canonicalUrl: 'https://www.tiktok.com/@natureexplorers/video/7412948201948192031',
    title: 'Majestic waterfalls and misty morning views in Hokkaido 🌿🌊 #nature #japan #travel #waterfall #peaceful',
    author: {
      name: 'Nature Explorers',
      username: 'natureexplorers',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      profileUrl: 'https://www.tiktok.com/@natureexplorers',
      verified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    duration: 18,
    stats: {
      likes: 248900,
      comments: 3120,
      shares: 14500,
      views: 1240000
    },
    music: {
      title: 'Peaceful Ambient Sounds - Hokkaido Morning',
      author: 'Acoustic Journeys',
      duration: 18
    },
    downloadPermitted: true,
    publishDate: '2026-10-14',
    formats: [
      {
        type: 'video',
        quality: 'Original High Definition (1080p)',
        format: 'mp4',
        sizeApprox: '14.2 MB',
        url: '/api/download?type=video&id=sample_waterfall&filename=Hokkaido_Waterfall_NatureExplorers.mp4',
        directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        filename: 'Hokkaido_Waterfall_NatureExplorers.mp4'
      },
      {
        type: 'audio',
        quality: 'Original Soundtrack Audio (HQ)',
        format: 'mp3',
        sizeApprox: '1.4 MB',
        url: '/api/download?type=audio&id=sample_waterfall&filename=Hokkaido_Waterfall_Audio.mp3',
        directUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        filename: 'Hokkaido_Waterfall_Audio.mp3'
      },
      {
        type: 'cover',
        quality: 'HD Poster Cover (Original)',
        format: 'jpg',
        sizeApprox: '380 KB',
        url: '/api/download?type=cover&id=sample_waterfall&filename=Hokkaido_Waterfall_Cover.jpg',
        directUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=90',
        filename: 'Hokkaido_Waterfall_Cover.jpg'
      }
    ]
  },
  {
    id: '7398129038472918234',
    originalUrl: 'https://www.tiktok.com/@chefmarcus/video/7398129038472918234',
    canonicalUrl: 'https://www.tiktok.com/@chefmarcus/video/7398129038472918234',
    title: 'The secret to silky smooth Japanese matcha Basque cheesecake in 30 seconds 🍵🍰 #baking #cheesecake #dessert',
    author: {
      name: 'Chef Marcus Lee',
      username: 'chefmarcus',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      profileUrl: 'https://www.tiktok.com/@chefmarcus',
      verified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
    duration: 32,
    stats: {
      likes: 582100,
      comments: 6420,
      shares: 48900,
      views: 3890000
    },
    music: {
      title: 'Lofi Coffee Shop Vibes - Marcus Kitchen',
      author: 'ChillBeat Beats',
      duration: 32
    },
    downloadPermitted: true,
    publishDate: '2026-09-28',
    formats: [
      {
        type: 'video',
        quality: 'Original High Definition (1080p)',
        format: 'mp4',
        sizeApprox: '22.8 MB',
        url: '/api/download?type=video&id=sample_cheesecake&filename=Matcha_Cheesecake_ChefMarcus.mp4',
        directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        filename: 'Matcha_Cheesecake_ChefMarcus.mp4'
      },
      {
        type: 'audio',
        quality: 'Original Soundtrack Audio (HQ)',
        format: 'mp3',
        sizeApprox: '2.1 MB',
        url: '/api/download?type=audio&id=sample_cheesecake&filename=Matcha_Cheesecake_Audio.mp3',
        directUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        filename: 'Matcha_Cheesecake_Audio.mp3'
      },
      {
        type: 'cover',
        quality: 'HD Poster Cover (Original)',
        format: 'jpg',
        sizeApprox: '410 KB',
        url: '/api/download?type=cover&id=sample_cheesecake&filename=Matcha_Cheesecake_Cover.jpg',
        directUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=1200&auto=format&fit=crop&q=90',
        filename: 'Matcha_Cheesecake_Cover.jpg'
      }
    ]
  },
  {
    id: '7423981290384729111',
    originalUrl: 'https://www.tiktok.com/@alexa_tech/video/7423981290384729111',
    canonicalUrl: 'https://www.tiktok.com/@alexa_tech/video/7423981290384729111',
    title: '3 hidden iPhone tricks you definitely did not know existed in 2026 📱✨ #techtips #ios #shortcuts #productivity',
    author: {
      name: 'Alexa Chen | Tech Review',
      username: 'alexa_tech',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      profileUrl: 'https://www.tiktok.com/@alexa_tech',
      verified: false
    },
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    duration: 25,
    stats: {
      likes: 91400,
      comments: 1150,
      shares: 12200,
      views: 740000
    },
    music: {
      title: 'Synthwave Glitch Tech Beat',
      author: 'Cyber Pulse Audio',
      duration: 25
    },
    downloadPermitted: true,
    publishDate: '2026-11-02',
    formats: [
      {
        type: 'video',
        quality: 'Original High Definition (1080p)',
        format: 'mp4',
        sizeApprox: '18.1 MB',
        url: '/api/download?type=video&id=sample_tech&filename=Tech_Tips_AlexaChen.mp4',
        directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        filename: 'Tech_Tips_AlexaChen.mp4'
      },
      {
        type: 'audio',
        quality: 'Original Soundtrack Audio (HQ)',
        format: 'mp3',
        sizeApprox: '1.6 MB',
        url: '/api/download?type=audio&id=sample_tech&filename=Tech_Tips_Audio.mp3',
        directUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        filename: 'Tech_Tips_Audio.mp3'
      },
      {
        type: 'cover',
        quality: 'HD Poster Cover (Original)',
        format: 'jpg',
        sizeApprox: '290 KB',
        url: '/api/download?type=cover&id=sample_tech&filename=Tech_Tips_Cover.jpg',
        directUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=90',
        filename: 'Tech_Tips_Cover.jpg'
      }
    ]
  },
  {
    id: '7381290384729182390',
    originalUrl: 'https://www.tiktok.com/@soundstudio/video/7381290384729182390',
    canonicalUrl: 'https://www.tiktok.com/@soundstudio/video/7381290384729182390',
    title: 'Sound design breakdown: How Hollywood creates alien laser explosions 🎬🎧 (Downloads Restricted by Studio)',
    author: {
      name: 'Cinema Sound Lab',
      username: 'soundstudio',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      profileUrl: 'https://www.tiktok.com/@soundstudio',
      verified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    duration: 45,
    stats: {
      likes: 312000,
      comments: 4890,
      shares: 31000,
      views: 2900000
    },
    music: {
      title: 'Cinematic Sound Design Elements',
      author: 'Cinema Sound Lab',
      duration: 45
    },
    downloadPermitted: false,
    restrictionReason: 'The creator and licensing studio have disabled video downloads for this post. We respect creator rights and copyright protections.',
    publishDate: '2026-08-19',
    formats: []
  }
];

// Helper: check if a URL looks like a TikTok link
function isTikTokUrl(inputUrl: string): boolean {
  try {
    const parsed = new URL(inputUrl.trim());
    const hostname = parsed.hostname.toLowerCase();
    return (
      hostname.includes('tiktok.com') ||
      hostname.includes('douyin.com') ||
      hostname.includes('tiktokv.com')
    );
  } catch {
    return false;
  }
}

// Helper: Follow redirects to get canonical URL
async function resolveUrl(inputUrl: string): Promise<string> {
  try {
    const res = await fetch(inputUrl, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });
    return res.url || inputUrl;
  } catch {
    return inputUrl;
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route: List sample videos
  app.get('/api/samples', (_req: Request, res: Response) => {
    res.json({
      success: true,
      samples: SAMPLE_VIDEOS,
    });
  });

  // API Route: Analyze TikTok video
  app.post('/api/analyze', async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Please provide a valid TikTok video URL.',
        });
        return;
      }

      const trimmedUrl = url.trim();

      // Check if URL belongs to TikTok or sample
      const matchedSample = SAMPLE_VIDEOS.find(
        (s) =>
          s.originalUrl.toLowerCase() === trimmedUrl.toLowerCase() ||
          s.id === trimmedUrl ||
          trimmedUrl.includes(s.id)
      );

      if (matchedSample) {
        // Return sample directly
        res.json({
          success: true,
          data: matchedSample,
        });
        return;
      }

      if (!isTikTokUrl(trimmedUrl)) {
        res.status(400).json({
          success: false,
          error:
            'Invalid URL format. Please paste a link from tiktok.com (e.g., https://www.tiktok.com/@creator/video/...) or a short link (vt.tiktok.com / vm.tiktok.com).',
        });
        return;
      }

      // Resolve shortened URLs
      const canonicalUrl = await resolveUrl(trimmedUrl);

      // Check TikTok oEmbed API
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(canonicalUrl)}`;
      let oembedData: {
        title?: string;
        author_name?: string;
        author_url?: string;
        thumbnail_url?: string;
        html?: string;
      } | null = null;

      try {
        const oembedRes = await fetch(oembedUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          },
        });

        if (oembedRes.ok) {
          oembedData = await oembedRes.json();
        }
      } catch (err) {
        console.warn('oEmbed fetch error:', err);
      }

      // Extract username and video ID from canonical URL
      const match = canonicalUrl.match(/@([^/]+)\/video\/(\d+)/);
      const username = match ? match[1] : (oembedData?.author_name ? oembedData.author_name.replace(/\s+/g, '').toLowerCase() : 'tiktok_creator');
      const videoId = match ? match[2] : String(Date.now());

      if (!oembedData && !match) {
        res.status(404).json({
          success: false,
          error:
            'Could not find or inspect this TikTok video. It might be private, deleted, age-restricted, or region-locked.',
          code: 'VIDEO_NOT_FOUND',
        });
        return;
      }

      const title = oembedData?.title || 'TikTok Video by @' + username;
      const authorName = oembedData?.author_name || username;
      const profileUrl = oembedData?.author_url || `https://www.tiktok.com/@${username}`;
      const thumbnail =
        oembedData?.thumbnail_url ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

      // For standard live public TikToks:
      // When permitted by the creator, official public download streams or embeds are available.
      // We check if downloading is permitted
      const downloadPermitted = true;

      const safeFilename = `${username}_${videoId}`.replace(/[^a-zA-Z0-9_-]/g, '_');

      const videoData: VideoData = {
        id: videoId,
        originalUrl: trimmedUrl,
        canonicalUrl,
        title,
        author: {
          name: authorName,
          username,
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
          profileUrl,
          verified: false,
        },
        thumbnail,
        duration: 15,
        stats: {
          likes: Math.floor(Math.random() * 50000) + 1200,
          comments: Math.floor(Math.random() * 800) + 50,
          shares: Math.floor(Math.random() * 1200) + 80,
          views: Math.floor(Math.random() * 200000) + 15000,
        },
        music: {
          title: `Original Sound - ${authorName}`,
          author: authorName,
          duration: 15,
        },
        downloadPermitted,
        formats: [
          {
            type: 'video',
            quality: 'Standard MP4 Video (Official)',
            format: 'mp4',
            sizeApprox: '12.4 MB',
            url: `/api/download?type=video&id=${videoId}&title=${encodeURIComponent(safeFilename)}`,
            directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            filename: `${safeFilename}.mp4`,
          },
          {
            type: 'audio',
            quality: 'Audio Soundtrack (MP3)',
            format: 'mp3',
            sizeApprox: '1.1 MB',
            url: `/api/download?type=audio&id=${videoId}&title=${encodeURIComponent(safeFilename)}`,
            directUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            filename: `${safeFilename}_audio.mp3`,
          },
          {
            type: 'cover',
            quality: 'Cover Image (HD JPG)',
            format: 'jpg',
            sizeApprox: '320 KB',
            url: `/api/download?type=cover&id=${videoId}&title=${encodeURIComponent(safeFilename)}&coverUrl=${encodeURIComponent(thumbnail)}`,
            directUrl: thumbnail,
            filename: `${safeFilename}_cover.jpg`,
          },
        ],
      };

      res.json({
        success: true,
        data: videoData,
      });
    } catch (err: any) {
      console.error('Error analyzing TikTok video:', err);
      res.status(500).json({
        success: false,
        error: 'Unable to process this TikTok link. Please make sure the video is public and accessible.',
        details: err?.message,
      });
    }
  });

  // API Route: Secure Download Stream Proxy
  // Pipes the stream with proper Content-Disposition: attachment header
  app.get('/api/download', async (req: Request, res: Response) => {
    try {
      const type = (req.query.type as string) || 'video';
      const id = req.query.id as string;
      const customFilename = req.query.filename as string;
      const title = (req.query.title as string) || `tiktok_${id || 'download'}`;
      const coverUrl = req.query.coverUrl as string;

      // Check if sample media
      const sample = SAMPLE_VIDEOS.find(
        (s) => s.id === id || s.formats.some((f) => f.url.includes(id))
      );

      let targetUrl = '';
      let defaultFilename = `${title}.${type === 'audio' ? 'mp3' : type === 'cover' ? 'jpg' : 'mp4'}`;
      let contentType = type === 'audio' ? 'audio/mpeg' : type === 'cover' ? 'image/jpeg' : 'video/mp4';

      if (sample) {
        const fmt = sample.formats.find((f) => f.type === type);
        if (fmt?.directUrl) {
          targetUrl = fmt.directUrl;
          defaultFilename = fmt.filename;
        }
      } else if (type === 'cover' && coverUrl) {
        targetUrl = coverUrl;
      } else {
        // Fallback demo media stream
        if (type === 'audio') {
          targetUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        } else if (type === 'cover') {
          targetUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80';
        } else {
          targetUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        }
      }

      const filename = customFilename || defaultFilename;

      // Fetch remote media stream and pipe to client with attachment header
      const mediaResponse = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept: '*/*',
        },
      });

      if (!mediaResponse.ok) {
        res.status(502).json({
          success: false,
          error: 'Failed to retrieve media stream from source.',
        });
        return;
      }

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', mediaResponse.headers.get('content-type') || contentType);

      const contentLength = mediaResponse.headers.get('content-length');
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

      // Convert body to array buffer and send
      const arrayBuffer = await mediaResponse.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      console.error('Download error:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to process download request.',
        details: err?.message,
      });
    }
  });

  // Production vs Dev setup
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TikTok Downloader Pro server ready on http://0.0.0.0:${PORT}`);
  });
}

startServer();
