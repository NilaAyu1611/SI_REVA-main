import { useState } from '#app'
import { onMounted } from 'vue'

export const useI18n = () => {
  const locale = useState<'id' | 'en'>('locale', () => 'id')

  onMounted(() => {
    const saved = localStorage.getItem('sireva_locale')
    if (saved === 'id' || saved === 'en') {
      locale.value = saved
    }
  })

  const setLocale = (lang: 'id' | 'en') => {
    locale.value = lang
    localStorage.setItem('sireva_locale', lang)
  }

  const translations = {
    id: {
      // Navbar & Header
      home: 'Beranda',
      visionMission: 'Visi & Misi',
      legalProducts: 'Produk Hukum',
      ppid: 'PPID',
      login: 'MASUK',
      logout: 'Logout',
      changePassword: 'Ubah Password',
      slogan: 'Sistem Informasi Perencanaan dan Evaluasi - New Generation',
      
      // Footer
      aboutSireva: 'Tentang Sireva',
      aboutSirevaDesc: 'Sireva merupakan Sistem Informasi Laporan Akuntabilitas Kinerja Instansi Pemerintah Online Lembaga Administrasi Negara',
      copyright: 'Copyright © 2026 Lembaga Administrasi Negara',

      // Home Cards
      planning: 'Perencanaan',
      planningSub: 'Sasaran sampai rencana aksi',
      planningDesc: 'Kelola kesinambungan visi, sasaran strategis, program, kegiatan, hingga rencana aksi dalam alur yang lebih rapi.',
      monitoring: 'Pemantauan',
      monitoringSub: 'Capaian dan realisasi',
      monitoringDesc: 'Pantau target, realisasi triwulan, dan indikator kinerja melalui tampilan data yang mudah dibaca lintas level jabatan.',
      evaluation: 'Evaluasi',
      evaluationSub: 'Pengambilan keputusan',
      evaluationDesc: 'Gunakan informasi yang terpusat untuk evaluasi kinerja, pelaporan, dan tindak lanjut perbaikan secara lebih cepat.',

      // Home Carousel
      carouselSubtitle: 'SIREVA New Generation',
      carouselSlide1Title: 'Perencanaan dan evaluasi kinerja dalam satu ruang kerja yang terpadu.',
      carouselSlide1Desc: 'SIREVA NG membantu menyusun sasaran, memantau realisasi, dan menjaga kesinambungan antara target strategis hingga rencana aksi.',
      carouselSlide2Title: 'Selaraskan sasaran strategis, program, kegiatan, dan perjanjian kinerja.',
      carouselSlide2Desc: 'Tampilan yang terstruktur memudahkan setiap unit kerja melihat keterkaitan indikator, target, dan capaian secara lebih jelas.',
      carouselSlide3Title: 'Bangun pengambilan keputusan berbasis data yang lebih cepat dan terukur.',
      carouselSlide3Desc: 'Gunakan dashboard dan tabel monitoring untuk membaca progres triwulan, mengevaluasi target, dan menindaklanjuti rencana aksi prioritas.',
      slidePrev: 'Slide sebelumnya',
      slideNext: 'Slide berikutnya',

      // Visi & Misi Page
      visionMissionTitle: 'VISI, MISI DAN TUJUAN LEMBAGA LAN RI',
      vision: 'VISI',
      mission: 'MISI',
      goal: 'TUJUAN',
      visionText: '"Terwujudnya Kebijakan dan Kapasitas Aparatur Sipil Negara yang Berkualitas dalam rangka mewujudkan Bersama Indonesia Maju Menuju Indonesia Emas 2045"',
      misi1: 'Mendorong terwujudnya kebijakan yang berkualitas di instansi pemerintah',
      misi2: 'Melaksanakan transformasi pembelajaran ASN secara terintegrasi',
      misi3: 'Menyelenggarakan pengembangan kapasitas dan pembelajaran ASN secara kolaboratif',
      misi4: 'Menyelenggarakan mutu tata kelola pengembangan kapasitas dan pembelajaran ASN',
      misi5: 'Melaksanakan tata kelola organisasi yang berkualitas dan berorientasi pada pengguna layanan',
      tujuan1: 'Mewujudkan kebijakan publik dan kapasitas ASN yang berkualitas',
      tujuan2: 'Mewujudkan tata kelola organisasi yang berkualitas dan berorientasi pada pengguna layanan',

      // Produk Hukum Page
      legalProductsTitle: 'Produk Hukum',
      legalProductsSubtitle: 'Pusat dokumentasi peraturan, pedoman, dan produk hukum terkait perencanaan & evaluasi di lingkungan LAN RI.',
      searchPlaceholder: 'Cari peraturan atau kata kunci...',
      showing: 'Menampilkan',
      documents: 'Dokumen',
      preview: 'Pratinjau',
      download: 'Unduh',
      noDocuments: 'Tidak ada produk hukum ditemukan',
      noDocumentsDesc: 'Coba kata kunci lain atau ubah kategori filter Anda.',
      resetFilter: 'Reset Semua Filter',
      categoryAll: 'Semua',
      categoryPerpres: 'Perpres',
      categoryPermenPANRB: 'Permen PANRB',
      categoryPedoman: 'Pedoman',
      categoryOthers: 'Lainnya',

      // Product Items
      prod1Title: 'Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP)',
      prod1Desc: 'Landasan hukum utama penyelenggaraan sistem akuntabilitas kinerja di lingkungan instansi pemerintah pusat dan daerah.',
      prod2Title: 'Petunjuk Teknis Perjanjian Kinerja & Tata Cara Reviu',
      prod2Desc: 'Panduan operasional bagi instansi pemerintah dalam menyusun dokumen perjanjian kinerja dan melakukan evaluasi internal berkala.',
      prod3Title: 'Pedoman Penyusunan Rencana Strategis (Renstra)',
      prod3Desc: 'Instruksi terbaru mengenai standarisasi penyusunan rencana strategis 5 tahunan berbasis outcome-based budgeting.',
      prod4Title: 'Penyederhanaan Birokrasi & Dampak Kinerja',
      prod4Desc: 'Surat edaran mengenai penyesuaian indikator kinerja individu pasca penyederhanaan struktur organisasi.',
    },
    en: {
      // Navbar & Header
      home: 'Home',
      visionMission: 'Vision & Mission',
      legalProducts: 'Legal Products',
      ppid: 'PPID',
      login: 'LOGIN',
      logout: 'Logout',
      changePassword: 'Change Password',
      slogan: 'Information System for Planning and Evaluation - New Generation',

      // Footer
      aboutSireva: 'About Sireva',
      aboutSirevaDesc: 'Sireva is an Online Performance Accountability Report Information System of Government Agencies for the National Institute of Public Administration',
      copyright: 'Copyright © 2026 National Institute of Public Administration',

      // Home Cards
      planning: 'Planning',
      planningSub: 'Goals to action plans',
      planningDesc: 'Manage the continuity of vision, strategic goals, programs, activities, up to action plans in a neater flow.',
      monitoring: 'Monitoring',
      monitoringSub: 'Achievements and realization',
      monitoringDesc: 'Monitor targets, quarterly realizations, and performance indicators through easy-to-read data displays across position levels.',
      evaluation: 'Evaluation',
      evaluationSub: 'Decision making',
      evaluationDesc: 'Use centralized information for performance evaluation, reporting, and follow-up improvements faster.',

      // Home Carousel
      carouselSubtitle: 'SIREVA New Generation',
      carouselSlide1Title: 'Planning and performance evaluation in a single integrated workspace.',
      carouselSlide1Desc: 'SIREVA NG helps draft goals, monitor realization, and maintain consistency from strategic targets to action plans.',
      carouselSlide2Title: 'Align strategic goals, programs, activities, and performance agreements.',
      carouselSlide2Desc: 'Structured layouts make it easier for each work unit to see the linkage of indicators, targets, and achievements clearly.',
      carouselSlide3Title: 'Build faster, measured data-driven decision-making.',
      carouselSlide3Desc: 'Use monitoring dashboards and tables to review quarterly progress, evaluate targets, and follow up on priority action plans.',
      slidePrev: 'Previous slide',
      slideNext: 'Next slide',

      // Visi & Misi Page
      visionMissionTitle: 'VISION, MISSION AND GOALS OF LAN RI',
      vision: 'VISION',
      mission: 'MISSION',
      goal: 'GOALS',
      visionText: '"The realization of Quality Civil Service Policies and Capacity in order to jointly realize a Progressive Indonesia towards Golden Indonesia 2045"',
      misi1: 'Encourage the realization of quality policies in government agencies',
      misi2: 'Implement integrated ASN learning transformation',
      misi3: 'Organize collaborative ASN learning and capacity development',
      misi4: 'Organize the quality of ASN capacity development and learning governance',
      misi5: 'Implement quality and service user-oriented organizational governance',
      tujuan1: 'Realizing public policy and quality ASN capacity',
      tujuan2: 'Realizing quality and service user-oriented organizational governance',

      // Produk Hukum Page
      legalProductsTitle: 'Legal Products',
      legalProductsSubtitle: 'Documentation center for regulations, guidelines, and legal products related to planning & evaluation within LAN RI.',
      searchPlaceholder: 'Search regulations or keywords...',
      showing: 'Showing',
      documents: 'Documents',
      preview: 'Preview',
      download: 'Download',
      noDocuments: 'No legal products found',
      noDocumentsDesc: 'Try another keyword or change your filter category.',
      resetFilter: 'Reset All Filters',
      categoryAll: 'All',
      categoryPerpres: 'Perpres',
      categoryPermenPANRB: 'Permen PANRB',
      categoryPedoman: 'Guideline',
      categoryOthers: 'Others',

      // Product Items
      prod1Title: 'Government Agency Performance Accountability System (SAKIP)',
      prod1Desc: 'The main legal basis for implementing the performance accountability system within central and regional government agencies.',
      prod2Title: 'Technical Guidelines for Performance Agreements & Review Procedures',
      prod2Desc: 'Operational guidance for government agencies in preparing performance agreement documents and conducting periodic internal evaluations.',
      prod3Title: 'Guidelines for Preparing Strategic Plans (Renstra)',
      prod3Desc: 'Latest instructions regarding standardization of compiling 5-year strategic plans based on outcome-based budgeting.',
      prod4Title: 'Bureaucracy Simplification & Performance Impact',
      prod4Desc: 'Circular letter regarding adjustment of individual performance indicators post organizational structure simplification.',
    }
  }

  const t = (key: string): string => {
    const currentTranslations = translations[locale.value] as Record<string, string>
    return currentTranslations?.[key] || key
  }

  return {
    locale,
    setLocale,
    t
  }
}
