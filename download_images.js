const fs = require('fs');
const path = require('path');
const https = require('https');

const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Create the directory if it does not exist
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const products = [
  { id: "wp-theme-1", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "wp-theme-2", url: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "wp-theme-3", url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "wp-theme-4", url: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "wp-theme-5", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "wp-theme-6", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&h=600&q=80" },
  
  { id: "wp-plugin-1", url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "wp-plugin-2", url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "wp-plugin-3", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&h=600&q=80" },
  
  { id: "graphic-1", url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "graphic-2", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "graphic-3", url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=500&h=600&q=80" },

  { id: "ai-1", url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "ai-2", url: "https://images.unsplash.com/photo-1547954575-855750c57bd3?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "ai-3", url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&h=600&q=80" },

  { id: "soft-1", url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "soft-2", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&h=600&q=80" },

  { id: "tut-1", url: "https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?auto=format&fit=crop&w=500&h=600&q=80" },
  { id: "serv-1", url: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=500&h=600&q=80" },
  
  { id: "fallback", url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=500&h=600&q=80" }
];

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        downloadImage(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (Status Code: ${res.statusCode})`));
        return;
      }

      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(dest, () => {}); // Delete file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log(`Downloading ${products.length} images to ${IMAGES_DIR}...`);
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const dest = path.join(IMAGES_DIR, `${product.id}.jpg`);
    console.log(`[${i + 1}/${products.length}] Downloading ${product.id} from ${product.url.substring(0, 50)}...`);
    try {
      await downloadImage(product.url, dest);
      console.log(`Successfully saved ${product.id}.jpg`);
    } catch (err) {
      console.error(`Error downloading ${product.id}:`, err.message);
    }
  }
  console.log('All image downloads completed successfully!');
}

run();
