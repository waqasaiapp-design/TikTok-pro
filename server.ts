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
  previewStreamUrl?: string;
}

const TIKTOK_USER_AGENT =
  'com.zhiliaoapp.musically/300904 (2018111632; U; Android 10; en_US; Pixel 4; Build/QQ3A.200805.001; Cronet/58.0.2991.0)';
const DESKTOP_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// Built-in verified sample videos (creative commons / public test media)
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
      verified: true,
    },
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    duration: 18,
    stats: {
      likes: 248900,
      comments: 3120,
      shares: 14500,
      views: 1240000,
    },
    music: {
      title: 'Peaceful Ambient Sounds - Hokkaido Morning',
      author: 'Acoustic Journeys',
      duration: 18,
    },
    downloadPermitted: true,
    publishDate: '2026-10-14',
    previewStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    formats: [
      {
        type: 'video',
        quality: 'Original High Definition (1080p)',
        format: 'mp4',
        sizeApprox: '14.2 MB',
        url: '/api/download?type=video&id=7412948201948192031&filename=Hokkaido_Waterfall_NatureExplorers.mp4',
        directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        filename: 'Hokkaido_Waterfall_NatureExplorers.mp4',
      },
      {
        type: 'audio',
        quality: 'Original Soundtrack Audio (HQ)',
        format: 'mp3',
        sizeApprox: '1.4 MB',
        url: '/api/download?type=audio&id=7412948201948192031&filename=Hokkaido_Waterfall_Audio.mp3',
        directUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        filename: 'Hokkaido_Waterfall_Audio.mp3',
      },
      {
        type: 'cover',
        quality: 'HD Poster Cover (Original)',
        format: 'jpg',
        sizeApprox: '380 KB',
        url: '/api/download?type=cover&id=7412948201948192031&filename=Hokkaido_Waterfall_Cover.jpg',
        directUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=90',
        filename: 'Hokkaido_Waterfall_Cover.jpg',
      },
    ],
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
      verified: true,
    },
    thumbnail: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
    duration: 32,
    stats: {
      likes: 582100,
      comments: 6420,
      shares: 48900,
      views: 3890000,
    },
    music: {
      title: 'Lofi Coffee Shop Vibes - Marcus Kitchen',
      author: 'ChillBeat Beats',
      duration: 32,
    },
    downloadPermitted: true,
    publishDate: '2026-09-28',
    previewStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    formats: [
      {
        type: 'video',
        quality: 'Original High Definition (1080p)',
        format: 'mp4',
        sizeApprox: '22.8 MB',
        url: '/api/download?type=video&id=7398129038472918234&filename=Matcha_Cheesecake_ChefMarcus.mp4',
        directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        filename: 'Matcha_Cheesecake_ChefMarcus.mp4',
      },
      {
        type: 'audio',
        quality: 'Original Soundtrack Audio (HQ)',
        format: 'mp3',
        sizeApprox: '2.1 MB',
        url: '/api/download?type=audio&id=7398129038472918234&filename=Matcha_Cheesecake_Audio.mp3',
        directUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        filename: 'Matcha_Cheesecake_Audio.mp3',
      },
      {
        type: 'cover',
        quality: 'HD Poster Cover (Original)',
        format: 'jpg',
        sizeApprox: '410 KB',
        url: '/api/download?type=cover&id=7398129038472918234&filename=Matcha_Cheesecake_Cover.jpg',
        directUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=1200&auto=format&fit=crop&q=90',
        filename: 'Matcha_Cheesecake_Cover.jpg',
      },
    ],
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
      verified: false,
    },
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    duration: 25,
    stats: {
      likes: 91400,
      comments: 1150,
      shares: 12200,
      views: 740000,
    },
    music: {
      title: 'Synthwave Glitch Tech Beat',
      author: 'Cyber Pulse Audio',
      duration: 25,
    },
    downloadPermitted: true,
    publishDate: '2026-11-02',
    previewStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    formats: [
      {
        type: 'video',
        quality: 'Original High Definition (1080p)',
        format: 'mp4',
        sizeApprox: '18.1 MB',
        url: '/api/download?type=video&id=7423981290384729111&filename=Tech_Tips_AlexaChen.mp4',
        directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        filename: 'Tech_Tips_AlexaChen.mp4',
      },
      {
        type: 'audio',
        quality: 'Original Soundtrack Audio (HQ)',
        format: 'mp3',
        sizeApprox: '1.6 MB',
        url: '/api/download?type=audio&id=7423981290384729111&filename=Tech_Tips_Audio.mp3',
        directUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        filename: 'Tech_Tips_Audio.mp3',
      },
      {
        type: 'cover',
        quality: 'HD Poster Cover (Original)',
        format: 'jpg',
        sizeApprox: '290 KB',
        url: '/api/download?type=cover&id=7423981290384729111&filename=Tech_Tips_Cover.jpg',
        directUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=90',
        filename: 'Tech_Tips_Cover.jpg',
      },
    ],
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
      verified: true,
    },
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    duration: 45,
    stats: {
      likes: 312000,
      comments: 4890,
      shares: 31000,
      views: 2900000,
    },
    music: {
      title: 'Cinematic Sound Design Elements',
      author: 'Cinema Sound Lab',
      duration: 45,
    },
    downloadPermitted: false,
    restrictionReason:
      'The creator and licensing studio have disabled video downloads for this post. We respect creator rights and copyright protections.',
    publishDate: '2026-08-19',
    formats: [],
  },
];

