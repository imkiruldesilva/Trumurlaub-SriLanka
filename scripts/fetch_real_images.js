process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');
const https = require('https');

const imageTasks = [
  // Hero & Backgrounds
  {
    target: 'assets/images/hero/hero-bg.jpg',
    query: 'Beauty of Sigiriya by Binuka.jpg',
    fallbackQuery: 'Sigiriya Rock Fortress Sri Lanka'
  },
  {
    target: 'assets/images/about/about-sri-lanka.jpg',
    query: 'Tea plantation near Nuwara Eliya, Sri Lanka.jpg',
    fallbackQuery: 'Tea plantations Nuwara Eliya Sri Lanka'
  },
  {
    target: 'assets/images/about/founder-nirosh.jpg',
    placeholder: true // prompt: "Use a real owner photograph only if supplied. Otherwise create a neutral placeholder."
  },
  // 14 Destinations
  {
    target: 'assets/images/destinations/sigiriya.jpg',
    query: 'Beauty of Sigiriya by Binuka.jpg',
    fallbackQuery: 'Sigiriya rock Sri Lanka'
  },
  {
    target: 'assets/images/destinations/ella.jpg',
    query: 'Nine Arch Bridge in Demodara, Sri Lanka.jpg',
    fallbackQuery: 'Nine Arch Bridge Demodara Sri Lanka'
  },
  {
    target: 'assets/images/destinations/kandy.jpg',
    query: 'Temple of the Tooth, Kandy.jpg',
    fallbackQuery: 'Temple of the Sacred Tooth Relic Kandy Sri Lanka'
  },
  {
    target: 'assets/images/destinations/galle.jpg',
    query: 'Galle Lighthouse, Sri Lanka.jpg',
    fallbackQuery: 'Galle Fort Lighthouse Sri Lanka'
  },
  {
    target: 'assets/images/destinations/mirissa.jpg',
    query: 'Mirissa Beach, Sri Lanka.jpg',
    fallbackQuery: 'Mirissa beach Sri Lanka'
  },
  {
    target: 'assets/images/destinations/yala.jpg',
    query: 'Leopard in Yala National Park, Sri Lanka.jpg',
    fallbackQuery: 'Yala National Park Sri Lanka leopard'
  },
  {
    target: 'assets/images/destinations/nuwara-eliya.jpg',
    query: 'Tea plantation near Nuwara Eliya, Sri Lanka.jpg',
    fallbackQuery: 'Nuwara Eliya tea country Sri Lanka'
  },
  {
    target: 'assets/images/destinations/bentota.jpg',
    query: 'Bentota Beach, Sri Lanka.jpg',
    fallbackQuery: 'Bentota beach Sri Lanka'
  },
  {
    target: 'assets/images/destinations/arugam-bay.jpg',
    query: 'Arugam Bay, Sri Lanka.jpg',
    fallbackQuery: 'Arugam Bay beach Sri Lanka'
  },
  {
    target: 'assets/images/destinations/dambulla.jpg',
    query: 'Golden Temple of Dambulla, Sri Lanka.jpg',
    fallbackQuery: 'Dambulla cave temple Sri Lanka'
  },
  {
    target: 'assets/images/destinations/trincomalee.jpg',
    query: 'Koneswaram Temple, Trincomalee.jpg',
    fallbackQuery: 'Nilaveli beach Trincomalee Sri Lanka'
  },
  {
    target: 'assets/images/destinations/udawalawe.jpg',
    query: 'Elephants in Udawalawe National Park, Sri Lanka.jpg',
    fallbackQuery: 'Udawalawe National Park Sri Lanka elephants'
  },
  {
    target: 'assets/images/destinations/anuradhapura.jpg',
    query: 'Ruwanwelisaya Stupa, Anuradhapura, Sri Lanka.jpg',
    fallbackQuery: 'Ruwanwelisaya Anuradhapura Sri Lanka'
  },
  {
    target: 'assets/images/destinations/polonnaruwa.jpg',
    query: 'Gal Vihara, Polonnaruwa, Sri Lanka.jpg',
    fallbackQuery: 'Gal Vihara Polonnaruwa Sri Lanka'
  },
  // Additional locations
  {
    target: 'assets/images/destinations/negombo.jpg',
    query: 'Negombo beach, Sri Lanka.jpg',
    fallbackQuery: 'Negombo beach Sri Lanka catamarans'
  },
  {
    target: 'assets/images/destinations/colombo.jpg',
    query: 'Colombo Lotus Tower, Sri Lanka.jpg',
    fallbackQuery: 'Lotus Tower Colombo Sri Lanka'
  },
  // Tour packages
  {
    target: 'assets/images/tours/tour-4days.jpg',
    query: 'Beauty of Sigiriya by Binuka.jpg',
    fallbackQuery: 'Sigiriya rock Sri Lanka'
  },
  {
    target: 'assets/images/tours/tour-6days.jpg',
    query: 'Nine Arch Bridge in Demodara, Sri Lanka.jpg',
    fallbackQuery: 'Nine Arch Bridge Demodara Sri Lanka'
  },
  {
    target: 'assets/images/tours/tour-8days.jpg',
    query: 'Galle Lighthouse, Sri Lanka.jpg',
    fallbackQuery: 'Galle Fort Lighthouse Sri Lanka'
  },
  // Excursions
  {
    target: 'assets/images/excursions/exc-sigiriya.jpg',
    query: 'Beauty of Sigiriya by Binuka.jpg',
    fallbackQuery: 'Sigiriya rock Sri Lanka'
  },
  {
    target: 'assets/images/excursions/exc-kandy.jpg',
    query: 'Temple of the Tooth, Kandy.jpg',
    fallbackQuery: 'Temple of the Sacred Tooth Relic Kandy Sri Lanka'
  },
  {
    target: 'assets/images/excursions/exc-galle.jpg',
    query: 'Galle Lighthouse, Sri Lanka.jpg',
    fallbackQuery: 'Galle Fort Lighthouse Sri Lanka'
  },
  {
    target: 'assets/images/excursions/exc-ella.jpg',
    query: 'Nine Arch Bridge in Demodara, Sri Lanka.jpg',
    fallbackQuery: 'Nine Arch Bridge Demodara Sri Lanka'
  },
  {
    target: 'assets/images/excursions/exc-yala.jpg',
    query: 'Leopard in Yala National Park, Sri Lanka.jpg',
    fallbackQuery: 'Yala National Park Sri Lanka'
  },
  {
    target: 'assets/images/excursions/exc-udawalawe.jpg',
    query: 'Elephants in Udawalawe National Park, Sri Lanka.jpg',
    fallbackQuery: 'Udawalawe elephants Sri Lanka'
  },
  {
    target: 'assets/images/excursions/exc-colombo.jpg',
    query: 'Colombo Lotus Tower, Sri Lanka.jpg',
    fallbackQuery: 'Lotus Tower Colombo Sri Lanka'
  },
  {
    target: 'assets/images/excursions/exc-bentota.jpg',
    query: 'Bentota Beach, Sri Lanka.jpg',
    fallbackQuery: 'Bentota beach river safari Sri Lanka'
  },
  {
    target: 'assets/images/excursions/exc-nuwara-eliya.jpg',
    query: 'Tea plantation near Nuwara Eliya, Sri Lanka.jpg',
    fallbackQuery: 'Nuwara Eliya tea plantations Sri Lanka'
  },
  {
    target: 'assets/images/excursions/exc-mirissa.jpg',
    query: 'Mirissa Beach, Sri Lanka.jpg',
    fallbackQuery: 'Mirissa whale watching Sri Lanka'
  },
  // Gallery
  {
    target: 'assets/images/gallery/gallery-sigiriya.jpg',
    query: 'Beauty of Sigiriya by Binuka.jpg',
    fallbackQuery: 'Sigiriya rock Sri Lanka'
  },
  {
    target: 'assets/images/gallery/gallery-ella.jpg',
    query: 'Nine Arch Bridge in Demodara, Sri Lanka.jpg',
    fallbackQuery: 'Nine Arch Bridge Demodara Sri Lanka'
  },
  {
    target: 'assets/images/gallery/gallery-yala.jpg',
    query: 'Leopard in Yala National Park, Sri Lanka.jpg',
    fallbackQuery: 'Yala National Park Sri Lanka'
  },
  {
    target: 'assets/images/gallery/gallery-galle.jpg',
    query: 'Galle Lighthouse, Sri Lanka.jpg',
    fallbackQuery: 'Galle Fort Lighthouse Sri Lanka'
  },
  {
    target: 'assets/images/gallery/gallery-mirissa.jpg',
    query: 'Mirissa Beach, Sri Lanka.jpg',
    fallbackQuery: 'Mirissa beach Sri Lanka'
  },
  {
    target: 'assets/images/gallery/gallery-kandy.jpg',
    query: 'Temple of the Tooth, Kandy.jpg',
    fallbackQuery: 'Temple of the Tooth Kandy Sri Lanka'
  }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'TraumurlaubLankaPhotoVerification/1.0 (info@traumurlaublanka.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'TraumurlaubLankaPhotoVerification/1.0 (info@traumurlaublanka.com)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP Status ${res.statusCode} for ${url}`));
      }
      const dir = path.dirname(destPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(destPath);
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function searchWikimedia(searchTerm) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=6&format=json&srlimit=5`;
  const res = await fetchJson(searchUrl);
  if (res && res.query && res.query.search && res.query.search.length > 0) {
    return res.query.search[0].title;
  }
  return null;
}

