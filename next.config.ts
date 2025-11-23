
import type {NextConfig} from 'next';

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheStartUrl: true,
  runtimeCaching: [
    // --- Cache First Strategy for Static Assets ---
    // For images, fonts, etc.
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|webp|woff2)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
    // --- Network First for API Calls (e.g., GitHub API) ---
    {
      urlPattern: /^https:\/\/api\.github\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'github-api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 Day
        },
      },
    },
    // --- Stale While Revalidate for Avatars ---
    {
      urlPattern: /^https:\/\/avatars\.githubusercontent\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'github-avatars-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        },
      },
    },
    // --- Stale While Revalidate for Pages/Documents ---
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 24 * 60 * 60, // 1 Day
        },
      },
    },
  ],
  manifest: {
    name: "GitRoasted",
    short_name: "GitRoasted",
    description: "Analyze your GitHub profile, get roasted, compete on the leaderboard",
    start_url: "/",
    display: "standalone",
    theme_color: "#6366F1",
    background_color: "#0F172A",
    orientation: "portrait-primary",
    categories: ["developer tools", "productivity", "social"],
    icons: [
        {
            "src": "/app-icon.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "/app-icon.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "/app-icon.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "/app-icon.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        }
    ],
    screenshots: [
      {
        "src": "https://storage.googleapis.com/a-studio-images/public/sample-apps/gitroasted/screenshot-main.png",
        "sizes": "1280x720",
        "type": "image/png",
        "form_factor": "wide",
        "label": "Main interface of GitRoasted"
      },
      {
        "src": "https://storage.googleapis.com/a-studio-images/public/sample-apps/gitroasted/screenshot-card.png",
        "sizes": "1280x720",
        "type": "image/png",
        "form_factor": "wide",
        "label": "Example of a generated profile card"
      },
      {
        "src": "https://storage.googleapis.com/a-studio-images/public/sample-apps/gitroasted/screenshot-main-mobile.png",
        "sizes": "720x1280",
        "type": "image/png",
        "form_factor": "narrow",
        "label": "Main interface of GitRoasted on Mobile"
      },
      {
        "src": "https://storage.googleapis.com/a-studio-images/public/sample-apps/gitroasted/screenshot-card-mobile.png",
        "sizes": "720x1280",
        "type": "image/png",
        "form_factor": "narrow",
        "label": "Example of a generated profile card on Mobile"
      }
    ],
    share_target: {
      action: "/",
      method: "GET",
      params: {
        title: "username",
        text: "Check out this GitHub profile on GitRoasted",
        url: "url"
      }
    },
    shortcuts: [
      {
        name: "View Leaderboard",
        url: "/leaderboard",
        description: "See the top-roasted developers."
      },
      {
        name: "Roast a Random Profile",
        url: "/?username=google",
        description: "Roast a random developer profile."
      }
    ]
  }
});


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default withPWA(nextConfig);