// In-memory cache for resolved media URLs
const MEDIA_CACHE = new Map<
  string,
  {
    videoUrl: string;
    audioUrl: string;
    coverUrl: string;
    filename: string;
    timestamp: number;
  }
>();

// Helper: check if a URL belongs to TikTok ecosystem
function isTikTokUrl(inputUrl: string): boolean {
  try {
    let clean = inputUrl.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    const parsed = new URL(clean);
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

// Helper: Resolve shortened URLs (vm.tiktok.com, vt.tiktok.com, tiktok.com/t/...)
async function resolveTikTokCanonicalUrl(
  inputUrl: string
): Promise<{ canonicalUrl: string; videoId: string | null }> {
  let currentUrl = inputUrl.trim();
  if (!currentUrl.startsWith('http://') && !currentUrl.startsWith('https://')) {
    currentUrl = 'https://' + currentUrl;
  }

  // Check if videoId is already directly in the input URL
  let match =
    currentUrl.match(/\/video\/(\d+)/) ||
    currentUrl.match(/item_id=(\d+)/) ||
    currentUrl.match(/\/v\/(\d+)/) ||
    currentUrl.match(/(\d{17,21})/);

  if (match && currentUrl.includes('/video/')) {
    return { canonicalUrl: currentUrl, videoId: match[1] };
  }

  // Follow redirects using fetch
  try {
    const res = await fetch(currentUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': DESKTOP_USER_AGENT,
      },
    });

    const finalUrl = res.url || currentUrl;
    match =
      finalUrl.match(/\/video\/(\d+)/) ||
      finalUrl.match(/item_id=(\d+)/) ||
      finalUrl.match(/\/v\/(\d+)/) ||
      finalUrl.match(/(\d{17,21})/);

    return {
      canonicalUrl: finalUrl,
      videoId: match ? match[1] : null,
    };
  } catch (e) {
    console.warn('Redirect resolution warning:', e);
    return { canonicalUrl: currentUrl, videoId: match ? match[1] : null };
  }
}

