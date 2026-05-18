import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import https from 'https';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  // Asynchronous local image downloader for Titan DigiStack
  const IMAGES_DIR = path.resolve(__dirname, 'public', 'images');
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const products = [
    { id: "wp-theme-1", url: "https://vas.com.bd/wp-content/uploads/2025/07/Digital-Product-Selling-Website-Template.jpg" },
    { id: "wp-theme-2", url: "https://vas.com.bd/wp-content/uploads/2025/09/KitNinja-–-Ultimate-Ecommerce-WordPress-Template-Buy-in-Bangladesh-–-VAS.jpg" },
    { id: "wp-theme-3", url: "https://vas.com.bd/wp-content/uploads/2025/06/Bangla-Landing-Page-Template.jpg" },
    { id: "wp-theme-4", url: "https://vas.com.bd/wp-content/uploads/2025/10/1000-Elementor-Landing-Page-Templates-_-Readymade-Elementor-Pro-Website-Kit-Bundle-for-WordPress.jpg" },
    { id: "wp-theme-5", url: "https://vas.com.bd/wp-content/uploads/2025/06/Astra-pro-WP-Theme.vas_.com_.bd_.jpg" },
    { id: "wp-theme-6", url: "https://vas.com.bd/wp-content/uploads/2025/06/GeneratePress.vas_.com_.bd_.jpg" },
    
    { id: "wp-plugin-1", url: "https://vas.com.bd/wp-content/uploads/2025/07/ACF-Pro.jpg" },
    { id: "wp-plugin-2", url: "https://vas.com.bd/wp-content/uploads/2024/12/Elementor-Pro-Premium-Plugin-Official-License-Activation-Price-in-Bangladesh.jpg" },
    { id: "wp-plugin-3", url: "https://vas.com.bd/wp-content/uploads/2024/12/Rank-Math-pro-price-in-bd-1.jpg" },
    
    { id: "graphic-1", url: "https://vas.com.bd/wp-content/uploads/2025/08/Canva-Pro.jpg" },
    { id: "graphic-2", url: "https://vas.com.bd/wp-content/uploads/2025/08/adobe-creative-cloud-Price-in-BD.jpg" },
    { id: "graphic-3", url: "https://vas.com.bd/wp-content/uploads/2025/09/Midjourney-AI-Price-in-Bangladesh-Buy-Subscription-from-VAS.jpg" },

    { id: "ai-1", url: "https://vas.com.bd/wp-content/uploads/2025/06/CHATGPT-PLUS-Price-in-BD.jpg" },
    { id: "ai-2", url: "https://vas.com.bd/wp-content/uploads/2025/12/claude-ai-api-price-in-bangladesh.jpg" },
    { id: "ai-3", url: "https://vas.com.bd/wp-content/uploads/2025/10/Linkedin-Premium-Business-Price-in-Bangladesh.jpg" },

    { id: "soft-1", url: "https://vas.com.bd/wp-content/uploads/2025/08/Windows-7-Windows-8-Windows-10-Windows-11.jpg" },
    { id: "soft-2", url: "https://vas.com.bd/wp-content/uploads/2025/08/Microsoft-Office-365-Subscription_VAS.jpg" },

    { id: "tut-1", url: "https://vas.com.bd/wp-content/uploads/2025/06/Advance-SEO-Couse-by-UY-Lab_vas.jpg" },
    { id: "serv-1", url: "https://vas.com.bd/wp-content/uploads/2025/04/WebDesign_VAS.jpg" },
    
    { id: "fallback", url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=500&h=600&q=80" }
  ];

  function downloadImage(url: string, dest: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          downloadImage(res.headers.location!, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Status ${res.statusCode}`));
          return;
        }
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        fileStream.on('error', (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
      }).on('error', reject);
    });
  }

  // Smart background synchronizer to download assets exactly once per target version
  const VERSION_FILE = path.resolve(IMAGES_DIR, '.version');
  const TARGET_VERSION = '2';
  let needsDownload = false;

  if (!fs.existsSync(VERSION_FILE)) {
    needsDownload = true;
  } else {
    try {
      const currentVersion = fs.readFileSync(VERSION_FILE, 'utf8').trim();
      if (currentVersion !== TARGET_VERSION) {
        needsDownload = true;
      }
    } catch (e) {
      needsDownload = true;
    }
  }

  if (needsDownload) {
    console.log(`[Vite Image Sync] Target version (${TARGET_VERSION}) mismatch or missing. Downloading real WooCommerce assets...`);
    products.forEach((prod) => {
      const dest = path.resolve(IMAGES_DIR, `${prod.id}.jpg`);
      downloadImage(prod.url, dest)
        .then(() => console.log(`[Vite Image Sync] Successfully downloaded ${prod.id}.jpg`))
        .catch((err) => console.error(`[Vite Image Sync] Failed ${prod.id}:`, err.message));
    });
    try {
      fs.writeFileSync(VERSION_FILE, TARGET_VERSION, 'utf8');
      console.log(`[Vite Image Sync] Version updated to ${TARGET_VERSION}`);
    } catch (e) {
      console.error('[Vite Image Sync] Failed to write version file:', e.message);
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
