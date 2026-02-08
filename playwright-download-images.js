// npm init -y

// npm install playwright

// node .\playwright-download-images.js "https://br.pinterest.com/pin/302867143712840552/"

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { chromium } = require('playwright');

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(`Failed to download: ${url}, status: ${res.statusCode}`);
      }
    }).on('error', reject);
  });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.argv[2]);

  // Get all image URLs
  const imageUrls = await page.$$eval('img', imgs =>
    imgs.map(img => img.src).filter(src => !!src)
  );

  console.log(`Found ${imageUrls.length} images`);

  // Create folder
  const folder = path.join(__dirname, 'images');
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  // Download each image
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    const ext = path.extname(new URL(url).pathname) || '.jpg';
    const filepath = path.join(folder, `image_${i}${ext}`);
    try {
      await downloadImage(url, filepath);
      console.log(`Downloaded: ${filepath}`);
    } catch (err) {
      console.error(err);
    }
  }

  await browser.close();
})();
