/**
 * Ultimate Medpro Web Scraper (ES Module)
 * NEW: Pagination Support (Cào sạch tất cả các trang Xét nghiệm)
 * Run using: node scripts/crawler.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- TARGET API URLs ---
const URL_HOME_DATA = 'https://api-v2.medpro.com.vn/home-page/data';
const URL_MAIN_BANNER = 'https://cdn.medpro.vn/prod-partner/92b6d682-4b5a-4c94-ac54-97a077c0c6c5-homepage_banner.webp';

// --- DATA QUICK ACTIONS (HARDCODED ĐỂ BYPASS ANTI-BOT) ---
const RAW_QUICK_ACTIONS = [
  { name: "Đặt khám tại cơ sở", displayIcon: "https://prod-partner.s3-hcm-r1.longvan.net/ba823a61-7952-4914-85c6-b1375c47a6ba-dkcs.png", slug: "dat-kham-tai-co-so", id: "5ee7090454419e0019192012" },
  { name: "Đặt khám chuyên khoa", displayIcon: "https://cdn.medpro.vn/prod-partner/cfdec0ad-bac0-4470-8284-18d4e21c52ec-chuyen_khoa.png", slug: "dat-kham-chuyen-khoa", id: "6822bc5bcdeed50744296164" },
  { name: "Gọi video với bác sĩ", displayIcon: "https://prod-partner.s3-hcm-r1.longvan.net/bc4f36f0-c1aa-491c-854e-04ef3ace1c36-tele.png", slug: "tu-van-kham-benh-tu-xa", id: "64afcda8448150fc6562bb5b" },
  { name: "Đặt lịch xét nghiệm", displayIcon: "https://cdn.medpro.vn/prod-partner/298073be-5fbd-49b8-91ab-8400804609cc-dat-lich-xet-nghiem.png", slug: "dat-lich-xet-nghiem", id: "60ea6cd637a2390220004e63" },
  { name: "Đặt khám ngoài giờ", displayIcon: "https://cdn.medpro.vn/prod-partner/ddcbd479-84a6-4493-a06b-0f8dcf243ae8-ng.png", slug: "dat-kham-ngoai-gio", id: "677f6d4de85c06126d7a41a7" },
  { name: "Giúp việc cá nhân", displayIcon: "https://cdn.medpro.vn/prod-partner/ea4a5c5d-cc2c-4f71-8526-756879601f6b-frame_56750.png", slug: "giup-viec-ca-nhan", id: "686cc698f2076557d390dfff" },
  { name: "Khám doanh nghiệp", displayIcon: "https://cdn.medpro.vn/prod-partner/3d674f68-d662-49dc-810b-096db7e66dcc-khaam_aaoaa_n_pc.png", slug: "kham-suc-khoe-doanh-nghiep", id: "689ac5016583f56a0540e608" },
  { name: "Đặt khám theo bác sĩ", displayIcon: "https://cdn.medpro.vn/prod-partner/6585044a-9821-4301-86bf-41d1018e1930-bs.png", slug: "dat-kham-theo-bac-si", id: "60c0928f37a2392830001af3" }
];

// --- DIRECTORY SETUP ---
const PUBLIC_DIR = path.join(__dirname, '../public');
const DATA_DIR = path.join(__dirname, 'data'); 

const DIRS = {
  doctors: path.join(PUBLIC_DIR, 'images/doctors'),
  servicesHome: path.join(PUBLIC_DIR, 'images/services/home'), 
  servicesList: path.join(PUBLIC_DIR, 'images/services/list'), 
  specialties: path.join(PUBLIC_DIR, 'icons/specialties'),
  quickActions: path.join(PUBLIC_DIR, 'icons/quick-actions'),
  banners: path.join(PUBLIC_DIR, 'images'), 
  dataOutput: DATA_DIR
};

console.log('🧹 Cleaning up old generated assets...');

const BASE_DIRS = [
  path.join(PUBLIC_DIR, 'images/doctors'),
  path.join(PUBLIC_DIR, 'images/services'), 
  path.join(PUBLIC_DIR, 'icons/specialties'),
  path.join(PUBLIC_DIR, 'icons/quick-actions'),
  path.join(PUBLIC_DIR, 'images/hero-banner.webp'), 
  DATA_DIR
];

BASE_DIRS.forEach(dir => {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
});

Object.values(DIRS).forEach(dirPath => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// --- UTILITY FUNCTIONS ---
const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/đ/g, 'd')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  const cleanedStr = String(priceStr).replace(/\./g, '').replace(/[^\d]/g, '');
  return parseInt(cleanedStr, 10) || 0;
};

const downloadImage = (url, filepath) => {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) return resolve(null);
    const decodedUrl = decodeURIComponent(url); 
    const options = { headers: { 'User-Agent': 'Mozilla/5.0' } };
    https.get(decodedUrl, options, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => { fileStream.close(); resolve(filepath); });
      } else {
        resolve(null); 
      }
    }).on('error', () => resolve(null));
  });
};

// --- CORE CRAWLER LOGIC ---
const runCrawler = async () => {
  try {
    console.log('🚀 Starting Targeted Medpro Crawler...');
    const fetchOptions = { headers: { 'User-Agent': 'Mozilla/5.0' } };

    console.log('📥 Fetching Home API...');
    const homeRes = await fetch(URL_HOME_DATA, fetchOptions);
    const homeData = await homeRes.json();

    console.log('🖼️ Downloading Main Hero Banner (WebP)...');
    await downloadImage(URL_MAIN_BANNER, path.join(DIRS.banners, 'hero-banner.webp'));

    // 1. EXTRACT QUICK ACTIONS
    const featuresList = [];
    console.log(`⚙️ Processing ${RAW_QUICK_ACTIONS.length} Quick Actions...`);
    for (const item of RAW_QUICK_ACTIONS) {
      const cleanName = item.name.replace(/\n/g, ' ').trim();
      const fileName = `${slugify(cleanName)}.png`;
      const filePath = path.join(DIRS.quickActions, fileName);
      if (item.displayIcon) {
         await downloadImage(item.displayIcon, filePath);
         featuresList.push({ id: item.id, title: cleanName, iconUrl: `/icons/quick-actions/${fileName}`, slug: item.slug });
      }
    }

    // 2. EXTRACT SPECIALTIES
    const specialtiesList = [];
    const subjects = homeData.subjects?.data || [];
    console.log(`⚙️ Processing ${subjects.length} Specialties...`);
    for (const item of subjects) {
      if (!item.name) continue;
      const fileName = `${slugify(item.name)}.png`;
      const filePath = path.join(DIRS.specialties, fileName);
      const iconUrl = item.icon || item.imageUrl;
      if (iconUrl) await downloadImage(iconUrl, filePath);
      specialtiesList.push({ id: parseInt(item.order, 10) || item.id, name: item.name, iconUrl: `/icons/specialties/${fileName}` });
    }

    // 3. EXTRACT DOCTORS
    const doctorsList = [];
    const doctors = homeData.telemed_doctor_in_month?.data || [];
    console.log(`⚙️ Processing ${doctors.length} Doctors...`);
    for (const item of doctors) {
      const fileName = `doctor-${item.id}.jpg`;
      const filePath = path.join(DIRS.doctors, fileName);
      const avatarUrl = item.imageUrl || item.avatar;
      if (avatarUrl) await downloadImage(avatarUrl, filePath);
      doctorsList.push({
        id: item.id,
        fullName: `${item.role || ''} ${item.title}`.trim(),
        specialtyName: (item.subjects && item.subjects[0]) ? item.subjects[0].name : 'Chuyên khoa Nội',
        rating: parseFloat(item.rating) || 5.0,
        consultationFee: parsePrice(item.price),
        avatarUrl: `/images/doctors/${fileName}`
      });
    }

    // 4A. EXTRACT HOME LAB TESTS (TOP NỔI BẬT TỪ HOME API)
    const servicesHomeList = [];
    const serviceCategories = homeData.service_in_month?.data || [];
    const labTestCategory = serviceCategories.find(c => c.key === 'xet-nghiem');
    const homeLabTests = labTestCategory?.services || [];
    
    console.log(`⚙️ [HOME] Processing ${homeLabTests.length} Featured Lab Tests...`);
    for (const item of homeLabTests) {
      let homeImageUrl = item.description?.bgImage || item.description?.banner;
      let homeFileName = `home-pkg-${item.id}.jpg`;

      if (homeImageUrl) {
          await downloadImage(homeImageUrl, path.join(DIRS.servicesHome, homeFileName));
      }

      servicesHomeList.push({
        id: item.id,
        title: item.title || item.name,
        clinicName: item.desc2 || item.partner?.name || 'Phòng Khám Đa Khoa', 
        originalPrice: parsePrice(item.originalPrice || item.price),
        discountPrice: parsePrice(item.price),
        imageUrl: homeImageUrl ? `/images/services/home/${homeFileName}` : null
      });
    }

    // 4B. EXTRACT COMPREHENSIVE LAB TESTS (LẬT TRANG ĐỂ CÀO SẠCH DATA)
    const servicesListList = [];
    let currentPage = 1;
    let keepFetching = true;
    let totalPackagesProcessed = 0;

    console.log(`⚙️ [LIST] Initiating Pagination Crawler for Lab Tests...`);
    
    while (keepFetching) {
      const packageUrl = `https://api-v2.medpro.com.vn/mongo/service/package/list?offset=${currentPage}&limit=50&treeIds=PACKAGE,COVID,COVIDTN`;
      console.log(`   -> Fetching Page ${currentPage}...`);
      
      const pkgRes = await fetch(packageUrl, fetchOptions);
      const pkgData = await pkgRes.json();
      const packagesInPage = pkgData.results || [];
      
      if (packagesInPage.length === 0) {
          keepFetching = false; // Hết data thì dừng vòng lặp
          break;
      }

      // LỌC CHUYÊN SÂU: Chỉ lấy những gói Xét nghiệm, ADN...
      const filteredLabTests = packagesInPage.filter(item => {
          const title = (item.title || item.name || '').toLowerCase();
          return title.includes('xét nghiệm') || 
                 title.includes('xn ') || 
                 title.includes('test') || 
                 title.includes('adn');
      });

      totalPackagesProcessed += filteredLabTests.length;

      for (const item of filteredLabTests) {
        let listImageUrl = item.imageUrl || item.partner?.circleLogo;
        let listFileName = `list-pkg-${item.id}.png`; 
        
        if (listImageUrl && listImageUrl.includes('ChuyenKhoa.png')) {
            listFileName = `list-pkg-default-${item.id}.png`; 
        }

        if (listImageUrl) {
            await downloadImage(listImageUrl, path.join(DIRS.servicesList, listFileName));
        }

        servicesListList.push({
          id: item.id,
          title: item.title || item.name,
          originalPrice: parsePrice(item.originalPrice || item.price),
          discountPrice: parsePrice(item.price),
          imageUrl: listImageUrl ? `/images/services/list/${listFileName}` : null
        });
      }

      currentPage++;
      // Set một cái cầu chì an toàn (Safe limit) để tránh loop vô tận nếu API bị lỗi
      if (currentPage > 20) {
         console.log('   -> Reached maximum page limit (20). Stopping crawler.');
         keepFetching = false;
      }
    }
    
    console.log(`✅ [LIST] Found and downloaded ${totalPackagesProcessed} Lab Tests across all pages!`);

    // 5. EXPORT DATA TO JSON FILES
    console.log('💾 Saving structured JSON data...');
    fs.writeFileSync(path.join(DIRS.dataOutput, 'quick_actions.json'), JSON.stringify(featuresList, null, 2));
    fs.writeFileSync(path.join(DIRS.dataOutput, 'specialties.json'), JSON.stringify(specialtiesList, null, 2));
    fs.writeFileSync(path.join(DIRS.dataOutput, 'doctors.json'), JSON.stringify(doctorsList, null, 2));
    fs.writeFileSync(path.join(DIRS.dataOutput, 'services_home.json'), JSON.stringify(servicesHomeList, null, 2)); 
    fs.writeFileSync(path.join(DIRS.dataOutput, 'services_list.json'), JSON.stringify(servicesListList, null, 2)); 
    
    console.log('✅ CRAWL COMPLETE! Home and List Data perfectly separated with full pagination.');

  } catch (error) {
    console.error('❌ CRAWLER ERROR:', error.message);
  }
};

runCrawler();