async function getImageInfo(fileTitle) {
  const cleanTitle = fileTitle.startsWith('File:') ? fileTitle : `File:${fileTitle}`;
  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(cleanTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
  const res = await fetchJson(infoUrl);
  if (res && res.query && res.query.pages) {
    const pageId = Object.keys(res.query.pages)[0];
    const page = res.query.pages[pageId];
    if (page.imageinfo && page.imageinfo[0]) {
      return page.imageinfo[0].thumburl || page.imageinfo[0].url;
    }
  }
  return null;
}

async function run() {
  console.log(`Starting verified Sri Lankan photograph download (${imageTasks.length} assets)...`);
  
  for (const task of imageTasks) {
    if (task.placeholder) {
      console.log(`Skipping placeholder task: ${task.target}`);
      continue;
    }

    try {
      let fileTitle = task.query;
      let imgUrl = await getImageInfo(fileTitle);

      if (!imgUrl && task.fallbackQuery) {
        console.log(`Searching Wikimedia for: ${task.fallbackQuery}`);
        const foundTitle = await searchWikimedia(task.fallbackQuery);
        if (foundTitle) {
          imgUrl = await getImageInfo(foundTitle);
        }
      }

      if (imgUrl) {
        console.log(`Downloading: ${task.target} from ${imgUrl}`);
        await downloadFile(imgUrl, task.target);
        console.log(`✓ Saved: ${task.target}`);
      } else {
        console.warn(`! Could not find image for ${task.target}`);
      }
    } catch (err) {
      console.error(`Error processing ${task.target}:`, err.message);
    }
  }

  console.log('All image tasks completed.');
}

run();