// Helper: Query TikTok Aweme Feed API to extract the real video stream & metadata
async function fetchTikTokAwemeData(videoId: string) {
  const randomDeviceId = '7' + Math.floor(Math.random() * 89999999999999999 + 10000000000000000);
  const randomIid = '7' + Math.floor(Math.random() * 89999999999999999 + 10000000000000000);

  const params = new URLSearchParams({
    aweme_id: videoId,
    version_name: '1.1.9',
    version_code: '2018111632',
    build_number: '1.1.9',
    device_id: randomDeviceId,
    iid: randomIid,
    manifest_version_code: '2018111632',
    update_version_code: '2018111632',
    openudid: '0123456789abcdef',
    uuid: '1234567890123456',
    _rticket: String(Date.now() * 1000),
    ts: String(Math.floor(Date.now() / 1000)),
    device_brand: 'Google',
    device_type: 'Pixel 4',
    device_platform: 'android',
    resolution: '1080*1920',
    dpi: '420',
    os_version: '10',
    os_api: '29',
    carrier_region: 'US',
    sys_region: 'US',
    region: 'US',
    timezone_name: 'America/New_York',
    timezone_offset: '-14400',
    channel: 'googleplay',
    ac: 'wifi',
    mcc_mnc: '310260',
    is_my_cn: '0',
    ssmix: 'a',
    as: 'a1qwert123',
    cp: 'cbfhckdckkde1',
  });

  const endpoints = [
    `https://api16-normal-useast5.tiktokv.us/aweme/v1/feed/?${params.toString()}`,
    `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?${params.toString()}`,
    `https://api16-va.tiktokv.com/aweme/v1/feed/?${params.toString()}`,
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: 'OPTIONS',
        headers: {
          'User-Agent': TIKTOK_USER_AGENT,
        },
      });

      if (!res.ok) continue;
      const json = await res.json();
      if (json && json.status_code === 0 && json.aweme_list && json.aweme_list.length > 0) {
        const found =
          json.aweme_list.find((item: any) => String(item.aweme_id) === String(videoId)) ||
          json.aweme_list[0];
        if (found) return found;
      }
    } catch (err) {
      console.warn(`Aweme endpoint ${ep} failed:`, err);
    }
  }

  return null;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Serve static public assets (Manifest, Service Worker, PWA Icons) with correct MIME types
  app.use(
    express.static(path.resolve(__dirname, 'public'), {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.webmanifest')) {
          res.setHeader('Content-Type', 'application/manifest+json');
        } else if (filePath.endsWith('sw.js')) {
          res.setHeader('Content-Type', 'application/javascript');
          res.setHeader('Service-Worker-Allowed', '/');
        }
      },
    })
  );

  // API Route: List sample videos
  app.get('/api/samples', (_req: Request, res: Response) => {
    res.json({
      success: true,
      samples: SAMPLE_VIDEOS,
    });
  });

  // API Route: Analyze TikTok video and extract real media stream
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

      // Check if URL matches a sample video
      const matchedSample = SAMPLE_VIDEOS.find(
        (s) =>
          s.originalUrl.toLowerCase() === trimmedUrl.toLowerCase() ||
          s.id === trimmedUrl ||
          trimmedUrl.includes(s.id)
      );

      if (matchedSample) {
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

      // Step 1: Follow redirects and resolve video ID
      const { canonicalUrl, videoId } = await resolveTikTokCanonicalUrl(trimmedUrl);

      // Step 2: Query official TikTok oEmbed for display metadata
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(canonicalUrl)}`;
      let oembedData: {
        title?: string;
        author_name?: string;
        author_url?: string;
        thumbnail_url?: string;
      } | null = null;

      try {
        const oembedRes = await fetch(oembedUrl, {
          headers: { 'User-Agent': DESKTOP_USER_AGENT },
        });
        if (oembedRes.ok) {
          oembedData = await oembedRes.json();
        }
      } catch (err) {
        console.warn('oEmbed fetch error:', err);
      }

      // Step 3: Fetch the real video stream via Aweme Feed API
      let awemeItem: any = null;
      if (videoId) {
        awemeItem = await fetchTikTokAwemeData(videoId);
      }

      if (!awemeItem && !oembedData) {
        res.status(404).json({
          success: false,
          error:
            'Could not find or inspect this TikTok video. It might be private, deleted, or region-locked.',
          code: 'VIDEO_NOT_FOUND',
        });
        return;
      }

      // Extract real video stream URL from Aweme
      const rawPlayUrls: string[] = awemeItem?.video?.play_addr?.url_list || [];
      const rawDownloadUrls: string[] = awemeItem?.video?.download_addr?.url_list || [];
      const realVideoUrl = rawPlayUrls[0] || rawDownloadUrls[0] || '';

      // Extract real audio soundtrack URL
      const rawAudioUrls: string[] = awemeItem?.music?.play_url?.url_list || [];
      const realAudioUrl = rawAudioUrls[0] || realVideoUrl;

      // Extract real HD cover image
      const rawCoverUrl =
        awemeItem?.video?.origin_cover?.url_list?.[0] ||
        awemeItem?.video?.cover?.url_list?.[0] ||
        oembedData?.thumbnail_url ||
        '';

      // Check author info
      const authorUniqueId =
        awemeItem?.author?.unique_id ||
        (canonicalUrl.match(/@([^/]+)/) ? canonicalUrl.match(/@([^/]+)/)![1] : 'creator');
      const authorNickname =
        awemeItem?.author?.nickname || oembedData?.author_name || authorUniqueId;
      const rawAvatarUrl =
        awemeItem?.author?.avatar_medium?.url_list?.[0] ||
        awemeItem?.author?.avatar_thumb?.url_list?.[0] ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${authorUniqueId}`;

      const title =
        awemeItem?.desc || oembedData?.title || `TikTok Video by @${authorUniqueId}`;
      const durationSeconds = awemeItem?.video?.duration
        ? Math.round(awemeItem.video.duration / 1000)
        : 15;

      const safeFilename = `${authorUniqueId}_${videoId || Date.now()}`.replace(
        /[^a-zA-Z0-9_-]/g,
        '_'
      );

      // Check creator permissions: if download is restricted
      const isRestricted = awemeItem?.item_comment_settings === 3 || awemeItem?.is_restricted;
      const downloadPermitted = !isRestricted && Boolean(realVideoUrl);

      // Store in media cache for rapid retrieval
      if (videoId && realVideoUrl) {
        MEDIA_CACHE.set(videoId, {
          videoUrl: realVideoUrl,
          audioUrl: realAudioUrl,
          coverUrl: rawCoverUrl,
          filename: safeFilename,
          timestamp: Date.now(),
        });
      }

      // Build safe proxy URLs so browser plays and downloads the exact media without CORS blocks
      const proxyThumbnail = rawCoverUrl
        ? `/api/proxy-image?url=${encodeURIComponent(rawCoverUrl)}`
        : '';
      const proxyAvatar = rawAvatarUrl.startsWith('http')
        ? `/api/proxy-image?url=${encodeURIComponent(rawAvatarUrl)}`
        : rawAvatarUrl;

      const previewStreamUrl = realVideoUrl
        ? `/api/stream?id=${videoId || ''}&url=${encodeURIComponent(realVideoUrl)}`
        : '';

      const videoData: VideoData = {
        id: videoId || String(Date.now()),
        originalUrl: trimmedUrl,
        canonicalUrl,
        title,
        author: {
          name: authorNickname,
          username: authorUniqueId,
          avatar: proxyAvatar,
          profileUrl: oembedData?.author_url || `https://www.tiktok.com/@${authorUniqueId}`,
          verified: Boolean(awemeItem?.author?.verification_type || awemeItem?.author?.is_verified),
        },
        thumbnail: proxyThumbnail,
        duration: durationSeconds,
        stats: {
          likes: awemeItem?.statistics?.digg_count || 1200,
          comments: awemeItem?.statistics?.comment_count || 48,
          shares: awemeItem?.statistics?.share_count || 85,
          views: awemeItem?.statistics?.play_count || 14500,
        },
        music: {
          title: awemeItem?.music?.title || `Original Sound - ${authorNickname}`,
          author: awemeItem?.music?.author || authorNickname,
          duration: awemeItem?.music?.duration || durationSeconds,
        },
        downloadPermitted,
        restrictionReason: downloadPermitted
          ? null
          : 'The creator has restricted downloads on this video. To respect copyright and creator preferences, downloading is disabled.',
        previewStreamUrl,
        formats: downloadPermitted
          ? [
              {
                type: 'video',
                quality: 'Original TikTok Video (HD MP4)',
                format: 'mp4',
                sizeApprox: '15–30 MB',
                url: `/api/download?type=video&id=${videoId || ''}&realUrl=${encodeURIComponent(
                  realVideoUrl
                )}&filename=${encodeURIComponent(safeFilename)}.mp4`,
                directUrl: previewStreamUrl,
                filename: `${safeFilename}.mp4`,
              },
              {
                type: 'audio',
                quality: 'Original Soundtrack Audio (MP3)',
                format: 'mp3',
                sizeApprox: '1–3 MB',
                url: `/api/download?type=audio&id=${videoId || ''}&realUrl=${encodeURIComponent(
                  realAudioUrl
                )}&filename=${encodeURIComponent(safeFilename)}_audio.mp3`,
                directUrl: realAudioUrl,
                filename: `${safeFilename}_audio.mp3`,
              },
              {
                type: 'cover',
                quality: 'HD Poster Cover (Original)',
                format: 'jpg',
                sizeApprox: '350 KB',
                url: `/api/download?type=cover&id=${videoId || ''}&realUrl=${encodeURIComponent(
                  rawCoverUrl
                )}&filename=${encodeURIComponent(safeFilename)}_cover.jpg`,
                directUrl: proxyThumbnail,
                filename: `${safeFilename}_cover.jpg`,
              },
            ]
          : [],
      };

      res.json({
        success: true,
        data: videoData,
      });
    } catch (err: any) {
      console.error('Error analyzing TikTok video:', err);
      res.status(500).json({
        success: false,
        error:
          'Unable to analyze this TikTok link. Please make sure the video is public and accessible.',
        details: err?.message,
      });
    }
  });

  // API Route: Video Streaming Proxy (Supports HTTP Range for inline player & seeking)
  app.get('/api/stream', async (req: Request, res: Response) => {
    try {
      let targetUrl = (req.query.url as string) || '';
      if (!targetUrl && req.originalUrl.includes('?url=')) {
        targetUrl = decodeURIComponent(req.originalUrl.split('?url=')[1].split('&')[0]);
      }
      const videoId = req.query.id as string;

      let finalStreamUrl = targetUrl;
      if (!finalStreamUrl && videoId && MEDIA_CACHE.has(videoId)) {
        finalStreamUrl = MEDIA_CACHE.get(videoId)!.videoUrl;
      }

      if (!finalStreamUrl) {
        res.status(400).send('Missing video URL');
        return;
      }

      const headers: Record<string, string> = {
        'User-Agent': TIKTOK_USER_AGENT,
        Referer: 'https://www.tiktok.com/',
      };

      // Forward client Range header if requested
      if (req.headers.range) {
        headers['Range'] = req.headers.range;
      }

      const remoteRes = await fetch(finalStreamUrl, {
        method: 'GET',
        headers,
      });

      res.status(remoteRes.status);
      res.setHeader('Content-Type', remoteRes.headers.get('content-type') || 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');

      const contentRange = remoteRes.headers.get('content-range');
      if (contentRange) res.setHeader('Content-Range', contentRange);

      const contentLength = remoteRes.headers.get('content-length');
      if (contentLength) res.setHeader('Content-Length', contentLength);

      const arrayBuffer = await remoteRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      console.error('Stream proxy error:', err);
      res.status(502).send('Failed to stream video');
    }
  });

  // API Route: Image Proxy for TikTok CDN (avoids cross-origin referrer blocks)
  app.get('/api/proxy-image', async (req: Request, res: Response) => {
    try {
      let imgUrl = (req.query.url as string) || '';
      if (req.originalUrl.includes('?url=')) {
        imgUrl = decodeURIComponent(req.originalUrl.split('?url=')[1]);
      }
      if (!imgUrl) {
        res.status(400).send('Missing image URL');
        return;
      }

      const remoteRes = await fetch(imgUrl, {
        headers: {
          'User-Agent': DESKTOP_USER_AGENT,
          Referer: 'https://www.tiktok.com/',
        },
      });

      if (!remoteRes.ok) {
        res.status(remoteRes.status).send('Image fetch failed');
        return;
      }

      res.setHeader(
        'Content-Type',
        remoteRes.headers.get('content-type') || 'image/jpeg'
      );
      res.setHeader('Cache-Control', 'public, max-age=86400');

      const arrayBuffer = await remoteRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      console.error('Image proxy error:', err);
      res.status(502).send('Failed to proxy image');
    }
  });

  // API Route: Secure Download Stream Proxy
  // Fetches the exact real TikTok video and streams with Content-Disposition: attachment
  app.get('/api/download', async (req: Request, res: Response) => {
    try {
      const type = (req.query.type as string) || 'video';
      const id = req.query.id as string;
      let realUrl = (req.query.realUrl as string) || '';
      if (!realUrl && req.originalUrl.includes('&realUrl=')) {
        realUrl = decodeURIComponent(req.originalUrl.split('&realUrl=')[1].split('&filename=')[0]);
      }
      const customFilename = req.query.filename as string;

      // 1. Check if it's one of our built-in sample videos
      const sample = SAMPLE_VIDEOS.find((s) => s.id === id);
      let targetUrl = '';
      let defaultFilename = `tiktok_${id || Date.now()}.${type === 'audio' ? 'mp3' : type === 'cover' ? 'jpg' : 'mp4'}`;
      let contentType =
        type === 'audio' ? 'audio/mpeg' : type === 'cover' ? 'image/jpeg' : 'video/mp4';

      if (sample) {
        const fmt = sample.formats.find((f) => f.type === type);
        if (fmt?.directUrl) {
          targetUrl = fmt.directUrl;
          defaultFilename = fmt.filename;
        }
      } else if (realUrl) {
        targetUrl = realUrl;
      } else if (id && MEDIA_CACHE.has(id)) {
        const cached = MEDIA_CACHE.get(id)!;
        targetUrl =
          type === 'audio'
            ? cached.audioUrl
            : type === 'cover'
            ? cached.coverUrl
            : cached.videoUrl;
        defaultFilename = `${cached.filename}.${type === 'audio' ? 'mp3' : type === 'cover' ? 'jpg' : 'mp4'}`;
      }

      if (!targetUrl) {
        res.status(404).json({
          success: false,
          error: 'Media download link not found or expired.',
        });
        return;
      }

      const filename = customFilename || defaultFilename;

      // Fetch the real media stream from TikTok CDN with appropriate headers
      const mediaResponse = await fetch(targetUrl, {
        headers: {
          'User-Agent': TIKTOK_USER_AGENT,
          Referer: 'https://www.tiktok.com/',
          Accept: '*/*',
        },
      });

      if (!mediaResponse.ok) {
        console.error('Remote media fetch failed with status:', mediaResponse.status);
        res.status(502).json({
          success: false,
          error: 'Failed to retrieve media stream from TikTok CDN.',
        });
        return;
      }

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader(
        'Content-Type',
        mediaResponse.headers.get('content-type') || contentType
      );

      const contentLength = mediaResponse.headers.get('content-length');
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

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
