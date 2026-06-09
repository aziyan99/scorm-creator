import { getManifest12, getManifest2004, getPlayerHtml, getPlayerCss, getScormApiJs } from './scorm-templates.js';

const DEFAULT_VISUAL_HOTSPOT_IMAGE = `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
  <rect x="50" y="320" width="700" height="100" fill="%23a0522d" rx="10" />
  <rect x="70" y="420" width="40" height="30" fill="%238b4513" />
  <rect x="690" y="420" width="40" height="30" fill="%238b4513" />

  <rect x="375" y="240" width="50" height="80" fill="%23475569" />
  <ellipse cx="400" cy="320" rx="60" ry="10" fill="%23334155" />

  <rect x="250" y="80" width="300" height="180" rx="8" fill="%231e293b" />
  
  <rect x="260" y="90" width="280" height="150" fill="%2338bdf8" rx="4" />
  <text x="300" y="130" font-family="sans-serif" font-size="12" fill="%230f172a" font-weight="bold">DATABASE KEPENDUDUKAN</text>
  <text x="300" y="150" font-family="sans-serif" font-size="10" fill="%23334155">Nama: Ahmad | NIK: 320102...</text>
  <text x="300" y="170" font-family="sans-serif" font-size="10" fill="%23334155">Nama: Siti  | NIK: 320103...</text>
  <text x="300" y="210" font-family="sans-serif" font-size="11" fill="%23ef4444" font-weight="bold">\\u{1F513} SISTEM TERBUKA (BELUM DIKUNCI)</text>

  <rect x="300" y="330" width="200" height="15" rx="3" fill="%2364748b" />

  <rect x="500" y="220" width="45" height="40" fill="%23fef08a" transform="rotate(-5, 500, 220)" />
  <text x="502" y="238" font-family="sans-serif" font-size="8" fill="%231e293b" font-weight="bold" transform="rotate(-5, 500, 220)">PASS: admin</text>
  <text x="502" y="248" font-family="sans-serif" font-size="8" fill="%231e293b" font-weight="bold" transform="rotate(-5, 500, 220)">123456</text>

  <rect x="120" y="330" width="100" height="80" fill="%23ffffff" rx="4" transform="rotate(10, 120, 330)" stroke="%23cbd5e1" stroke-width="1" />
  <text x="130" y="355" font-family="sans-serif" font-size="8" fill="%23475569" font-weight="bold" transform="rotate(10, 120, 330)">KARTU KELUARGA</text>
  <line x1="130" y1="365" x2="200" y2="365" stroke="%2394a3b8" stroke-width="2" transform="rotate(10, 120, 330)" />
  <line x1="130" y1="375" x2="180" y2="375" stroke="%2394a3b8" stroke-width="2" transform="rotate(10, 120, 330)" />
  <line x1="130" y1="385" x2="190" y2="385" stroke="%2394a3b8" stroke-width="2" transform="rotate(10, 120, 330)" />

  <rect x="560" y="340" width="30" height="12" rx="2" fill="%23ef4444" transform="rotate(-15, 560, 340)" />
  <rect x="590" y="343" width="10" height="6" fill="%23cbd5e1" transform="rotate(-15, 560, 340)" />
  <line x1="565" y1="346" x2="575" y2="346" stroke="%23ffffff" stroke-width="2" transform="rotate(-15, 560, 340)" />
</svg>
`);


// Application State
let courseState = {
  id: 'SCORM_COURSE_' + Math.floor(Math.random() * 10000),
  title: 'My Interactive Course',
  description: 'Learn the fundamentals with interactive lessons and quizzes.',
  passingScore: 80,
  scormVersion: '1.2',
  theme: {
    bgPrimary: '#12141c',
    bgSidebar: '#1a1d29',
    textColor: '#f3f4f6',
    accentColor: '#6366f1'
  },
  pages: [
    {
      title: 'Introduction to SCORM',
      blocks: [
        {
          type: 'text',
          content: '<h3>Welcome to SCORM!</h3><p>SCORM stands for <strong>Sharable Content Object Reference Model</strong>. It is a set of technical standards for e-learning software products. SCORM tells programmers how to write their code so that it can "play well" with other e-learning software.</p>'
        },
        {
          type: 'text',
          content: '<p>Specifically, SCORM governs how online learning content and Learning Management Systems (LMS) communicate with each other. It is the industry standard for e-learning interoperability.</p>'
        }
      ]
    },
    {
      title: 'Knowledge Check',
      blocks: [
        {
          type: 'quiz',
          question: 'What does the abbreviation SCORM stand for?',
          options: [
            'Sharable Content Object Reference Model',
            'Secure Content Online Registry Manager',
            'Structured Core Object Reporting Module',
            'Systematic Course Organization Resource Manifest'
          ],
          correct: 0
        }
      ]
    }
  ]
};

let activePageIdx = 0;
let consoleLogs = [];

// Mock LMS API database
let mockLmsData = {};

// In-Browser Mock LMS API Implementation
function setupMockLms() {
  const logMessage = (apiCall, value = '', status = 'true') => {
    const time = new Date().toLocaleTimeString();
    consoleLogs.push({ time, apiCall, value, status });
    renderConsole();
  };

  // SCORM 1.2 Mock API
  window.API = {
    LMSInitialize: function() {
      mockLmsData = {};
      logMessage('LMSInitialize', '', 'true');
      return "true";
    },
    LMSFinish: function() {
      logMessage('LMSFinish', '', 'true');
      return "true";
    },
    LMSGetValue: function(element) {
      const val = mockLmsData[element] || "";
      logMessage('LMSGetValue', `${element} -> "${val}"`, 'true');
      return val;
    },
    LMSSetValue: function(element, value) {
      mockLmsData[element] = value;
      logMessage('LMSSetValue', `${element} = "${value}"`, 'true');
      return "true";
    },
    LMSCommit: function() {
      logMessage('LMSCommit', '', 'true');
      return "true";
    },
    LMSGetLastError: function() {
      return "0";
    },
    LMSGetErrorString: function() {
      return "No error";
    },
    LMSGetDiagnostic: function() {
      return "No diagnostic info";
    }
  };

  // SCORM 2004 Mock API
  window.API_1484_11 = {
    Initialize: function() {
      mockLmsData = {};
      logMessage('Initialize', '', 'true');
      return "true";
    },
    Terminate: function() {
      logMessage('Terminate', '', 'true');
      return "true";
    },
    GetValue: function(element) {
      const val = mockLmsData[element] || "";
      logMessage('GetValue', `${element} -> "${val}"`, 'true');
      return val;
    },
    SetValue: function(element, value) {
      mockLmsData[element] = value;
      logMessage('SetValue', `${element} = "${value}"`, 'true');
      return "true";
    },
    Commit: function() {
      logMessage('Commit', '', 'true');
      return "true";
    },
    GetLastError: function() {
      return "0";
    },
    GetErrorString: function() {
      return "No error";
    },
    GetDiagnostic: function() {
      return "No diagnostic info";
    }
  };
}

function renderConsole() {
  const logsEl = document.getElementById('console-logs');
  if (!logsEl) return;
  
  logsEl.innerHTML = consoleLogs.map(log => {
    let typeClass = 'log-info';
    if (log.apiCall.includes('SetValue')) typeClass = 'log-api';
    if (log.apiCall.includes('GetValue')) typeClass = 'log-api';
    if (log.apiCall.includes('Initialize') || log.apiCall.includes('LMSInitialize')) typeClass = 'log-success';
    
    return `<div class="log-entry">
      <span class="log-time">[${log.time}]</span>
      <span class="${typeClass}">${log.apiCall}</span>
      <span class="log-value">${log.value ? ' ' + log.value : ''}</span>
    </div>`;
  }).join('');
  
  // Scroll to bottom
  logsEl.scrollTop = logsEl.scrollHeight;
}

// Clear Mock Console
window.clearLogs = function() {
  consoleLogs = [];
  renderConsole();
};

// UI Handlers & State Sync
function initApp() {
  setupMockLms();
  
  // Bind form settings
  const titleInput = document.getElementById('course-title');
  const idInput = document.getElementById('course-id');
  const descInput = document.getElementById('course-desc');
  const passingInput = document.getElementById('course-passing');
  const versionInput = document.getElementById('course-version');
  
  titleInput.value = courseState.title;
  idInput.value = courseState.id;
  descInput.value = courseState.description;
  passingInput.value = courseState.passingScore;
  versionInput.value = courseState.scormVersion;

  const themeBgInput = document.getElementById('course-theme-bg');
  const themeSidebarInput = document.getElementById('course-theme-sidebar');
  const themeTextInput = document.getElementById('course-theme-text');
  const themeAccentInput = document.getElementById('course-theme-accent');

  themeBgInput.value = courseState.theme.bgPrimary;
  themeSidebarInput.value = courseState.theme.bgSidebar;
  themeTextInput.value = courseState.theme.textColor;
  themeAccentInput.value = courseState.theme.accentColor;
  
  titleInput.addEventListener('input', (e) => {
    courseState.title = e.target.value;
    updatePreview();
  });
  idInput.addEventListener('input', (e) => {
    courseState.id = e.target.value;
  });
  descInput.addEventListener('input', (e) => {
    courseState.description = e.target.value;
    updatePreview();
  });
  passingInput.addEventListener('input', (e) => {
    courseState.passingScore = parseInt(e.target.value, 10) || 80;
    updatePreview();
  });
  versionInput.addEventListener('change', (e) => {
    courseState.scormVersion = e.target.value;
    updatePreview();
  });
  themeBgInput.addEventListener('input', (e) => {
    courseState.theme.bgPrimary = e.target.value;
    updatePreview();
  });
  themeSidebarInput.addEventListener('input', (e) => {
    courseState.theme.bgSidebar = e.target.value;
    updatePreview();
  });
  themeTextInput.addEventListener('input', (e) => {
    courseState.theme.textColor = e.target.value;
    updatePreview();
  });
  themeAccentInput.addEventListener('input', (e) => {
    courseState.theme.accentColor = e.target.value;
    updatePreview();
  });

  // Action Buttons
  document.getElementById('btn-add-page').addEventListener('click', addPage);
  // Action dock populated dynamically
  document.getElementById('btn-export-12').addEventListener('click', () => exportCourse('1.2'));
  document.getElementById('btn-export-2004').addEventListener('click', () => exportCourse('2004'));
  document.getElementById('btn-load-demo').addEventListener('click', loadDemoData);

  document.getElementById('btn-preview-popup').addEventListener('click', launchPreviewPopup);
  document.getElementById('btn-preview-fullscreen').addEventListener('click', togglePreviewFullscreen);
  document.getElementById('btn-toggle-left').addEventListener('click', toggleLeftSidebar);
  document.getElementById('btn-toggle-right').addEventListener('click', toggleRightSidebar);

  // Sync initial toggle state and layout grid from URL parameters
  syncToggleButtonStyles();
  updateLayoutGrid();

  renderActionDock();
  renderPagesList();
  renderActivePageEditor();
  updatePreview();
  initResizers();
}

function loadDemoData() {
  courseState = {
    id: 'DEMO_CYBER_101',
    title: 'Cybersecurity Phishing & Spam Defense',
    description: 'Master the art of spotting phishing attempts, inspecting email headers, and defending your identity.',
    passingScore: 80,
    scormVersion: '1.2',
    theme: {
      bgPrimary: '#0f172a',
      bgSidebar: '#1e293b',
      textColor: '#f8fafc',
      accentColor: '#10b981'
    },
    pages: [
      {
        title: '1. Keamanan Informasi Desa',
        blocks: [
          {
            type: 'text',
            content: '<h3>Pentingnya Melindungi Data Warga</h3><p>Kantor desa mengelola banyak data kependudukan sensitif seperti KK, KTP, dan Akta Kelahiran. Hover pada frasa bertanda di bawah untuk mempelajari risiko keamanannya:</p>'
          },
          {
            type: 'hotspots',
            layout: 'email',
            emailFromName: 'PayPal Security',
            emailFromEmail: 'paypal-security@paypal-verify-link.com',
            emailSubject: 'Urgent Account Verification Required!',
            emailDate: 'Today, 2:45 PM',
            text: 'Dear customer, we detected unusual activity. Click here to verify your account credentials within 24 hours.',
            items: [
              { phrase: 'paypal-verify-link.com', tooltip: 'Look at the sender domain! True PayPal emails will end with "@paypal.com". This domain is a fake domain purchased by phishers.' },
              { phrase: 'Urgent Account Verification Required!', tooltip: 'Urgency trigger! Phishers use panic prompts to make you bypass logical security checks.' },
              { phrase: 'Click here to verify', tooltip: 'Link bait! Banks and services will not ask you to change passwords or credentials via email link buttons.' }
            ]
          }
        ]
      },
      {
        title: '2. Benteng Akun Desa',
        blocks: [
          {
            type: 'card',
            front: 'Mengapa password akun desa tidak boleh sama dengan password medsos pribadi?',
            back: 'Jika salah satu akun bocor, hacker bisa mengakses akun dinas desa penting Anda lainnya.'
          },
          {
            type: 'accordion',
            title: 'Kesalahan Umum Password di Kantor Desa',
            content: '<p><strong>DesaMerdeka2026:</strong> Terlalu mudah ditebak oleh orang luar.<br><strong>123456:</strong> Peringkat teratas password paling mudah diretas di dunia.<br><strong>Menempelkan catatan:</strong> Menaruh kertas berisi password di samping layar monitor komputer desa.</p>'
          },
          {
            type: 'passwordMeter',
            title: 'Simulasi Pembuat Password Aman',
            description: 'Uji kekuatan password Anda di bawah ini. Pastikan untuk memenuhi minimal 8 karakter, huruf besar & kecil, angka, serta simbol!',
            labelInputPlaceholder: 'Ketik contoh password...',
            labelStrength: 'Kekuatan:',
            labelEmpty: 'Kosong',
            labelWeak: 'Lemah',
            labelMedium: 'Sedang',
            labelStrong: 'Kuat',
            labelRecommendations: 'Rekomendasi perbaikan:',
            labelPlaceholder: 'Ketik password di atas untuk memulai evaluasi kekuatan.',
            labelTooShort: 'Terlalu pendek (minimal 8 karakter)',
            labelMixCase: 'Kombinasikan huruf besar (Kapital) dan kecil',
            labelAddNumbers: 'Tambahkan angka (0-9)',
            labelUseSymbols: 'Gunakan karakter unik / simbol (misal: !, @, #, $, dll.)',
            labelSuccess: 'Luar biasa! Password Anda sudah memenuhi syarat keamanan minimum (Sangat Kuat).'
          }
        ]
      },
      {
        title: '3. Waspada Penipuan (Phishing)',
        blocks: [
          {
            type: 'tabs',
            tabs: [
              { label: 'Ciri Link Palsu', content: '<p>Periksa domain link secara seksama. Link resmi kementerian biasanya berakhiran <strong>.go.id</strong>, bukan domain umum gratisan.</p>' },
              { label: 'Bahaya File .apk', content: '<p>Modus penipuan kurir paket, undangan nikah, atau daftar penerima bansos palsu yang dikirim via WhatsApp berformat file installer (.apk) yang mencuri SMS OTP Anda.</p>' }
            ]
          },
          {
            type: 'chat',
            senderName: 'Bansos Kemenkes',
            actionLabel: 'Pilih Tindakan Tindak Balas Anda:',
            safeLabel: 'Aman (Safe)',
            vulnerableLabel: 'Kerawanan (Vulnerable)',
            messages: [
              { sender: 'them', text: 'Selamat siang Bapak/Ibu staf desa, berikut daftar warga penerima bantuan sosial kependudukan terbaru dari Kemenkes. Mohon segera dipasang aplikasinya ya.' },
              { sender: 'them', text: 'daftar_penerima_bansos.apk', isAttachment: true, attachmentType: 'apk' }
            ],
            choices: [
              { text: 'Klik dan pasang file APK tersebut karena tampak mendesak', feedback: 'Vulnerable! File APK palsu dari nomor tidak dikenal adalah malware mata-mata pencuri SMS OTP perbankan.', isCorrect: false },
              { text: 'Abaikan pesan, hapus file APK, dan laporkan nomor', feedback: 'Safe! Pilihan cerdas. Selalu hindari membuka file aplikasi .apk tak resmi agar data HP aman.', isCorrect: true }
            ]
          }
        ]
      },
      {
        title: '4. Keamanan Fisik Kantor Desa',
        blocks: [
          {
            type: 'visualHotspot',
            title: 'Cari Kerawanan di Kantor Desa (Spot the Mistake)',
            description: 'Klik pada kelemahan keamanan fisik/digital yang ada pada meja kerja dinas desa di bawah ini.',
            imageUrl: '',
            progressLabel: 'Kerawanan Ditemukan:',
            placeholderLabel: 'Klik area gambar yang Anda curigai tidak aman di atas untuk memulai pencarian.',
            successLabel: '🎉 Luar biasa! Anda berhasil menemukan seluruh {total} kerawanan keamanan fisik dan digital pada gambar ini!',
            identifiedLabel: 'Teridentifikasi',
            hazards: [
              { id: 'sticky', name: 'Catatan Password di Monitor', description: 'Menempelkan password secara terbuka memudahkan orang lain membajak akun dinas Anda.', x: 65.31, y: 53.33 },
              { id: 'unlocked', name: 'Layar Komputer Tidak Terkunci', description: 'Biasakan menekan tombol Win + L saat meninggalkan meja kerja agar tidak diakses orang asing.', x: 50.00, y: 36.67 },
              { id: 'usb', name: 'USB Flashdisk Asing Tercolok', description: 'Mencolokkan flashdisk sembarangan berisiko menyebarkan virus atau malware mata-mata.', x: 71.88, y: 76.89 },
              { id: 'papers', name: 'Dokumen NIK Warga Terbuka', description: 'Dokumen kertas berisi NIK warga harus dirapikan dan disimpan di laci terkunci agar tidak disalahgunakan.', x: 21.25, y: 82.22 }
            ]
          }
        ]
      },
      {
        title: '5. Evaluasi Perlindungan Data Warga',
        blocks: [
          {
            type: 'quiz',
            question: 'Di bawah ini merupakan salah satu data warga desa yang tidak boleh dibuang dalam kondisi utuh ke tong sampah adalah...',
            options: [
              'Brosur kegiatan desa umum',
              'Kertas coretan jadwal piket staf',
              'Kertas salah cetak yang berisi Nama, NIK, dan Alamat warga',
              'Amplop surat kosong yang tidak terpakai'
            ],
            correct: 2
          }
        ]
      }
    ]
  };

  activePageIdx = 0;
  
  // Update inputs
  document.getElementById('course-title').value = courseState.title;
  document.getElementById('course-id').value = courseState.id;
  document.getElementById('course-desc').value = courseState.description;
  document.getElementById('course-passing').value = courseState.passingScore;
  document.getElementById('course-version').value = courseState.scormVersion;
  
  document.getElementById('course-theme-bg').value = courseState.theme.bgPrimary;
  document.getElementById('course-theme-sidebar').value = courseState.theme.bgSidebar;
  document.getElementById('course-theme-text').value = courseState.theme.textColor;
  document.getElementById('course-theme-accent').value = courseState.theme.accentColor;

  renderPagesList();
  renderActivePageEditor();
  updatePreview();
}

function renderPagesList() {
  const listEl = document.getElementById('pages-list');
  listEl.innerHTML = '';
  
  courseState.pages.forEach((page, idx) => {
    const li = document.createElement('li');
    li.className = `flex items-center justify-between p-2.5 rounded-lg cursor-pointer text-xs font-semibold transition-all group ${idx === activePageIdx ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-800'}`;
    li.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      activePageIdx = idx;
      renderPagesList();
      renderActivePageEditor();
    });

    li.innerHTML = `
      <span class="truncate pr-1">${escapeHtml(page.title)}</span>
      <div class="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all shrink-0">
        <button class="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] cursor-pointer" onclick="movePage(${idx}, -1)">↑</button>
        <button class="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] cursor-pointer" onclick="movePage(${idx}, 1)">↓</button>
        <button class="w-5 h-5 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded text-[10px] cursor-pointer" onclick="deletePage(${idx})">×</button>
      </div>
    `;
    listEl.appendChild(li);
  });
}

window.movePage = function(idx, direction) {
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= courseState.pages.length) return;
  
  const temp = courseState.pages[idx];
  courseState.pages[idx] = courseState.pages[targetIdx];
  courseState.pages[targetIdx] = temp;
  
  if (activePageIdx === idx) activePageIdx = targetIdx;
  else if (activePageIdx === targetIdx) activePageIdx = idx;
  
  renderPagesList();
  updatePreview();
};

window.deletePage = function(idx) {
  if (courseState.pages.length <= 1) {
    alert("Your course must contain at least one page.");
    return;
  }
  
  if (confirm("Are you sure you want to delete this page?")) {
    courseState.pages.splice(idx, 1);
    if (activePageIdx >= courseState.pages.length) {
      activePageIdx = courseState.pages.length - 1;
    }
    renderPagesList();
    renderActivePageEditor();
    updatePreview();
  }
};

function addPage() {
  const newPage = {
    title: 'Untitled Page ' + (courseState.pages.length + 1),
    blocks: [
      {
        type: 'text',
        content: '<p>Start typing your new page content here...</p>'
      }
    ]
  };
  courseState.pages.push(newPage);
  activePageIdx = courseState.pages.length - 1;
  renderPagesList();
  renderActivePageEditor();
  updatePreview();
}

function renderActivePageEditor() {
  const editorBody = document.getElementById('editor-body');
  const page = courseState.pages[activePageIdx];
  
  if (!page) {
    editorBody.innerHTML = `<div class="text-slate-500 flex flex-col justify-center items-center h-full gap-2">No active page selected.</div>`;
    return;
  }
  
  // Page Title Input
  let html = `
    <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Page Title</label>
        <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" type="text" id="active-page-title" value="${escapeHtml(page.title)}">
      </div>
    </div>
  `;
  
  // Blocks
  page.blocks.forEach((block, bIdx) => {
    if (block.type === 'text') {
      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Text Content (HTML allowed)</label>
            <textarea class="block-text-content bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y" rows="6">${escapeHtml(block.content)}</textarea>
          </div>
        </div>
      `;
    } else if (block.type === 'card') {
      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Card Front (Prompt)</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" type="text" value="${escapeHtml(block.front)}" oninput="updateCardFront(${bIdx}, this.value)">
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Card Back (Answer)</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" type="text" value="${escapeHtml(block.back)}" oninput="updateCardBack(${bIdx}, this.value)">
            </div>
          </div>
        </div>
      `;
    } else if (block.type === 'accordion') {
      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accordion Header</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" type="text" value="${escapeHtml(block.title)}" oninput="updateAccordionTitle(${bIdx}, this.value)">
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expanded Content (HTML allowed)</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y" rows="4" oninput="updateAccordionContent(${bIdx}, this.value)">${escapeHtml(block.content)}</textarea>
          </div>
        </div>
      `;
    } else if (block.type === 'tabs') {
      const tabEditors = block.tabs.map((tab, tIdx) => `
        <div class="bg-slate-50/60 p-4 border border-slate-100 rounded-lg flex flex-col gap-3 relative">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tab #${tIdx + 1}</span>
            ${block.tabs.length > 1 ? `<button class="text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer" onclick="deleteTabFromBlock(${bIdx}, ${tIdx})">Delete Tab</button>` : ''}
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tab Label</label>
            <input class="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(tab.label)}" oninput="updateTabLabel(${bIdx}, ${tIdx}, this.value)">
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tab Content (HTML allowed)</label>
            <textarea class="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-y" rows="3" oninput="updateTabContent(${bIdx}, ${tIdx}, this.value)">${escapeHtml(tab.content)}</textarea>
          </div>
        </div>
      `).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          <div class="flex justify-between items-center">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tabs Panel Container</label>
            ${block.tabs.length < 6 ? `<button class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer transition-all border border-indigo-100" onclick="addTabToBlock(${bIdx})">+ Add Tab</button>` : ''}
          </div>
          <div class="flex flex-col gap-3">
            ${tabEditors}
          </div>
        </div>
      `;
    } else if (block.type === 'hotspots') {
      const layout = block.layout || 'email';
      const itemEditors = block.items.map((item, iIdx) => `
        <div class="bg-slate-50/60 p-4 border border-slate-100 rounded-lg flex flex-col gap-3 relative">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hotspot #${iIdx + 1}</span>
            <button class="text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer" onclick="deleteHotspotItem(${bIdx}, ${iIdx})">Delete Hotspot</button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phrase to Highlight</label>
              <input class="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(item.phrase)}" oninput="updateHotspotPhrase(${bIdx}, ${iIdx}, this.value)">
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tooltip Annotation</label>
              <input class="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(item.tooltip)}" oninput="updateHotspotTooltip(${bIdx}, ${iIdx}, this.value)">
            </div>
          </div>
        </div>
      `).join('');

      // Layout specific fields
      let layoutFieldsHtml = '';
      if (layout === 'email') {
        layoutFieldsHtml = `
          <div class="grid grid-cols-2 gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From (Name)</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.emailFromName || '')}" placeholder="E.g., PayPal Security" oninput="updateHotspotEmailField(${bIdx}, 'emailFromName', this.value)">
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From (Email Address)</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.emailFromEmail || '')}" placeholder="E.g., security@paypal.com" oninput="updateHotspotEmailField(${bIdx}, 'emailFromEmail', this.value)">
            </div>
            <div class="flex flex-col gap-1.5 col-span-2">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subject Line</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.emailSubject || '')}" placeholder="E.g., Urgent Action Required" oninput="updateHotspotEmailField(${bIdx}, 'emailSubject', this.value)">
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Received Date/Time</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.emailDate || '')}" placeholder="E.g., Today, 2:45 PM" oninput="updateHotspotEmailField(${bIdx}, 'emailDate', this.value)">
            </div>
          </div>
        `;
      } else if (layout === 'document') {
        layoutFieldsHtml = `
          <div class="grid grid-cols-2 gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document Title</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.docTitle || '')}" placeholder="E.g., Corporate Security Policy" oninput="updateHotspotEmailField(${bIdx}, 'docTitle', this.value)">
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subtitle / Category</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.docSubtitle || '')}" placeholder="E.g., SECTION 4.2" oninput="updateHotspotEmailField(${bIdx}, 'docSubtitle', this.value)">
            </div>
          </div>
        `;
      }

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hotspots Annotation Container</label>
              <span class="text-xs text-slate-500">Configure hotspots inside interactive mockups.</span>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-xs font-semibold text-slate-500">Layout:</label>
              <select class="bg-white border border-slate-200 rounded-md text-slate-700 px-2 py-1 text-xs focus:outline-none focus:border-indigo-500" onchange="updateHotspotLayout(${bIdx}, this.value)">
                <option value="email" ${layout === 'email' ? 'selected' : ''}>Email Client</option>
                <option value="document" ${layout === 'document' ? 'selected' : ''}>Policy Document</option>
                <option value="generic" ${layout === 'generic' ? 'selected' : ''}>Plain Text</option>
              </select>
            </div>
          </div>

          ${layoutFieldsHtml}

          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Content Body</label>
              <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer transition-all border border-indigo-100" onclick="addHotspotItem(${bIdx})">+ Add Hotspot Phrase</button>
            </div>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y" rows="4" oninput="updateHotspotText(${bIdx}, this.value)">${escapeHtml(block.text)}</textarea>
          </div>
          
          <div class="flex flex-col gap-3">
            ${itemEditors}
          </div>
        </div>
      `;
    } else if (block.type === 'quiz') {
      const optionRows = block.options.map((opt, oIdx) => `
        <div class="flex gap-2 items-center">
          <input class="w-4 h-4 text-indigo-600 border-slate-200 focus:ring-indigo-500 bg-white cursor-pointer" type="radio" name="quiz-correct-${bIdx}" value="${oIdx}" ${oIdx === block.correct ? 'checked' : ''} onchange="updateQuizCorrect(${bIdx}, ${oIdx})">
          <input class="quiz-option-input bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all flex-grow" type="text" data-option-idx="${oIdx}" value="${escapeHtml(opt)}" oninput="updateQuizOption(${bIdx}, ${oIdx}, this.value)">
        </div>
      `).join('');
      
      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quiz Question</label>
            <input class="quiz-question-input bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" type="text" value="${escapeHtml(block.question)}" oninput="updateQuizQuestion(${bIdx}, this.value)">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Answers (Select correct choice)</label>
            ${optionRows}
          </div>
        </div>
      `;
    } else if (block.type === 'chat') {
      const msgEditors = (block.messages || []).map((msg, mIdx) => {
        const currentType = msg.attachmentType || (msg.isAttachment ? 'apk' : 'none');
        return `
          <div class="flex gap-2 items-center bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
            <select class="bg-white border border-slate-200 rounded text-slate-700 px-1 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer" onchange="updateChatMessageSender(${bIdx}, ${mIdx}, this.value)">
              <option value="them" ${msg.sender === 'them' ? 'selected' : ''}>Sender</option>
              <option value="me" ${msg.sender === 'me' ? 'selected' : ''}>Recipient (Me)</option>
            </select>
            <input class="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 flex-grow" type="text" value="${escapeHtml(msg.text)}" oninput="updateChatMessageText(${bIdx}, ${mIdx}, this.value)">
            
            <div class="flex flex-col gap-0.5 shrink-0">
              <select class="bg-white border border-slate-200 rounded text-slate-700 px-1.5 py-1 text-[11px] focus:outline-none focus:border-indigo-500 cursor-pointer font-medium" onchange="updateChatMessageAttachmentType(${bIdx}, ${mIdx}, this.value)">
                <option value="none" ${currentType === 'none' ? 'selected' : ''}>No Attachment</option>
                <option value="apk" ${currentType === 'apk' ? 'selected' : ''}>APK (.apk)</option>
                <option value="png" ${currentType === 'png' ? 'selected' : ''}>PNG Image (.png)</option>
                <option value="jpg" ${currentType === 'jpg' ? 'selected' : ''}>JPG Image (.jpg/.jpeg)</option>
                <option value="pdf" ${currentType === 'pdf' ? 'selected' : ''}>PDF (.pdf)</option>
                <option value="xlsx" ${currentType === 'xlsx' ? 'selected' : ''}>Excel (.xlsx)</option>
                <option value="docx" ${currentType === 'docx' ? 'selected' : ''}>Word (.docx)</option>
                <option value="pptx" ${currentType === 'pptx' ? 'selected' : ''}>PowerPoint (.pptx)</option>
                <option value="link" ${currentType === 'link' ? 'selected' : ''}>Web Link (URL)</option>
              </select>
            </div>
            
            <button class="text-red-500 hover:text-red-600 font-semibold cursor-pointer text-xs" onclick="deleteChatMessage(${bIdx}, ${mIdx})">×</button>
          </div>
        `;
      }).join('');

      const choiceEditors = (block.choices || []).map((ch, cIdx) => `
        <div class="bg-slate-50/60 p-3 border border-slate-100 rounded-lg flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Choice #${cIdx + 1}</span>
            <label class="flex items-center gap-1 text-[10px] text-slate-500 font-semibold cursor-pointer">
              <input type="radio" name="chat-correct-${bIdx}" ${ch.isCorrect ? 'checked' : ''} onchange="updateChatChoiceCorrect(${bIdx}, ${cIdx})">
              Correct Option
            </label>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Option Text</label>
            <input class="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(ch.text)}" oninput="updateChatChoiceText(${bIdx}, ${cIdx}, this.value)">
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Feedback Consequence</label>
            <input class="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(ch.feedback)}" oninput="updateChatChoiceFeedback(${bIdx}, ${cIdx}, this.value)">
          </div>
        </div>
      `).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Chat Simulator</label>
              <span class="text-xs text-slate-500">Configure a WhatsApp chat simulation with interactive option branching.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sender Name</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.senderName)}" oninput="updateChatSenderName(${bIdx}, this.value)">
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message History</label>
              <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer transition-all border border-indigo-100" onclick="addChatMessage(${bIdx})">+ Add Message</button>
            </div>
            <div class="flex flex-col gap-2">
              ${msgEditors}
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interactions Branching Choices</label>
            <div class="grid grid-cols-2 gap-3">
              ${choiceEditors}
            </div>
          </div>

          <div class="flex flex-col gap-2 border-t border-slate-100 pt-3 mt-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Configure Labels (Custom Translation)</label>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Action Panel Title</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.actionLabel || 'Choose Your Action:')}" oninput="updateChatLabel(${bIdx}, 'actionLabel', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Correct Status Label</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.safeLabel || 'Safe')}" oninput="updateChatLabel(${bIdx}, 'safeLabel', this.value)">
              </div>
              <div class="flex flex-col gap-1 col-span-2">
                <label class="text-[9px] font-semibold text-slate-500">Incorrect Status Label</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.vulnerableLabel || 'Vulnerable')}" oninput="updateChatLabel(${bIdx}, 'vulnerableLabel', this.value)">
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (block.type === 'passwordMeter') {
      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password Strength Simulator</label>
              <span class="text-xs text-slate-500">Interactive password evaluator that scores strength dynamically.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Simulator Title</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.title)}" oninput="updatePasswordMeterField(${bIdx}, 'title', this.value)">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description/Instructions</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-y" rows="3" oninput="updatePasswordMeterField(${bIdx}, 'description', this.value)">${escapeHtml(block.description)}</textarea>
          </div>

          <div class="flex flex-col gap-2 border-t border-slate-100 pt-3 mt-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Configure Labels (Custom Translation)</label>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Input Placeholder</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelInputPlaceholder || 'Type password...')}" oninput="updatePasswordMeterField(${bIdx}, 'labelInputPlaceholder', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Strength Label Prefix</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelStrength || 'Strength:')}" oninput="updatePasswordMeterField(${bIdx}, 'labelStrength', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Empty State Label</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelEmpty || 'Empty')}" oninput="updatePasswordMeterField(${bIdx}, 'labelEmpty', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Weak State Label</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelWeak || 'Weak')}" oninput="updatePasswordMeterField(${bIdx}, 'labelWeak', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Medium State Label</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelMedium || 'Medium')}" oninput="updatePasswordMeterField(${bIdx}, 'labelMedium', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Strong State Label</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelStrong || 'Strong')}" oninput="updatePasswordMeterField(${bIdx}, 'labelStrong', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Recommendations Header</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelRecommendations || 'Recommendations:')}" oninput="updatePasswordMeterField(${bIdx}, 'labelRecommendations', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Empty Input Placeholder Hint</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelPlaceholder || 'Type password above to begin strength evaluation.')}" oninput="updatePasswordMeterField(${bIdx}, 'labelPlaceholder', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Success Verification Label</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelSuccess || 'Excellent! Your password meets the minimum security requirements (Very Strong).')}" oninput="updatePasswordMeterField(${bIdx}, 'labelSuccess', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Too Short Warning</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelTooShort || 'Too short (minimum 8 characters)')}" oninput="updatePasswordMeterField(${bIdx}, 'labelTooShort', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Case Mix Warning</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelMixCase || 'Mix uppercase and lowercase letters')}" oninput="updatePasswordMeterField(${bIdx}, 'labelMixCase', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Number Missing Warning</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelAddNumbers || 'Add numbers (0-9)')}" oninput="updatePasswordMeterField(${bIdx}, 'labelAddNumbers', this.value)">
              </div>
              <div class="flex flex-col gap-1 col-span-2">
                <label class="text-[9px] font-semibold text-slate-500">Symbols Missing Warning</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.labelUseSymbols || 'Use unique characters/symbols (e.g. !, @, #, $, etc.)')}" oninput="updatePasswordMeterField(${bIdx}, 'labelUseSymbols', this.value)">
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (block.type === 'visualHotspot') {
      const imageUrl = block.imageUrl || DEFAULT_VISUAL_HOTSPOT_IMAGE;
      const hazardEditors = (block.hazards || []).map((haz, hIdx) => {
        const isSelected = selectedPinBlockIdx === bIdx && selectedPinIdx === hIdx;
        return `
          <div class="p-3 border rounded-lg flex flex-col gap-2 relative transition-all duration-200 cursor-pointer ${isSelected ? 'border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500' : 'bg-slate-50/80 border-slate-100 hover:border-slate-300 hover:bg-slate-50'}"
               onclick="selectVisualHotspotPin(${bIdx}, ${hIdx})">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-500'} uppercase tracking-wider text-ellipsis overflow-hidden whitespace-nowrap">Pin #${hIdx + 1} (${haz.x}%, ${haz.y}%)</span>
              <div class="flex items-center gap-1.5">
                ${isSelected ? `<span class="text-[8px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Active</span>` : ''}
                <button class="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" onclick="event.stopPropagation(); deleteVisualHotspotPin(${bIdx}, ${hIdx})">
                  <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            </div>
            <div class="flex flex-col gap-1" onclick="event.stopPropagation()">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Pin Name / Hazard Title</label>
              <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(haz.name)}" oninput="updateVisualHotspotPinField(${bIdx}, ${hIdx}, 'name', this.value)">
            </div>
            <div class="flex flex-col gap-1" onclick="event.stopPropagation()">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Explanation Tooltip</label>
              <textarea class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateVisualHotspotPinField(${bIdx}, ${hIdx}, 'description', this.value)">${escapeHtml(haz.description)}</textarea>
            </div>
          </div>
        `;
      }).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interactive Visual Hotspot</label>
              <span class="text-xs text-slate-500">Upload your own image and define interactive pin coordinates by clicking directly on the image.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Title</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.title)}" oninput="updateVisualHotspotField(${bIdx}, 'title', this.value)">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instructions</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateVisualHotspotField(${bIdx}, 'description', this.value)">${escapeHtml(block.description)}</textarea>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Visual Workspace & Pinning (Click image to add/move pins)</label>
              <div>
                <input type="file" accept="image/*" class="hidden" id="visual-upload-${bIdx}" onchange="uploadVisualHotspotImage(${bIdx}, this)">
                <button class="px-2.5 py-1.5 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 bg-white text-slate-600 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5" onclick="document.getElementById('visual-upload-${bIdx}').click()">
                  <i class="fa-solid fa-upload"></i> Upload Image
                </button>
              </div>
            </div>
            
            ${selectedPinBlockIdx === bIdx && selectedPinIdx !== null ? `
              <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-2.5 flex justify-between items-center text-xs text-indigo-800">
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-circle-info text-indigo-500"></i>
                  <span><strong>Pin #${selectedPinIdx + 1} Selected</strong>. Click on the image below to relocate this pin, or select another pin.</span>
                </span>
                <button class="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2.5 rounded transition-all cursor-pointer uppercase tracking-wider" onclick="deselectVisualHotspotPin()">
                  Cancel Selection
                </button>
              </div>
            ` : `
              <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600 flex items-center gap-2">
                <i class="fa-solid fa-circle-info text-slate-400"></i>
                <span>Click anywhere on the image to add a new pin. Click an existing pin to select and move it.</span>
              </div>
            `}
            
            <div class="flex justify-center bg-slate-100 p-4 rounded-lg border border-slate-200">
              <div class="relative inline-block select-none cursor-crosshair" onclick="imageClickAddHotspot(event, ${bIdx})">
                <img src="${imageUrl}" class="max-w-full max-h-[350px] object-contain rounded-md block pointer-events-none">
                
                <!-- Absolute pins overlay -->
                ${(block.hazards || []).map((haz, hIdx) => {
                  const isSelected = selectedPinBlockIdx === bIdx && selectedPinIdx === hIdx;
                  return `
                    <div class="absolute w-5 h-5 ${isSelected ? 'bg-amber-500 ring-4 ring-amber-300 scale-125 z-10' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md cursor-pointer select-none transition-all" 
                         style="left: ${haz.x}%; top: ${haz.y}%; transform: translate(-50%, -50%);"
                         onclick="event.stopPropagation(); selectVisualHotspotPin(${bIdx}, ${hIdx});"
                         title="${escapeHtml(haz.name)}">
                      ${hIdx + 1}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Interactive Hotspots / Pins List (${(block.hazards || []).length} Configured)</label>
            <div class="grid grid-cols-2 gap-3">
              ${hazardEditors.length > 0 ? hazardEditors : `<div class="col-span-2 text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">No pins added yet. Please click on the image above to add a pin.</div>`}
            </div>
          </div>

          <div class="flex flex-col gap-2 border-t border-slate-100 pt-3 mt-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Configure Labels (Custom Translation)</label>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Progress Meter Prefix</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.progressLabel || 'Hazards Found:')}" oninput="updateVisualHotspotField(${bIdx}, 'progressLabel', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Identified Tag Prefix</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.identifiedLabel || 'Identified')}" oninput="updateVisualHotspotField(${bIdx}, 'identifiedLabel', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Placeholder Help Instruction</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.placeholderLabel || 'Click on the areas in the image above that you suspect are insecure to start searching.')}" oninput="updateVisualHotspotField(${bIdx}, 'placeholderLabel', this.value)">
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-semibold text-slate-500">Success Verification Banner</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.successLabel || '🎉 Excellent! You have successfully identified all {total} physical and digital security hazards in this image!')}" oninput="updateVisualHotspotField(${bIdx}, 'successLabel', this.value)">
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (block.type === 'emailPhishing') {
      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phishing Email Simulator</label>
              <span class="text-xs text-slate-500">Configure a simulated email inbox where learners inspect headers, SPF/DKIM flags, link URLs, and report threats.</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sender Display Name</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.senderName)}" oninput="updateEmailPhishingField(${bIdx}, 'senderName', this.value)">
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sender Email Address</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.senderEmail)}" oninput="updateEmailPhishingField(${bIdx}, 'senderEmail', this.value)">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Subject Line</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.subject)}" oninput="updateEmailPhishingField(${bIdx}, 'subject', this.value)">
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date String</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.dateStr)}" oninput="updateEmailPhishingField(${bIdx}, 'dateStr', this.value)">
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Body (HTML Supported)</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono resize-y" rows="4" oninput="updateEmailPhishingField(${bIdx}, 'emailBody', this.value)">${escapeHtml(block.emailBody)}</textarea>
          </div>

          <div class="border-t border-slate-100 pt-3">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Technical Headers Inspector (Collapsible Info)</span>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-semibold text-slate-500">Return-Path</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.returnPath)}" oninput="updateEmailPhishingField(${bIdx}, 'returnPath', this.value)">
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-semibold text-slate-500">Received From (IP/Server)</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.receivedFrom)}" oninput="updateEmailPhishingField(${bIdx}, 'receivedFrom', this.value)">
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-semibold text-slate-500">SPF Authentication Status</label>
                <select class="bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer" onchange="updateEmailPhishingField(${bIdx}, 'spfCheck', this.value)">
                  <option value="PASS" ${block.spfCheck === 'PASS' ? 'selected' : ''}>PASS</option>
                  <option value="FAIL" ${block.spfCheck === 'FAIL' ? 'selected' : ''}>FAIL</option>
                  <option value="NONE" ${block.spfCheck === 'NONE' ? 'selected' : ''}>NONE</option>
                </select>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-semibold text-slate-500">DKIM Authentication Status</label>
                <select class="bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer" onchange="updateEmailPhishingField(${bIdx}, 'dkimCheck', this.value)">
                  <option value="PASS" ${block.dkimCheck === 'PASS' ? 'selected' : ''}>PASS</option>
                  <option value="FAIL" ${block.dkimCheck === 'FAIL' ? 'selected' : ''}>FAIL</option>
                  <option value="NONE" ${block.dkimCheck === 'NONE' ? 'selected' : ''}>NONE</option>
                </select>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-3">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Grading & Feedback</span>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5 col-span-2">
                <label class="text-[9px] font-semibold text-slate-500">Correct Action Required</label>
                <select class="bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer" onchange="updateEmailPhishingField(${bIdx}, 'correctAction', this.value)">
                  <option value="phish" ${block.correctAction === 'phish' ? 'selected' : ''}>Report Phishing (Attacker/Spam)</option>
                  <option value="delete" ${block.correctAction === 'delete' ? 'selected' : ''}>Delete Email</option>
                  <option value="safe" ${block.correctAction === 'safe' ? 'selected' : ''}>Mark Safe / Keep in Inbox</option>
                </select>
              </div>
              <div class="flex flex-col gap-1.5 col-span-2">
                <label class="text-[9px] font-semibold text-slate-500">Correct Decision Feedback</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.feedbackCorrect)}" oninput="updateEmailPhishingField(${bIdx}, 'feedbackCorrect', this.value)">
              </div>
              <div class="flex flex-col gap-1.5 col-span-2">
                <label class="text-[9px] font-semibold text-slate-500">Incorrect Decision Feedback</label>
                <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.feedbackIncorrect)}" oninput="updateEmailPhishingField(${bIdx}, 'feedbackIncorrect', this.value)">
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (block.type === 'dialogueBranching') {
      const nodeKeys = Object.keys(block.nodes || {});
      const nodeEditors = nodeKeys.map(nKey => {
        const node = block.nodes[nKey];
        const choiceConfigs = (node.choices || []).map((ch, cIdx) => `
          <div class="border border-slate-100 p-2.5 rounded bg-slate-50/50 flex flex-col gap-1.5 mt-1">
            <div class="flex justify-between items-center">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Choice #${cIdx + 1}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] font-bold text-slate-500">Choice Text</label>
              <input class="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(ch.text)}" oninput="updateDialogueChoiceField(${bIdx}, '${nKey}', ${cIdx}, 'text', this.value)">
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex flex-col gap-0.5">
                <label class="text-[8px] font-bold text-slate-500">Next Node</label>
                <select class="bg-white border border-slate-200 rounded px-1 py-0.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer" onchange="updateDialogueChoiceField(${bIdx}, '${nKey}', ${cIdx}, 'nextNode', this.value)">
                  <option value="">-- End Scenario --</option>
                  ${nodeKeys.map(k => `<option value="${k}" ${ch.nextNode === k ? 'selected' : ''}>${k}</option>`).join('')}
                </select>
              </div>
              <div class="flex flex-col gap-0.5">
                <label class="text-[8px] font-bold text-slate-500">Breach Risk Meter (+ / -)</label>
                <input class="bg-white border border-slate-200 rounded px-1 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="number" value="${ch.riskChange}" oninput="updateDialogueChoiceRisk(${bIdx}, '${nKey}', ${cIdx}, this.value)">
              </div>
            </div>
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] font-bold text-slate-500">Feedback Consequence</label>
              <input class="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(ch.feedback || '')}" oninput="updateDialogueChoiceField(${bIdx}, '${nKey}', ${cIdx}, 'feedback', this.value)">
            </div>
          </div>
        `).join('');

        return `
          <div class="bg-slate-50/80 p-3.5 border border-slate-100 rounded-lg flex flex-col gap-3 relative">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Node ID: "${nKey}"</span>
              ${nKey !== 'start' ? `<button class="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" onclick="deleteDialogueNode(${bIdx}, '${nKey}')"><i class="fa-solid fa-trash-can text-xs"></i></button>` : ''}
            </div>
            
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Dialogue/Attacker Speech</label>
              <textarea class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateDialogueNodeField(${bIdx}, '${nKey}', 'attackerText', this.value)">${escapeHtml(node.attackerText)}</textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">NPC Avatar Style</label>
                <select class="bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer" onchange="updateDialogueNodeField(${bIdx}, '${nKey}', 'avatar', this.value)">
                  <option value="delivery" ${node.avatar === 'delivery' ? 'selected' : ''}>Delivery Courier</option>
                  <option value="delivery_hurry" ${node.avatar === 'delivery_hurry' ? 'selected' : ''}>Hurry Courier</option>
                  <option value="delivery_leave" ${node.avatar === 'delivery_leave' ? 'selected' : ''}>Left Package</option>
                  <option value="delivery_compliant" ${node.avatar === 'delivery_compliant' ? 'selected' : ''}>Compliant Courier</option>
                  <option value="attacker_success" ${node.avatar === 'attacker_success' ? 'selected' : ''}>Intruder Successful</option>
                </select>
              </div>
              <div class="flex gap-4 items-center mt-4">
                <label class="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                  <input type="checkbox" class="rounded border-slate-200" ${node.isEnd ? 'checked' : ''} onchange="updateDialogueNodeField(${bIdx}, '${nKey}', 'isEnd', this.checked); renderActivePageEditor(); updatePreview();">
                  End Scenario
                </label>
                ${node.isEnd ? `
                  <label class="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                    <input type="checkbox" class="rounded border-slate-200" ${node.isWin ? 'checked' : ''} onchange="updateDialogueNodeField(${bIdx}, '${nKey}', 'isWin', this.checked)">
                    Success/Win Node
                  </label>
                ` : ''}
              </div>
            </div>

            ${!node.isEnd ? `
              <div class="mt-1">
                <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Branching Choice Answers</label>
                <div class="flex flex-col gap-2.5 mt-1">
                  ${choiceConfigs}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Social Engineering Dialogue Simulator</label>
              <span class="text-xs text-slate-500">Configure conversational dialogue branches. Attacker will prompt with speech, and learners respond while adjusting the Suspicion Meter.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Title</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.title)}" oninput="updateDialogueBranchingField(${bIdx}, 'title', this.value)">
          </div>

          <div class="flex justify-between items-center">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Flowchart Nodes List</label>
            <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer transition-all border border-indigo-100" onclick="addDialogueNode(${bIdx})">+ Add Node</button>
          </div>

          <div class="flex flex-col gap-4">
            ${nodeEditors}
          </div>
        </div>
      `;
    } else if (block.type === 'workspaceClean') {
      const cleanImageUrl = block.imageUrl || DEFAULT_VISUAL_HOTSPOT_IMAGE;
      const cleanPinEditors = (block.pins || []).map((pin, pIdx) => {
        const isSelected = selectedCleanPinBlockIdx === bIdx && selectedCleanPinIdx === pIdx;
        const optionRows = (pin.options || []).map((opt, oIdx) => `
          <div class="grid grid-cols-[1fr_1fr_auto] gap-2 mt-1 border-b border-slate-100 pb-1 items-end">
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] font-semibold text-slate-400">Option ID</label>
              <input class="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(opt.id)}" oninput="updateWorkspaceCleanPinOption(${bIdx}, ${pIdx}, ${oIdx}, 'id', this.value)">
            </div>
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] font-semibold text-slate-400">Option Label</label>
              <input class="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(opt.label)}" oninput="updateWorkspaceCleanPinOption(${bIdx}, ${pIdx}, ${oIdx}, 'label', this.value)">
            </div>
            <button class="text-slate-400 hover:text-red-500 cursor-pointer p-1" onclick="event.stopPropagation(); removeWorkspaceCleanPinOption(${bIdx}, ${pIdx}, ${oIdx})">
              <i class="fa-solid fa-trash-can text-[10px]"></i>
            </button>
          </div>
        `).join('');

        return `
          <div class="p-3 border rounded-lg flex flex-col gap-2 relative transition-all duration-200 cursor-pointer ${isSelected ? 'border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500' : 'bg-slate-50/80 border-slate-100 hover:border-slate-300 hover:bg-slate-50'}"
               onclick="selectWorkspaceCleanPin(${bIdx}, ${pIdx})">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-500'} uppercase tracking-wider">Pin #${pIdx + 1} (${pin.x}%, ${pin.y}%)</span>
              <div class="flex items-center gap-1.5">
                ${isSelected ? `<span class="text-[8px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Active</span>` : ''}
                <button class="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" onclick="event.stopPropagation(); deleteWorkspaceCleanPin(${bIdx}, ${pIdx})">
                  <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            </div>
            
            <div class="flex flex-col gap-1" onclick="event.stopPropagation()">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Item/Hazard Name</label>
              <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(pin.name)}" oninput="updateWorkspaceCleanPinField(${bIdx}, ${pIdx}, 'name', this.value)">
            </div>

            <div class="flex flex-col gap-1" onclick="event.stopPropagation()">
              <div class="flex justify-between items-center"><label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Action Options</label><button class="text-[9px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded cursor-pointer hover:bg-indigo-100" onclick="event.stopPropagation(); addWorkspaceCleanPinOption(${bIdx}, ${pIdx})">+ Add Option</button></div>
              ${optionRows}
            </div>

            <div class="flex flex-col gap-1" onclick="event.stopPropagation()">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Correct Action Option ID</label>
              <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono" type="text" value="${escapeHtml(pin.correctAction)}" oninput="updateWorkspaceCleanPinField(${bIdx}, ${pIdx}, 'correctAction', this.value)">
            </div>

            <div class="flex flex-col gap-1" onclick="event.stopPropagation()">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Explanation Tooltip</label>
              <textarea class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateWorkspaceCleanPinField(${bIdx}, ${pIdx}, 'explanation', this.value)">${escapeHtml(pin.explanation)}</textarea>
            </div>
          </div>
        `;
      }).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workspace Cleaner / Clean Desk Game</label>
              <span class="text-xs text-slate-500">Learners click pins on an office scene to clean/secure threats. Click the image to place/relocate pins.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Title</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.title)}" oninput="updateWorkspaceCleanField(${bIdx}, 'title', this.value)">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description/Instructions</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateWorkspaceCleanField(${bIdx}, 'description', this.value)">${escapeHtml(block.description)}</textarea>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Workspace Image & Pinning (Click image to place pins)</label>
              <div>
                <input type="file" accept="image/*" class="hidden" id="workspace-clean-upload-${bIdx}" onchange="uploadWorkspaceCleanImage(${bIdx}, this)">
                <button class="px-2.5 py-1.5 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 bg-white text-slate-600 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5" onclick="document.getElementById('workspace-clean-upload-${bIdx}').click()">
                  <i class="fa-solid fa-upload"></i> Upload Image
                </button>
              </div>
            </div>

            ${selectedCleanPinBlockIdx === bIdx && selectedCleanPinIdx !== null ? `
              <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-2.5 flex justify-between items-center text-xs text-indigo-800">
                <span><strong>Pin #${selectedCleanPinIdx + 1} Selected</strong>. Click on the image below to relocate this pin, or select another pin.</span>
                <button class="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2.5 rounded transition-all cursor-pointer" onclick="deselectWorkspaceCleanPin()">Cancel Selection</button>
              </div>
            ` : `
              <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600 flex items-center gap-2">
                <i class="fa-solid fa-circle-info text-slate-400"></i>
                <span>Click anywhere on the image to add a new cleanup pin. Click an existing pin to select and move it.</span>
              </div>
            `}

            <div class="flex justify-center bg-slate-100 p-4 rounded-lg border border-slate-200">
              <div class="relative inline-block select-none cursor-crosshair" onclick="workspaceCleanClickAddPin(event, ${bIdx})">
                <img src="${cleanImageUrl}" class="max-w-full max-h-[350px] object-contain rounded-md block pointer-events-none">
                
                ${(block.pins || []).map((pin, pIdx) => {
                  const isSelected = selectedCleanPinBlockIdx === bIdx && selectedCleanPinIdx === pIdx;
                  return `
                    <div class="absolute w-5 h-5 ${isSelected ? 'bg-amber-500 ring-4 ring-amber-300 scale-125 z-10' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md cursor-pointer select-none transition-all" 
                         style="left: ${pin.x}%; top: ${pin.y}%; transform: translate(-50%, -50%);"
                         onclick="event.stopPropagation(); selectWorkspaceCleanPin(${bIdx}, ${pIdx});"
                         title="${escapeHtml(pin.name)}">
                      ${pIdx + 1}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Desk Items & Cleanup Configuration</label>
            <div class="grid grid-cols-2 gap-3">
              ${cleanPinEditors.length > 0 ? cleanPinEditors : `<div class="col-span-2 text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">No pins added yet. Please click on the image above to add a pin.</div>`}
            </div>
          </div>
        </div>
      `;
    } else if (block.type === 'swipeDeck') {
      const cardEditors = (block.cards || []).map((card, cIdx) => `
        <div class="bg-slate-50/80 p-3.5 border border-slate-100 rounded-lg flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Card #${cIdx + 1}</span>
            <button class="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" onclick="deleteSwipeDeckCard(${bIdx}, ${cIdx})"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Situation/Question Text</label>
            <textarea class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateSwipeDeckCardField(${bIdx}, ${cIdx}, 'text', this.value)">${escapeHtml(card.text)}</textarea>
          </div>
          <div class="flex items-center gap-1.5 mt-1">
            <label class="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer select-none">
              <input type="checkbox" class="rounded border-slate-200" ${card.isSuspicious ? 'checked' : ''} onchange="updateSwipeDeckCardSuspicious(${bIdx}, ${cIdx}, this.checked)">
              Should Swipe Right (Suspicious)
            </label>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Decision Explanation Feedback</label>
            <textarea class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateSwipeDeckCardField(${bIdx}, ${cIdx}, 'explanation', this.value)">${escapeHtml(card.explanation)}</textarea>
          </div>
        </div>
      `).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Threat Swipe Deck Game (Tinder-style Sorting)</label>
              <span class="text-xs text-slate-500">Learners swipe card situations Left (Safe) or Right (Suspicious) in a gamified awareness challenge.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Title</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.title)}" oninput="updateSwipeDeckField(${bIdx}, 'title', this.value)">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description/Instructions</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateSwipeDeckField(${bIdx}, 'description', this.value)">${escapeHtml(block.description)}</textarea>
          </div>

          <div class="flex justify-between items-center">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Swiper Cards Deck List</label>
            <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer transition-all border border-indigo-100" onclick="addSwipeDeckCard(${bIdx})">+ Add Card</button>
          </div>

          <div class="flex flex-col gap-4">
            ${cardEditors}
          </div>
        </div>
      `;
    } else if (block.type === 'timelineSlider') {
      const stepEditors = (block.steps || []).map((step, sIdx) => `
        <div class="bg-slate-50/80 p-3.5 border border-slate-100 rounded-lg flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step #${sIdx + 1}</span>
            <button class="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" onclick="deleteTimelineStep(${bIdx}, ${sIdx})"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Step Label/Title</label>
            <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(step.label)}" oninput="updateTimelineStepField(${bIdx}, ${sIdx}, 'label', this.value)">
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Description Content</label>
            <textarea class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" rows="2" oninput="updateTimelineStepField(${bIdx}, ${sIdx}, 'content', this.value)">${escapeHtml(step.content)}</textarea>
          </div>
        </div>
      `).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Timeline / Process Step Slider</label>
              <span class="text-xs text-slate-500">Provide chronological milestones, SOP guidelines, or sequential steps.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Title</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.title)}" oninput="updateTimelineField(${bIdx}, 'title', this.value)">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateTimelineField(${bIdx}, 'description', this.value)">${escapeHtml(block.description)}</textarea>
          </div>

          <div class="flex justify-between items-center">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timeline Steps List</label>
            <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer transition-all border border-indigo-100" onclick="addTimelineStep(${bIdx})">+ Add Step</button>
          </div>

          <div class="flex flex-col gap-4">
            ${stepEditors}
          </div>
        </div>
      `;
    } else if (block.type === 'dragDropSort') {
      const categoryList = (block.categories || []).map((cat, cIdx) => `
        <div class="flex gap-2 items-center bg-slate-50 p-2 rounded border border-slate-100">
          <span class="text-[10px] font-bold text-slate-400">#${cIdx + 1}</span>
          <input class="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 flex-grow" type="text" value="${escapeHtml(cat.name)}" oninput="updateDragDropCategory(${bIdx}, ${cIdx}, this.value)">
          <button class="text-slate-400 hover:text-red-500 cursor-pointer" onclick="deleteDragDropCategory(${bIdx}, ${cIdx})"><i class="fa-solid fa-trash-can text-[10px]"></i></button>
        </div>
      `).join('');

      const itemList = (block.items || []).map((item, iIdx) => `
        <div class="bg-slate-50/80 p-3.5 border border-slate-100 rounded-lg flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Draggable Item #${iIdx + 1}</span>
            <button class="text-slate-400 hover:text-red-500 cursor-pointer" onclick="deleteDragDropItem(${bIdx}, ${iIdx})"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-500">Item Text</label>
            <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(item.text)}" oninput="updateDragDropItemField(${bIdx}, ${iIdx}, 'text', this.value)">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-slate-500">Target Category</label>
              <select class="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer" onchange="updateDragDropItemField(${bIdx}, ${iIdx}, 'correctCategoryId', this.value)">
                ${(block.categories || []).map(cat => `<option value="${cat.id}" ${item.correctCategoryId === cat.id ? 'selected' : ''}>${escapeHtml(cat.name)}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-500">Feedback Explanation</label>
            <textarea class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateDragDropItemField(${bIdx}, ${iIdx}, 'explanation', this.value)">${escapeHtml(item.explanation)}</textarea>
          </div>
        </div>
      `).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Drag and Drop Categorizer</label>
              <span class="text-xs text-slate-500">Learners drag cards into priority bins, category boards, or pros/cons stacks.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Title</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(block.title)}" oninput="updateDragDropField(${bIdx}, 'title', this.value)">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateDragDropField(${bIdx}, 'description', this.value)">${escapeHtml(block.description)}</textarea>
          </div>

          <div class="flex justify-between items-center mt-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories / Buckets</label>
            <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer transition-all border border-indigo-100" onclick="addDragDropCategory(${bIdx})">+ Add Category</button>
          </div>
          <div class="grid grid-cols-2 gap-3">${categoryList}</div>

          <div class="flex justify-between items-center mt-4 border-t border-slate-100 pt-4">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Draggable Items List</label>
            <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer transition-all border border-indigo-100" onclick="addDragDropItem(${bIdx})">+ Add Item</button>
          </div>
          <div class="flex flex-col gap-4">${itemList}</div>
        </div>
      `;
    } else if (block.type === 'multiMeterScenario') {
      const nodeKeys = Object.keys(block.nodes || {});
      const nodeEditors = nodeKeys.map(nKey => {
        const node = block.nodes[nKey];
        const choiceConfigs = (node.choices || []).map((ch, cIdx) => `
          <div class="border border-slate-100 p-2.5 rounded bg-slate-50/50 flex flex-col gap-1.5 mt-1">
            <div class="flex justify-between items-center">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Choice #${cIdx + 1}</span>
            </div>
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] font-bold text-slate-500">Choice Text</label>
              <input class="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(ch.text)}" oninput="updateMultiMeterChoiceField(${bIdx}, '${nKey}', ${cIdx}, 'text', this.value)">
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex flex-col gap-0.5">
                <label class="text-[8px] font-bold text-slate-500">Next Node</label>
                <select class="bg-white border border-slate-200 rounded px-1 py-0.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer" onchange="updateMultiMeterChoiceField(${bIdx}, '${nKey}', ${cIdx}, 'nextNode', this.value)">
                  <option value="">-- End Scenario --</option>
                  ${nodeKeys.map(k => `<option value="${k}" ${ch.nextNode === k ? 'selected' : ''}>${k}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="text-[8px] font-bold text-slate-500 mt-1">Meter Updates (+ / -)</div>
            <div class="grid grid-cols-3 gap-2">
              ${(block.meters || []).map(m => `
                <div class="flex flex-col gap-0.5">
                  <label class="text-[7px] text-slate-400 font-semibold">${escapeHtml(m.label)}</label>
                  <input class="bg-white border border-slate-200 rounded px-1 py-0.5 text-xs text-slate-800" type="number" value="${ch.changes?.[m.id] || 0}" oninput="updateMultiMeterChoiceChangeValue(${bIdx}, '${nKey}', ${cIdx}, '${m.id}', this.value)">
                </div>
              `).join('')}
            </div>
            <div class="flex flex-col gap-0.5 mt-1.5">
              <label class="text-[8px] font-bold text-slate-500">Consequence/Feedback</label>
              <input class="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500" type="text" value="${escapeHtml(ch.feedback || '')}" oninput="updateMultiMeterChoiceField(${bIdx}, '${nKey}', ${cIdx}, 'feedback', this.value)">
            </div>
          </div>
        `).join('');

        return `
          <div class="bg-slate-50/80 p-3.5 border border-slate-100 rounded-lg flex flex-col gap-3 relative">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono">Node: "${nKey}"</span>
              ${nKey !== 'start' ? `<button class="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" onclick="deleteMultiMeterNode(${bIdx}, '${nKey}')"><i class="fa-solid fa-trash-can text-xs"></i></button>` : ''}
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Scenario/NPC Prompt Text</label>
              <textarea class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-y" rows="2" oninput="updateMultiMeterNodeField(${bIdx}, '${nKey}', 'promptText', this.value)">${escapeHtml(node.promptText)}</textarea>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">NPC Avatar Theme</label>
                <select class="bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer" onchange="updateMultiMeterNodeField(${bIdx}, '${nKey}', 'avatar', this.value)">
                  <option value="leader" ${node.avatar === 'leader' ? 'selected' : ''}>Leader Normal</option>
                  <option value="leader_happy" ${node.avatar === 'leader_happy' ? 'selected' : ''}>Leader Happy</option>
                  <option value="leader_worried" ${node.avatar === 'leader_worried' ? 'selected' : ''}>Leader Worried</option>
                  <option value="leader_sad" ${node.avatar === 'leader_sad' ? 'selected' : ''}>Leader Sad</option>
                </select>
              </div>
              <div class="flex gap-4 items-center mt-4">
                <label class="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                  <input type="checkbox" class="rounded border-slate-200" ${node.isEnd ? 'checked' : ''} onchange="updateMultiMeterNodeField(${bIdx}, '${nKey}', 'isEnd', this.checked); renderActivePageEditor(); updatePreview();">
                  End Node
                </label>
                ${node.isEnd ? `
                  <label class="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                    <input type="checkbox" class="rounded border-slate-200" ${node.isWin ? 'checked' : ''} onchange="updateMultiMeterNodeField(${bIdx}, '${nKey}', 'isWin', this.checked)">
                    Success/Win Node
                  </label>
                ` : ''}
              </div>
            </div>
            ${!node.isEnd ? `
              <div class="flex flex-col gap-1 mt-2">
                <div class="flex justify-between items-center">
                  <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Decision Choices</label>
                  <button class="px-1.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[9px] font-bold cursor-pointer" onclick="addMultiMeterChoice(${bIdx}, '${nKey}')">+ Add Choice</button>
                </div>
                <div class="flex flex-col gap-2">${choiceConfigs}</div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      const meterEditors = (block.meters || []).map((m, mIdx) => `
        <div class="border border-slate-100 p-2.5 rounded bg-slate-50 flex flex-col gap-1.5">
          <div class="flex justify-between items-center">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Meter #${mIdx + 1}</span>
            <button class="text-slate-400 hover:text-red-500 cursor-pointer" onclick="deleteMultiMeterConfig(${bIdx}, ${mIdx})"><i class="fa-solid fa-trash-can text-[10px]"></i></button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div class="flex flex-col gap-0.5 col-span-2">
              <label class="text-[8px] text-slate-500">Label</label>
              <input class="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs" type="text" value="${escapeHtml(m.label)}" oninput="updateMultiMeterConfigField(${bIdx}, ${mIdx}, 'label', this.value)">
            </div>
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] text-slate-500">Initial Value</label>
              <input class="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs" type="number" value="${m.value}" oninput="updateMultiMeterConfigField(${bIdx}, ${mIdx}, 'value', this.value)">
            </div>
          </div>
        </div>
      `).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Multi-Meter Branching Scenario</label>
              <span class="text-xs text-slate-500">Support, leadership, or customer management scenarios with custom tracker variables.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Title</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none" type="text" value="${escapeHtml(block.title)}" oninput="updateMultiMeterField(${bIdx}, 'title', this.value)">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-xs focus:outline-none" rows="2" oninput="updateMultiMeterField(${bIdx}, 'description', this.value)">${escapeHtml(block.description)}</textarea>
          </div>

          <div class="flex justify-between items-center mt-2 border-t border-slate-100 pt-4">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meters / Variables</label>
            <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer border border-indigo-100" onclick="addMultiMeterConfig(${bIdx})">+ Add Meter</button>
          </div>
          <div class="grid grid-cols-3 gap-3">${meterEditors}</div>

          <div class="flex justify-between items-center mt-4 border-t border-slate-100 pt-4">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scenario Nodes Trees</label>
            <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer border border-indigo-100" onclick="addMultiMeterNode(${bIdx})">+ Add Node</button>
          </div>
          <div class="flex flex-col gap-4">${nodeEditors}</div>
        </div>
      `;
    } else if (block.type === 'explodedBlueprint') {
      const blueprintIdStr = `blueprint-image-${bIdx}`;
      const hotspotEditors = (block.hotspots || []).map((h, hIdx) => `
        <div class="bg-slate-50/80 p-3.5 border border-slate-100 rounded-lg flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hotspot Pin #${hIdx + 1}</span>
            <button class="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" onclick="deleteBlueprintHotspot(${bIdx}, ${hIdx})"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </div>
          <div class="grid grid-cols-12 gap-2">
            <div class="flex flex-col gap-0.5 col-span-8">
              <label class="text-[8px] text-slate-500">Name</label>
              <input class="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-800 focus:outline-none" type="text" value="${escapeHtml(h.name)}" oninput="updateBlueprintHotspotField(${bIdx}, ${hIdx}, 'name', this.value)">
            </div>
            <div class="flex flex-col gap-0.5 col-span-2">
              <label class="text-[8px] text-slate-500">X%</label>
              <input class="bg-white border border-slate-200 rounded px-1 py-0.5 text-xs text-center" type="number" step="0.1" value="${h.x}" oninput="updateBlueprintHotspotField(${bIdx}, ${hIdx}, 'x', this.value)">
            </div>
            <div class="flex flex-col gap-0.5 col-span-2">
              <label class="text-[8px] text-slate-500">Y%</label>
              <input class="bg-white border border-slate-200 rounded px-1 py-0.5 text-xs text-center" type="number" step="0.1" value="${h.y}" oninput="updateBlueprintHotspotField(${bIdx}, ${hIdx}, 'y', this.value)">
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-bold text-slate-500">Description Explanation</label>
            <textarea class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none resize-y" rows="2" oninput="updateBlueprintHotspotField(${bIdx}, ${hIdx}, 'description', this.value)">${escapeHtml(h.description)}</textarea>
          </div>
        </div>
      `).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Blueprint & Diagram Hotspot Inspector</label>
              <span class="text-xs text-slate-500">Place hotspots on blueprints, maps, or software UI layouts to display rich-text popups.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Title</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none" type="text" value="${escapeHtml(block.title)}" oninput="updateBlueprintField(${bIdx}, 'title', this.value)">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-xs focus:outline-none" rows="2" oninput="updateBlueprintField(${bIdx}, 'description', this.value)">${escapeHtml(block.description)}</textarea>
          </div>

          <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Background Image</label>
              <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-2 py-1 text-xs focus:outline-none cursor-pointer" type="file" accept="image/*" onchange="uploadBlueprintImage(${bIdx}, this)">
            </div>
          </div>

          <div class="flex flex-col gap-1 mt-2">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Visual Blueprint Placement (Click diagram to relocate selected pin)</label>
            <div class="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center min-h-[200px]" style="max-height: 350px;">
              <img id="${blueprintIdStr}" src="${block.imageUrl || 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2364748b" font-family="system-ui" font-size="12">Upload blueprint image above</text></svg>')}" class="w-full h-auto object-contain cursor-crosshair" onclick="handleBlueprintMapClick(${bIdx}, event)">
              ${(block.hotspots || []).map((h, hIdx) => `
                <div class="absolute w-5 h-5 rounded-full border border-indigo-400 bg-indigo-600/70 hover:bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold cursor-pointer -translate-x-1/2 -translate-y-1/2 select-none shadow ${selectedBlueprintPinIdx === hIdx && selectedBlueprintPinBlockIdx === bIdx ? 'ring-4 ring-orange-500 border-orange-400 bg-orange-600/90' : ''}" style="left: ${h.x}%; top: ${h.y}%;" onclick="selectBlueprintPin(${bIdx}, ${hIdx}, event)">
                  ${hIdx + 1}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="flex justify-between items-center mt-2 border-t border-slate-100 pt-4">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hotspots Pins List</label>
            <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer border border-indigo-100" onclick="addBlueprintHotspot(${bIdx})">+ Add Pin</button>
          </div>
          <div class="grid grid-cols-2 gap-3">${hotspotEditors}</div>
        </div>
      `;
    } else if (block.type === 'variableGraph') {
      const sliderEditors = (block.sliders || []).map((sl, sIdx) => `
        <div class="bg-slate-50/80 p-3.5 border border-slate-100 rounded-lg flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Variable Slider #${sIdx + 1}</span>
            <button class="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" onclick="deleteGraphSlider(${bIdx}, ${sIdx})"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div class="flex flex-col gap-0.5 col-span-2">
              <label class="text-[8px] text-slate-500">Slider Label</label>
              <input class="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs" type="text" value="${escapeHtml(sl.label)}" oninput="updateGraphSliderField(${bIdx}, ${sIdx}, 'label', this.value)">
            </div>
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] text-slate-500">Curve Shift Weight</label>
              <input class="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-center" type="number" step="0.1" value="${sl.weight}" oninput="updateGraphSliderField(${bIdx}, ${sIdx}, 'weight', this.value)">
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] text-slate-500">Min</label>
              <input class="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-center" type="number" value="${sl.min}" oninput="updateGraphSliderField(${bIdx}, ${sIdx}, 'min', this.value)">
            </div>
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] text-slate-500">Initial</label>
              <input class="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-center" type="number" value="${sl.value}" oninput="updateGraphSliderField(${bIdx}, ${sIdx}, 'value', this.value)">
            </div>
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] text-slate-500">Max</label>
              <input class="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-center" type="number" value="${sl.max}" oninput="updateGraphSliderField(${bIdx}, ${sIdx}, 'max', this.value)">
            </div>
          </div>
        </div>
      `).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Interactive variable Graph Curve Simulator</label>
              <span class="text-xs text-slate-500">Create sliders to shift demand/supply, stress/strain, or general math functions curves dynamically.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Title</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none" type="text" value="${escapeHtml(block.title)}" oninput="updateGraphField(${bIdx}, 'title', this.value)">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-xs focus:outline-none" rows="2" oninput="updateGraphField(${bIdx}, 'description', this.value)">${escapeHtml(block.description)}</textarea>
          </div>

          <div class="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <div class="flex flex-col gap-0.5">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">X-Axis Label</label>
              <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800" type="text" value="${escapeHtml(block.xAxisLabel)}" oninput="updateGraphField(${bIdx}, 'xAxisLabel', this.value)">
            </div>
            <div class="flex flex-col gap-0.5">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Y-Axis Label</label>
              <input class="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800" type="text" value="${escapeHtml(block.yAxisLabel)}" oninput="updateGraphField(${bIdx}, 'yAxisLabel', this.value)">
            </div>
          </div>

          <div class="flex justify-between items-center mt-2 border-t border-slate-100 pt-4">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Variables Sliders Config</label>
            <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer border border-indigo-100" onclick="addGraphSlider(${bIdx})">+ Add Variable</button>
          </div>
          <div class="grid grid-cols-2 gap-3">${sliderEditors}</div>
        </div>
      `;
    } else if (block.type === 'memoryMatch') {
      const pairEditors = (block.pairs || []).map((pair, pIdx) => `
        <div class="bg-slate-50/80 p-3.5 border border-slate-100 rounded-lg flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matching Pair #${pIdx + 1}</span>
            <button class="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" onclick="deleteMemoryPair(${bIdx}, ${pIdx})"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] text-slate-500">Term / Card A</label>
              <input class="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 focus:outline-none" type="text" value="${escapeHtml(pair.term)}" oninput="updateMemoryPairField(${bIdx}, ${pIdx}, 'term', this.value)">
            </div>
            <div class="flex flex-col gap-0.5">
              <label class="text-[8px] text-slate-500">Match Definition / Card B</label>
              <input class="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 focus:outline-none" type="text" value="${escapeHtml(pair.definition)}" oninput="updateMemoryPairField(${bIdx}, ${pIdx}, 'definition', this.value)">
            </div>
          </div>
        </div>
      `).join('');

      html += `
        <div class="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col gap-4 relative group shadow-sm hover:border-slate-300 transition-all duration-200" data-block-idx="${bIdx}">
          <button class="absolute top-4 right-4 text-slate-400 hover:text-red-500 cursor-pointer text-sm font-bold transition-colors" onclick="deleteBlock(${bIdx})">×</button>
          
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <div class="flex flex-col gap-0.5">
              <label class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Memory Match Flipping Pairs Game</label>
              <span class="text-xs text-slate-500">Grid of flippable cards where learners match terms, concepts, or short definitions.</span>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Title</label>
            <input class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-1.5 text-xs focus:outline-none" type="text" value="${escapeHtml(block.title)}" oninput="updateMemoryField(${bIdx}, 'title', this.value)">
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea class="bg-white border border-slate-200 rounded-lg text-slate-800 px-3 py-2 text-xs focus:outline-none resize-y" rows="2" oninput="updateMemoryField(${bIdx}, 'description', this.value)">${escapeHtml(block.description)}</textarea>
          </div>

          <div class="flex justify-between items-center mt-2 border-t border-slate-100 pt-4">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matching Pairs Cards Deck</label>
            <button class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold cursor-pointer transition-all border border-indigo-100" onclick="addMemoryPair(${bIdx})">+ Add Pair</button>
          </div>

          <div class="flex flex-col gap-4">
            ${pairEditors}
          </div>
        </div>
      `;
    }
  });
  
  editorBody.innerHTML = html;
  
  // Bind live updates
  const pageTitleInput = document.getElementById('active-page-title');
  pageTitleInput.addEventListener('input', (e) => {
    page.title = e.target.value;
    renderPagesList();
    updatePreview();
  });
  
  const textareas = editorBody.querySelectorAll('.block-text-content');
  textareas.forEach((textarea) => {
    textarea.addEventListener('input', (e) => {
      const card = e.target.closest('[data-block-idx]');
      const bIdx = parseInt(card.dataset.blockIdx, 10);
      page.blocks[bIdx].content = e.target.value;
      updatePreview();
    });
  });
}

window.deleteBlock = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks.splice(bIdx, 1);
  renderActivePageEditor();
  updatePreview();
};

function addBlock(type) {
  const page = courseState.pages[activePageIdx];
  if (!page) return;
  
  if (type === 'text') {
    page.blocks.push({
      type: 'text',
      content: '<p>A new text paragraph block.</p>'
    });
  } else if (type === 'card') {
    page.blocks.push({
      type: 'card',
      front: 'Front side question/concept',
      back: 'Back side answer/definition'
    });
  } else if (type === 'accordion') {
    page.blocks.push({
      type: 'accordion',
      title: 'Accordion Title',
      content: '<p>Hidden descriptive text revealed on click.</p>'
    });
  } else if (type === 'tabs') {
    page.blocks.push({
      type: 'tabs',
      tabs: [
        { label: 'Tab A', content: '<p>Content for Tab A.</p>' },
        { label: 'Tab B', content: '<p>Content for Tab B.</p>' }
      ]
    });
  } else if (type === 'hotspots') {
    page.blocks.push({
      type: 'hotspots',
      text: 'Hover over the term security to learn more.',
      items: [
        { phrase: 'security', tooltip: 'The state of being free from danger or threat.' }
      ]
    });
  } else if (type === 'quiz') {
    page.blocks.push({
      type: 'quiz',
      question: 'New Question?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0
    });
  } else if (type === 'chat') {
    page.blocks.push({
      type: 'chat',
      senderName: 'Dinas Sosial',
      messages: [
        { sender: 'them', text: 'Selamat siang Bapak/Ibu, ini file daftar penerima bansos terbaru untuk desa Bapak/Ibu. Silakan diinstal ya.' },
        { sender: 'them', text: 'penerima_bansos_desa.apk', isAttachment: true, attachmentType: 'apk' }
      ],
      choices: [
        { text: 'Klik dan pasang file APK tersebut', feedback: 'Vulnerable! File APK dari nomor tak dikenal sering kali merupakan malware pencuri data/SMS/OTP.', isCorrect: false },
        { text: 'Hapus pesan dan laporkan nomor tersebut', feedback: 'Safe! Anda berhasil mengidentifikasi penipuan file .apk palsu dan melindungi perangkat Anda.', isCorrect: true }
      ]
    });
  } else if (type === 'passwordMeter') {
    page.blocks.push({
      type: 'passwordMeter',
      title: 'Uji Kekuatan Password Desa Anda',
      description: 'Ketikkan password tiruan di bawah ini untuk melihat penilaian indikator kekuatannya.'
    });
  } else if (type === 'visualHotspot') {
    page.blocks.push({
      type: 'visualHotspot',
      title: 'Cari Risiko Keamanan di Kantor Desa (Spot the Mistake)',
      description: 'Klik pada area yang tidak aman pada meja kerja di bawah ini.',
      imageUrl: '',
      hazards: [
        { id: 'sticky', name: 'Catatan Password di Monitor', description: 'Menempelkan password secara terbuka memudahkan orang lain membajak akun dinas Anda.', x: 65.31, y: 53.33 },
        { id: 'unlocked', name: 'Layar Komputer Tidak Terkunci', description: 'Biasakan menekan tombol Win + L saat meninggalkan meja kerja agar tidak diakses orang asing.', x: 50.00, y: 36.67 },
        { id: 'usb', name: 'USB Flashdisk Asing Tercolok', description: 'Mencolokkan flashdisk sembarangan berisiko menyebarkan virus atau malware mata-mata.', x: 71.88, y: 76.89 },
        { id: 'papers', name: 'Dokumen NIK Warga Terbuka', description: 'Dokumen kertas berisi NIK warga harus dirapikan dan disimpan di laci terkunci agar tidak disalahgunakan.', x: 21.25, y: 82.22 }
      ]
    });
  } else if (type === 'emailPhishing') {
    page.blocks.push({
      type: 'emailPhishing',
      labels: { reportBtn: 'Report Phishing', deleteBtn: 'Delete', safeBtn: 'Mark Safe' },
      senderName: 'Bank Indonesia Support',
      senderEmail: 'security-alert@bi-support.org',
      dateStr: 'Saturday, June 6, 2026 09:12 AM',
      subject: 'Security Alert: Verify Your Corporate Access Immediately',
      emailBody: '<p>Dear Staff,</p><p>We detected an anomalous login attempt from an unrecognized IP address. Please inspect the security details and verify your credentials immediately at: <a href="http://bi-verification.org/login" style="color: #4f46e5; text-decoration: underline;">http://bi.go.id/verification</a>.</p><p>Failure to verify within 24 hours will result in temporary suspension of access.</p>',
      returnPath: 'bounce-tracker@spammer-network.ru',
      receivedFrom: 'mail.bi-support.org (unknown IP [185.220.101.44])',
      spfCheck: 'FAIL',
      dkimCheck: 'FAIL',
      correctAction: 'phish',
      feedbackCorrect: 'Excellent! You successfully identified this as a phishing attempt due to mismatched sender domains, failed SPF/DKIM flags, and suspicious links.',
      feedbackIncorrect: 'Incorrect. This email is malicious. Always check the headers (SPF/DKIM FAIL) and hover over links to inspect destination URLs.'
    });
  } else if (type === 'dialogueBranching') {
    page.blocks.push({
      type: 'dialogueBranching',
      title: 'Social Engineering Challenge',
      labels: { riskLevel: 'BREACH RISK LEVEL:', startBtn: 'Start', resetBtn: 'Restart Scenario' },
      initialNode: 'start',
      nodes: {
        'start': {
          attackerText: 'Halo! Saya kurir pengantar paket. Ada dokumen penting yang harus ditandatangani kepala desa segera, boleh saya langsung masuk ke ruang kerja beliau?',
          avatar: 'delivery',
          choices: [
            { text: 'Oh tentu, silakan langsung masuk saja, pintunya di ujung lorong.', nextNode: 'fail_unauthorized', riskChange: 40, feedback: 'Anda membiarkan orang asing masuk tanpa izin!' },
            { text: 'Mohon maaf, Anda harus menunggu di lobi sementara saya konfirmasi ke sekretaris desa terlebih dahulu.', nextNode: 'ask_id', riskChange: -10, feedback: 'Langkah yang baik! Mengurangi risiko akses tanpa izin.' },
            { text: 'Beliau sedang sibuk. Taruh saja dokumennya di meja saya, biar saya yang tanda tangani.', nextNode: 'accept_package', riskChange: 10, feedback: 'Cukup aman, tetapi pastikan identitas dokumen valid.' }
          ]
        },
        'ask_id': {
          attackerText: 'Aduh mba/mas, ini buru-buru sekali karena saya harus mengantar 10 paket lainnya. Boleh minta tolong dibantu cepat saja?',
          avatar: 'delivery_hurry',
          choices: [
            { text: 'Baiklah, silakan masuk ke lobi dalam agar cepat selesai.', nextNode: 'fail_unauthorized', riskChange: 30, feedback: 'Mendesak bukan alasan untuk melanggar prosedur!' },
            { text: 'Prosedur kami tetap mengharuskan verifikasi kartu identitas dan pencatatan kunjungan. Silakan tunjukkan tanda pengenal Anda.', nextNode: 'success_verified', riskChange: -20, feedback: 'Sangat bagus! Anda teguh mematuhi prosedur keamanan.' },
            { text: 'Ya sudah, berikan dokumennya di sini, saya panggilkan sekretaris desa ke depan.', nextNode: 'success_verified', riskChange: 0, feedback: 'Cukup baik untuk menjaga keamanan fisik.' }
          ]
        },
        'fail_unauthorized': {
          attackerText: 'Terima kasih banyak kerjasamanya! (Attacker berhasil masuk dan menaruh USB keylogger di komputer kepala desa)',
          avatar: 'attacker_success',
          isEnd: true,
          isWin: false
        },
        'accept_package': {
          attackerText: 'Baik, terima kasih. Ini dokumen dan pulpen khusus dari saya ya. (Pulpen ternyata berisi flashdisk perekam suara)',
          avatar: 'delivery_leave',
          isEnd: true,
          isWin: false
        },
        'success_verified': {
          attackerText: 'Baik, ini KTP saya. Terima kasih sudah membantu memeriksa dengan tertib.',
          avatar: 'delivery_compliant',
          isEnd: true,
          isWin: true
        }
      }
    });
  } else if (type === 'workspaceClean') {
    page.blocks.push({
      type: 'workspaceClean',
      title: 'Clean Desk Inspector',
      labels: { hotspotsList: 'HOTSPOTS PINS LIST', explanationTitle: 'Description Explanation', correctFeedback: 'Correct!', incorrectFeedback: 'Incorrect.' },
      description: 'Klik pada objek yang tidak aman dan tentukan tindakan pengamanan yang tepat.',
      imageUrl: '',
      pins: [
        { id: 'p_1', name: 'Password Sticky Note', x: 65, y: 55, correctAction: 'lock', options: [ { id: 'lock', label: 'Simpan di laci terkunci' }, { id: 'leave', label: 'Biarkan menempel' }, { id: 'trash', label: 'Buang ke tempat sampah biasa' } ], explanation: 'Password harus disimpan di tempat tertutup, jangan pernah ditempel di tempat umum!' },
        { id: 'p_2', name: 'Layar Komputer Terbuka', x: 50, y: 35, correctAction: 'lock_screen', options: [ { id: 'lock_screen', label: 'Kunci Layar (Win + L)' }, { id: 'leave', label: 'Biarkan menyala' } ], explanation: 'Selalu kunci layar Anda sebelum meninggalkan meja kerja agar data warga tetap aman.' }
      ]
    });
  } else if (type === 'swipeDeck') {
    page.blocks.push({
      type: 'swipeDeck',
      title: 'Cybersecurity Threat Swipe Game',
      labels: { swipeLeft: 'Swipe Left (Safe)', swipeRight: 'Swipe Right (Suspicious)', correct: 'Correct!', incorrect: 'Incorrect', endTitle: 'Deck Completed!' },
      description: 'Geser kartu ke KIRI untuk (Aman) atau ke KANAN untuk (Mencurigakan).',
      cards: [
        { id: 'c_1', text: 'Email dari direktur utama meminta transfer uang mendesak menggunakan email personal gratis (@gmail.com).', isSuspicious: true, explanation: 'Mencurigakan! Pejabat resmi tidak menggunakan email pribadi untuk urusan kedinasan sensitif.' },
        { id: 'c_2', text: 'Pesan WhatsApp dari rekan kerja mengonfirmasi link rapat koordinasi Zoom dengan domain resmi zoom.us.', isSuspicious: false, explanation: 'Aman! Domain resmi zoom.us valid dan berasal dari kontak yang sudah dikenal.' }
      ]
    });
  } else if (type === 'timelineSlider') {
    page.blocks.push({
      type: 'timelineSlider',
      title: 'Interactive Process & Milestone Timeline',
      description: 'Geser slider atau klik tombol angka untuk mengikuti langkah demi langkah prosedur standard.',
      steps: [
        { label: 'Langkah 1: Pendaftaran', content: 'Calon pendaftar mengisi formulir online dan mengunggah berkas persyaratan.' },
        { label: 'Langkah 2: Verifikasi', content: 'Petugas memeriksa keabsahan dokumen dan mencocokkan data identitas.' },
        { label: 'Langkah 3: Persetujuan', content: 'Kepala bidang memberikan tanda tangan persetujuan akhir secara elektronik.' }
      ]
    });
  } else if (type === 'dragDropSort') {
    page.blocks.push({
      type: 'dragDropSort',
      title: 'Drag and Drop Categorizer',
      labels: { checkBtn: 'Check Answers', resetBtn: 'Reset', unassigned: 'Unassigned Items', correct: 'Correct', incorrect: 'Incorrect' },
      description: 'Tarik setiap item di bawah ini ke dalam kategori yang tepat.',
      categories: [
        { id: 'cat_1', name: 'Aset Desa' },
        { id: 'cat_2', name: 'Aset Pribadi' }
      ],
      items: [
        { id: 'item_1', text: 'Mobil Dinas Ambulans Desa', correctCategoryId: 'cat_1', explanation: 'Ambulans desa dibeli menggunakan APBDesa untuk kepentingan umum warga desa.' },
        { id: 'item_2', text: 'Handphone Pribadi Sekretaris Desa', correctCategoryId: 'cat_2', explanation: 'Barang milik pribadi staf desa bukan merupakan aset kedinasan.' },
        { id: 'item_3', text: 'Laptop Operasional Kantor Desa', correctCategoryId: 'cat_1', explanation: 'Laptop dinas adalah inventaris kantor untuk mempermudah administrasi pelayanan.' }
      ]
    });
  } else if (type === 'multiMeterScenario') {
    page.blocks.push({
      type: 'multiMeterScenario',
      title: 'Branching Management Scenario',
      labels: { restartBtn: 'Restart Scenario' },
      description: 'Ambil keputusan kepemimpinan yang tepat. Pilihan Anda akan memengaruhi Kepuasan Warga, Anggaran Desa, dan Kinerja Staf.',
      initialNode: 'start',
      meters: [
        { id: 'm1', label: 'Kepuasan Warga', value: 50, color: '#10b981' },
        { id: 'm2', label: 'Anggaran Desa', value: 70, color: '#f59e0b' },
        { id: 'm3', label: 'Kinerja Staf', value: 60, color: '#3b82f6' }
      ],
      nodes: {
        'start': {
          promptText: 'Warga mengeluhkan antrean pengurusan KTP yang sangat lambat karena kurangnya petugas loket. Apa tindakan Anda?',
          avatar: 'leader',
          choices: [
            { text: 'Rekrut staf loket tambahan menggunakan dana tak terduga.', nextNode: 'node_rekrut', changes: { m1: 30, m2: -30, m3: 10 }, feedback: 'Kepuasan warga meningkat tajam, namun anggaran desa berkurang secara signifikan.' },
            { text: 'Alihkan staf administrasi internal untuk membantu loket pada jam sibuk.', nextNode: 'node_internal', changes: { m1: 15, m2: 0, m3: -20 }, feedback: 'Solusi hemat anggaran, tetapi beban kerja staf bertambah menyebabkan moral kinerja menurun.' },
            { text: 'Gunakan sistem antrean online mandiri untuk mengurangi antrean fisik.', nextNode: 'node_digital', changes: { m1: 25, m2: -15, m3: 15 }, feedback: 'Langkah digitalisasi yang efisien dengan anggaran sedang dan kepuasan warga yang solid!' }
          ]
        },
        'node_rekrut': {
          promptText: 'Petugas baru telah bekerja, warga senang antrean cepat. Namun anggaran menipis, membatasi program lainnya.',
          avatar: 'leader_worried',
          isEnd: true,
          isWin: true
        },
        'node_internal': {
          promptText: 'Staf internal mengeluhkan kelelahan kerja dan tugas administrasi mereka terbengkalai.',
          avatar: 'leader_sad',
          isEnd: true,
          isWin: false
        },
        'node_digital': {
          promptText: 'Sistem online berjalan lancar. Warga mengapresiasi inovasi digital pelayanan desa!',
          avatar: 'leader_happy',
          isEnd: true,
          isWin: true
        }
      }
    });
  } else if (type === 'explodedBlueprint') {
    page.blocks.push({
      type: 'explodedBlueprint',
      title: 'Exploded Diagram & Blueprint Inspector',
      description: 'Klik area hotspot pada diagram di bawah untuk memeriksa penjelasan komponen secara mendalam.',
      imageUrl: '',
      hotspots: [
        { id: 'bp_1', name: 'Komponen Mesin Utama', x: 30, y: 40, description: 'Ini adalah motor penggerak utama yang mengonversi energi listrik menjadi energi kinetik.' },
        { id: 'bp_2', name: 'Sistem Pendingin (Cooling)', x: 70, y: 35, description: 'Radiator pendingin bertugas menstabilkan suhu mesin agar tidak mengalami overheat.' }
      ]
    });
  } else if (type === 'variableGraph') {
    page.blocks.push({
      type: 'variableGraph',
      title: 'Interactive Variable Graph Curve Simulator',
      description: 'Sesuaikan slider variabel ekonomi di bawah untuk melihat pergeseran kurva penawaran dan permintaan.',
      sliders: [
        { label: 'Tingkat Harga (Price)', value: 50, min: 10, max: 100, weight: 1.2 },
        { label: 'Biaya Produksi (Production Cost)', value: 30, min: 10, max: 100, weight: -0.8 }
      ],
      xAxisLabel: 'Kuantitas (Quantity)',
      yAxisLabel: 'Harga (Price)'
    });
  } else if (type === 'memoryMatch') {
    page.blocks.push({
      type: 'memoryMatch',
      title: 'Memory Pair Matching Game',
      description: 'Temukan pasangan kartu yang cocok antara Istilah dan Definisinya.',
      pairs: [
        { id: 'pair_1', term: 'APBD', definition: 'Anggaran Pendapatan dan Belanja Daerah' },
        { id: 'pair_2', term: 'BPD', definition: 'Badan Permusyawaratan Desa' },
        { id: 'pair_3', term: 'Musrenbang', definition: 'Musyawarah Perencanaan Pembangunan' }
      ]
    });
  }
  
  renderActivePageEditor();
  updatePreview();
}

// Inline updates
window.updateCardFront = function(bIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].front = val;
  updatePreview();
};

window.updateCardBack = function(bIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].back = val;
  updatePreview();
};

window.updateAccordionTitle = function(bIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].title = val;
  updatePreview();
};

window.updateAccordionContent = function(bIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].content = val;
  updatePreview();
};

window.updateQuizQuestion = function(bIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].question = val;
  updatePreview();
};

window.updateQuizOption = function(bIdx, oIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].options[oIdx] = val;
  updatePreview();
};

window.updateQuizCorrect = function(bIdx, oIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].correct = oIdx;
  updatePreview();
};

window.updateTabLabel = function(bIdx, tIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].tabs[tIdx].label = val;
  updatePreview();
};

window.updateTabContent = function(bIdx, tIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].tabs[tIdx].content = val;
  updatePreview();
};

window.addTabToBlock = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].tabs.push({
    label: 'New Tab',
    content: '<p>New tab body content.</p>'
  });
  renderActivePageEditor();
  updatePreview();
};

window.deleteTabFromBlock = function(bIdx, tIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].tabs.splice(tIdx, 1);
  renderActivePageEditor();
  updatePreview();
};

window.updateHotspotText = function(bIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].text = val;
  updatePreview();
};

window.updateHotspotLayout = function(bIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].layout = val;
  renderActivePageEditor();
  updatePreview();
};

window.updateHotspotEmailField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};

window.updateHotspotPhrase = function(bIdx, iIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].items[iIdx].phrase = val;
  updatePreview();
};

window.updateHotspotTooltip = function(bIdx, iIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].items[iIdx].tooltip = val;
  updatePreview();
};

window.addHotspotItem = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].items.push({
    phrase: 'new phrase',
    tooltip: 'description'
  });
  renderActivePageEditor();
  updatePreview();
};

window.deleteHotspotItem = function(bIdx, iIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].items.splice(iIdx, 1);
  renderActivePageEditor();
  updatePreview();
};

window.updateChatSenderName = function(bIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].senderName = val;
  updatePreview();
};

window.updateChatLabel = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};

window.updateChatMessageSender = function(bIdx, mIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].messages[mIdx].sender = val;
  updatePreview();
};

window.updateChatMessageText = function(bIdx, mIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].messages[mIdx].text = val;
  updatePreview();
};

window.updateChatMessageAttachmentType = function(bIdx, mIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].messages[mIdx].attachmentType = val;
  page.blocks[bIdx].messages[mIdx].isAttachment = (val !== 'none');
  renderActivePageEditor();
  updatePreview();
};

window.addChatMessage = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].messages.push({
    sender: 'them',
    text: 'New message',
    isAttachment: false,
    attachmentType: 'none'
  });
  renderActivePageEditor();
  updatePreview();
};

window.deleteChatMessage = function(bIdx, mIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].messages.splice(mIdx, 1);
  renderActivePageEditor();
  updatePreview();
};

window.updateChatChoiceText = function(bIdx, cIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].choices[cIdx].text = val;
  updatePreview();
};

window.updateChatChoiceFeedback = function(bIdx, cIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].choices[cIdx].feedback = val;
  updatePreview();
};

window.updateChatChoiceCorrect = function(bIdx, cIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].choices.forEach((ch, idx) => {
    ch.isCorrect = (idx === cIdx);
  });
  updatePreview();
};

window.updatePasswordMeterField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};

window.updateVisualHotspotField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};

window.uploadVisualHotspotImage = function(bIdx, fileInput) {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const page = courseState.pages[activePageIdx];
    page.blocks[bIdx].imageUrl = e.target.result;
    renderActivePageEditor();
    updatePreview();
  };
  reader.readAsDataURL(file);
};

let selectedPinBlockIdx = null;
let selectedPinIdx = null;

window.selectVisualHotspotPin = function(bIdx, hIdx) {
  selectedPinBlockIdx = bIdx;
  selectedPinIdx = hIdx;
  renderActivePageEditor();
};

window.deselectVisualHotspotPin = function() {
  selectedPinBlockIdx = null;
  selectedPinIdx = null;
  renderActivePageEditor();
};

window.imageClickAddHotspot = function(event, bIdx) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  
  const page = courseState.pages[activePageIdx];
  const block = page.blocks[bIdx];
  if (!block.hazards) block.hazards = [];
  
  if (selectedPinBlockIdx === bIdx && selectedPinIdx !== null && block.hazards[selectedPinIdx]) {
    block.hazards[selectedPinIdx].x = parseFloat(x.toFixed(2));
    block.hazards[selectedPinIdx].y = parseFloat(y.toFixed(2));
  } else {
    const nextId = 'pin_' + Date.now();
    block.hazards.push({
      id: nextId,
      name: `Hazard Pin ${block.hazards.length + 1}`,
      description: 'Enter explanation regarding the security risk at this location.',
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2))
    });
  }
  
  renderActivePageEditor();
  updatePreview();
};

window.deleteVisualHotspotPin = function(bIdx, hIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].hazards.splice(hIdx, 1);
  if (selectedPinBlockIdx === bIdx && selectedPinIdx === hIdx) {
    selectedPinBlockIdx = null;
    selectedPinIdx = null;
  } else if (selectedPinBlockIdx === bIdx && selectedPinIdx > hIdx) {
    selectedPinIdx--;
  }
  renderActivePageEditor();
  updatePreview();
};

window.updateVisualHotspotPinField = function(bIdx, hIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].hazards[hIdx][field] = val;
  updatePreview();
};

window.updateEmailPhishingField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};

window.updateDialogueBranchingField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};

window.updateDialogueNodeField = function(bIdx, nodeKey, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].nodes[nodeKey][field] = val;
  updatePreview();
};

window.updateDialogueChoiceField = function(bIdx, nodeKey, cIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].nodes[nodeKey].choices[cIdx][field] = val;
  updatePreview();
};

window.updateDialogueChoiceRisk = function(bIdx, nodeKey, cIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].nodes[nodeKey].choices[cIdx].riskChange = parseInt(val, 10) || 0;
  updatePreview();
};

window.addDialogueNode = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  const nodeKey = 'node_' + Date.now().toString(36);
  page.blocks[bIdx].nodes[nodeKey] = {
    attackerText: 'New character speech',
    avatar: 'delivery',
    choices: [
      { text: 'Choice 1', nextNode: '', riskChange: 0, feedback: '' }
    ]
  };
  renderActivePageEditor();
  updatePreview();
};

window.deleteDialogueNode = function(bIdx, nodeKey) {
  const page = courseState.pages[activePageIdx];
  if (nodeKey === 'start') {
    alert("Cannot delete start node!");
    return;
  }
  delete page.blocks[bIdx].nodes[nodeKey];
  renderActivePageEditor();
  updatePreview();
};

window.updateWorkspaceCleanField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};

window.updateWorkspaceCleanPinField = function(bIdx, pIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].pins[pIdx][field] = val;
  updatePreview();
};

window.updateWorkspaceCleanPinOption = function(bIdx, pIdx, oIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].pins[pIdx].options[oIdx][field] = val;
  updatePreview();
};

let selectedCleanPinBlockIdx = null;
let selectedCleanPinIdx = null;

window.selectWorkspaceCleanPin = function(bIdx, pIdx) {
  selectedCleanPinBlockIdx = bIdx;
  selectedCleanPinIdx = pIdx;
  renderActivePageEditor();
};

window.deselectWorkspaceCleanPin = function() {
  selectedCleanPinBlockIdx = null;
  selectedCleanPinIdx = null;
  renderActivePageEditor();
};

window.workspaceCleanClickAddPin = function(event, bIdx) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  const page = courseState.pages[activePageIdx];
  const block = page.blocks[bIdx];
  if (!block.pins) block.pins = [];

  if (selectedCleanPinBlockIdx === bIdx && selectedCleanPinIdx !== null && block.pins[selectedCleanPinIdx]) {
    block.pins[selectedCleanPinIdx].x = parseFloat(x.toFixed(2));
    block.pins[selectedCleanPinIdx].y = parseFloat(y.toFixed(2));
  } else {
    const nextId = 'p_' + Date.now().toString(36);
    block.pins.push({
      id: nextId,
      name: `Hazard/Desk Item ${block.pins.length + 1}`,
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
      correctAction: 'lock',
      options: [
        { id: 'lock', label: 'Secure/Lock it' },
        { id: 'leave', label: 'Leave it' }
      ],
      explanation: 'Explain the threat or secure action required.'
    });
  }

  renderActivePageEditor();
  updatePreview();
};

window.deleteWorkspaceCleanPin = function(bIdx, pIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].pins.splice(pIdx, 1);
  if (selectedCleanPinBlockIdx === bIdx && selectedCleanPinIdx === pIdx) {
    selectedCleanPinBlockIdx = null;
    selectedCleanPinIdx = null;
  } else if (selectedCleanPinBlockIdx === bIdx && selectedCleanPinIdx > pIdx) {
    selectedCleanPinIdx--;
  }
  renderActivePageEditor();
  updatePreview();
};

window.uploadWorkspaceCleanImage = function(bIdx, fileInput) {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const page = courseState.pages[activePageIdx];
    page.blocks[bIdx].imageUrl = e.target.result;
    renderActivePageEditor();
    updatePreview();
  };
  reader.readAsDataURL(file);
};

window.updateSwipeDeckField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};

window.updateSwipeDeckCardField = function(bIdx, cIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].cards[cIdx][field] = val;
  updatePreview();
};

window.updateSwipeDeckCardSuspicious = function(bIdx, cIdx, checked) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].cards[cIdx].isSuspicious = checked;
  updatePreview();
};

window.addSwipeDeckCard = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].cards.push({
    id: 'c_' + Date.now().toString(36),
    text: 'New Situation Text...',
    isSuspicious: false,
    explanation: 'Why is this safe or suspicious?'
  });
  renderActivePageEditor();
  updatePreview();
};

window.deleteSwipeDeckCard = function(bIdx, cIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].cards.splice(cIdx, 1);
  renderActivePageEditor();
  updatePreview();
};

// Timeline slider updaters
window.updateTimelineField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};
window.updateTimelineStepField = function(bIdx, sIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].steps[sIdx][field] = val;
  updatePreview();
};
window.addTimelineStep = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  if (!page.blocks[bIdx].steps) page.blocks[bIdx].steps = [];
  page.blocks[bIdx].steps.push({
    label: `Langkah ${page.blocks[bIdx].steps.length + 1}`,
    content: 'Content details for this step...'
  });
  renderActivePageEditor();
  updatePreview();
};
window.deleteTimelineStep = function(bIdx, sIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].steps.splice(sIdx, 1);
  renderActivePageEditor();
  updatePreview();
};

// Drag and drop categorizer updaters
window.updateDragDropField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};
window.updateDragDropCategory = function(bIdx, cIdx, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].categories[cIdx].name = val;
  renderActivePageEditor();
  updatePreview();
};
window.addDragDropCategory = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  if (!page.blocks[bIdx].categories) page.blocks[bIdx].categories = [];
  const id = 'cat_' + Date.now().toString(36);
  page.blocks[bIdx].categories.push({ id, name: `Kategori ${page.blocks[bIdx].categories.length + 1}` });
  renderActivePageEditor();
  updatePreview();
};
window.deleteDragDropCategory = function(bIdx, cIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].categories.splice(cIdx, 1);
  renderActivePageEditor();
  updatePreview();
};
window.updateDragDropItemField = function(bIdx, iIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].items[iIdx][field] = val;
  updatePreview();
};
window.addDragDropItem = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  if (!page.blocks[bIdx].items) page.blocks[bIdx].items = [];
  const correctCat = page.blocks[bIdx].categories?.[0]?.id || '';
  page.blocks[bIdx].items.push({
    id: 'item_' + Date.now().toString(36),
    text: 'New Draggable Item Text...',
    correctCategoryId: correctCat,
    explanation: 'Why does this item belong to this category?'
  });
  renderActivePageEditor();
  updatePreview();
};
window.deleteDragDropItem = function(bIdx, iIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].items.splice(iIdx, 1);
  renderActivePageEditor();
  updatePreview();
};

// Multi-meter scenario updaters
window.updateMultiMeterField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};
window.updateMultiMeterConfigField = function(bIdx, mIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  const block = page.blocks[bIdx];
  if (field === 'value') {
    block.meters[mIdx].value = parseInt(val, 10) || 0;
  } else {
    block.meters[mIdx].label = val;
  }
  updatePreview();
};
window.addMultiMeterConfig = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  const block = page.blocks[bIdx];
  if (!block.meters) block.meters = [];
  const id = 'm' + (block.meters.length + 1);
  block.meters.push({ id, label: `Variable Meter ${block.meters.length + 1}`, value: 50, color: '#3b82f6' });
  renderActivePageEditor();
  updatePreview();
};
window.deleteMultiMeterConfig = function(bIdx, mIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].meters.splice(mIdx, 1);
  renderActivePageEditor();
  updatePreview();
};
window.updateMultiMeterNodeField = function(bIdx, nKey, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].nodes[nKey][field] = val;
  updatePreview();
};
window.addMultiMeterNode = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  const block = page.blocks[bIdx];
  const nKey = 'node_' + Date.now().toString(36);
  block.nodes[nKey] = {
    promptText: 'NPC speaking text here...',
    avatar: 'leader',
    choices: []
  };
  renderActivePageEditor();
  updatePreview();
};
window.deleteMultiMeterNode = function(bIdx, nKey) {
  const page = courseState.pages[activePageIdx];
  delete page.blocks[bIdx].nodes[nKey];
  renderActivePageEditor();
  updatePreview();
};
window.updateMultiMeterChoiceField = function(bIdx, nKey, cIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].nodes[nKey].choices[cIdx][field] = val;
  updatePreview();
};
window.updateMultiMeterChoiceChangeValue = function(bIdx, nKey, cIdx, meterId, val) {
  const page = courseState.pages[activePageIdx];
  const choice = page.blocks[bIdx].nodes[nKey].choices[cIdx];
  if (!choice.changes) choice.changes = {};
  choice.changes[meterId] = parseInt(val, 10) || 0;
  updatePreview();
};
window.addMultiMeterChoice = function(bIdx, nKey) {
  const page = courseState.pages[activePageIdx];
  const block = page.blocks[bIdx];
  const node = block.nodes[nKey];
  if (!node.choices) node.choices = [];
  node.choices.push({
    text: 'New choice option...',
    nextNode: '',
    changes: {},
    feedback: 'Resulting feedback or consequence...'
  });
  renderActivePageEditor();
  updatePreview();
};

// Exploded blueprint diagram updaters
let selectedBlueprintPinBlockIdx = null;
let selectedBlueprintPinIdx = null;

window.updateBlueprintField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};
window.updateBlueprintHotspotField = function(bIdx, hIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  const hotspot = page.blocks[bIdx].hotspots[hIdx];
  if (field === 'x' || field === 'y') {
    hotspot[field] = parseFloat(val) || 0;
  } else {
    hotspot[field] = val;
  }
  updatePreview();
};
window.addBlueprintHotspot = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  const block = page.blocks[bIdx];
  if (!block.hotspots) block.hotspots = [];
  const id = 'bp_' + Date.now().toString(36);
  block.hotspots.push({ id, name: `Hotspot Location ${block.hotspots.length + 1}`, x: 50, y: 50, description: 'Enter detailed hotspot information here.' });
  selectedBlueprintPinBlockIdx = bIdx;
  selectedBlueprintPinIdx = block.hotspots.length - 1;
  renderActivePageEditor();
  updatePreview();
};
window.deleteBlueprintHotspot = function(bIdx, hIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].hotspots.splice(hIdx, 1);
  if (selectedBlueprintPinBlockIdx === bIdx && selectedBlueprintPinIdx === hIdx) {
    selectedBlueprintPinBlockIdx = null;
    selectedBlueprintPinIdx = null;
  }
  renderActivePageEditor();
  updatePreview();
};
window.selectBlueprintPin = function(bIdx, hIdx, event) {
  event.stopPropagation();
  selectedBlueprintPinBlockIdx = bIdx;
  selectedBlueprintPinIdx = hIdx;
  renderActivePageEditor();
};
window.handleBlueprintMapClick = function(bIdx, event) {
  const img = event.target;
  const rect = img.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  const page = courseState.pages[activePageIdx];
  const block = page.blocks[bIdx];
  if (selectedBlueprintPinBlockIdx === bIdx && selectedBlueprintPinIdx !== null && block.hotspots[selectedBlueprintPinIdx]) {
    block.hotspots[selectedBlueprintPinIdx].x = parseFloat(x.toFixed(2));
    block.hotspots[selectedBlueprintPinIdx].y = parseFloat(y.toFixed(2));
  } else {
    if (!block.hotspots) block.hotspots = [];
    const id = 'bp_' + Date.now().toString(36);
    block.hotspots.push({
      id,
      name: `Hotspot Location ${block.hotspots.length + 1}`,
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
      description: 'Enter detailed hotspot information here.'
    });
    selectedBlueprintPinBlockIdx = bIdx;
    selectedBlueprintPinIdx = block.hotspots.length - 1;
  }
  renderActivePageEditor();
  updatePreview();
};
window.uploadBlueprintImage = function(bIdx, fileInput) {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const page = courseState.pages[activePageIdx];
    page.blocks[bIdx].imageUrl = e.target.result;
    renderActivePageEditor();
    updatePreview();
  };
  reader.readAsDataURL(file);
};

// Variable graph simulator updaters
window.updateGraphField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};
window.updateGraphSliderField = function(bIdx, sIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  const slider = page.blocks[bIdx].sliders[sIdx];
  if (field === 'label') {
    slider.label = val;
  } else {
    slider[field] = parseFloat(val) || 0;
  }
  updatePreview();
};
window.addGraphSlider = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  const block = page.blocks[bIdx];
  if (!block.sliders) block.sliders = [];
  block.sliders.push({ label: `Variable Slider ${block.sliders.length + 1}`, value: 50, min: 0, max: 100, weight: 1.0 });
  renderActivePageEditor();
  updatePreview();
};
window.deleteGraphSlider = function(bIdx, sIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].sliders.splice(sIdx, 1);
  renderActivePageEditor();
  updatePreview();
};

// Memory Match updaters
window.updateMemoryField = function(bIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx][field] = val;
  updatePreview();
};
window.updateMemoryPairField = function(bIdx, pIdx, field, val) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].pairs[pIdx][field] = val;
  updatePreview();
};
window.addMemoryPair = function(bIdx) {
  const page = courseState.pages[activePageIdx];
  const block = page.blocks[bIdx];
  if (!block.pairs) block.pairs = [];
  block.pairs.push({ term: 'New Term', definition: 'Corresponding match description...' });
  renderActivePageEditor();
  updatePreview();
};
window.deleteMemoryPair = function(bIdx, pIdx) {
  const page = courseState.pages[activePageIdx];
  page.blocks[bIdx].pairs.splice(pIdx, 1);
  renderActivePageEditor();
  updatePreview();
};

function launchPreviewPopup() {
  const playerCode = getPlayerHtml(courseState);
  const playerStyle = getPlayerCss(courseState);
  const scormApiWrapper = getScormApiJs();
  
  const customHtml = playerCode
    .replace('<link rel="stylesheet" href="player.css">', `<style>${playerStyle}</style>`)
    .replace('<script src="scorm_api.js"></script>', `<script>${scormApiWrapper}</script>`);
    
  const popup = window.open('', 'SCORM_Preview_Popup', 'width=1024,height=768,resizable=yes,scrollbars=yes');
  if (popup) {
    popup.document.open();
    popup.document.write(customHtml);
    popup.document.close();
  } else {
    alert("Popup blocked! Please allow popups for this site to preview the course in a separate window.");
  }
}

function togglePreviewFullscreen() {
  const previewPanel = document.querySelector('.preview-panel');
  if (!previewPanel) return;
  
  previewPanel.classList.toggle('fixed');
  previewPanel.classList.toggle('inset-0');
  previewPanel.classList.toggle('z-[1000]');
  previewPanel.classList.toggle('w-full');
  previewPanel.classList.toggle('h-full');
  
  const btn = document.getElementById('btn-preview-fullscreen');
  if (previewPanel.classList.contains('fixed')) {
    btn.innerHTML = `<i class="fa-solid fa-compress"></i>`;
    btn.title = "Restore Preview Size";
  } else {
    btn.innerHTML = `<i class="fa-solid fa-expand"></i>`;
    btn.title = "Toggle Full Page Preview";
  }
}

// Compile and update Preview Frame
function updatePreview() {
  const iframe = document.getElementById('preview-frame');
  if (!iframe) return;
  
  // Reset Mock LMS data
  mockLmsData = {};
  
  // Injected JS helper to mock the SCORM object inside parent frame
  // Note: playerHtml already contains SCORM search loop looking at window.parent.
  
  const playerCode = getPlayerHtml(courseState);
  const playerStyle = getPlayerCss(courseState);
  const scormApiWrapper = getScormApiJs();
  
  // Generate unified frame content by serving iframe files via blob urls or simulation
  // To avoid cross-origin issues with iframe, we construct a unified single page structure
  // or use srcdoc, since srcdoc runs in the same origin.
  // We can write the dependencies as inline scripts/styles inside srcdoc.
  
  const customSrcDoc = playerCode
    .replace('<link rel="stylesheet" href="player.css">', `<style>${playerStyle}</style>`)
    .replace('<script src="scorm_api.js"></script>', `<script>${scormApiWrapper}</script>`);
    
  iframe.srcdoc = customSrcDoc;
}

// SCORM ZIP exporter using JSZip
async function exportCourse(exportVersion) {
  if (!window.JSZip) {
    alert("JSZip library is still loading. Please try again in a few seconds.");
    return;
  }
  
  const originalVersionSetting = courseState.scormVersion;
  courseState.scormVersion = exportVersion; // update state version temporarily for generation
  
  const zip = new window.JSZip();
  
  // Files to package
  const playerHtml = getPlayerHtml(courseState);
  const playerCss = getPlayerCss(courseState);
  const scormApi = getScormApiJs();
  
  let manifestXml = '';
  const packageFiles = ['index.html', 'player.css', 'scorm_api.js'];
  
  if (exportVersion === '1.2') {
    manifestXml = getManifest12(courseState, packageFiles);
  } else {
    manifestXml = getManifest2004(courseState, packageFiles);
  }
  
  zip.file('imsmanifest.xml', manifestXml);
  zip.file('index.html', playerHtml);
  zip.file('player.css', playerCss);
  zip.file('scorm_api.js', scormApi);
  
  try {
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    
    const safeTitle = courseState.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    link.download = `${safeTitle}_scorm_${exportVersion === '1.2' ? '12' : '2004'}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Restore setting
    courseState.scormVersion = originalVersionSetting;
  } catch (err) {
    console.error("Failed to generate zip file: ", err);
    alert("Failed to export SCORM package. Check browser console logs.");
  }
}

// Initialize layout visibility states from URL query parameters (default to true)
const urlParams = new URLSearchParams(window.location.search);
let isLeftVisible = urlParams.get('left') !== 'false';
let isRightVisible = urlParams.get('right') !== 'false';
let leftWidth = 320;
let rightWidth = 450;

function updateUrlParams() {
  const url = new URL(window.location.href);
  url.searchParams.set('left', isLeftVisible.toString());
  url.searchParams.set('right', isRightVisible.toString());
  window.history.replaceState({}, '', url.toString());
}

function syncToggleButtonStyles() {
  const btnLeft = document.getElementById('btn-toggle-left');
  if (btnLeft) {
    if (isLeftVisible) {
      btnLeft.className = "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200/50 hover:bg-indigo-100/60";
    } else {
      btnLeft.className = "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50";
    }
  }

  const btnRight = document.getElementById('btn-toggle-right');
  if (btnRight) {
    if (isRightVisible) {
      btnRight.className = "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200/50 hover:bg-indigo-100/60";
    } else {
      btnRight.className = "px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50";
    }
  }
}

function updateLayoutGrid() {
  const container = document.querySelector('.app-container');
  const leftPanel = document.querySelector('.left-panel');
  const resizerLeft = document.getElementById('resizer-left');
  const rightPanel = document.querySelector('.preview-panel');
  const resizerRight = document.getElementById('resizer-right');

  if (leftPanel) leftPanel.style.display = isLeftVisible ? 'flex' : 'none';
  if (resizerLeft) resizerLeft.style.display = isLeftVisible ? 'block' : 'none';
  if (rightPanel) rightPanel.style.display = isRightVisible ? 'flex' : 'none';
  if (resizerRight) resizerRight.style.display = isRightVisible ? 'block' : 'none';

  const leftCol = isLeftVisible ? `${leftWidth}px` : '0px';
  const leftRes = isLeftVisible ? '6px' : '0px';
  const rightCol = isRightVisible ? `${rightWidth}px` : '0px';
  const rightRes = isRightVisible ? '6px' : '0px';

  if (container) {
    container.style.gridTemplateColumns = `${leftCol} ${leftRes} 1fr ${rightRes} ${rightCol}`;
  }
}

function toggleLeftSidebar() {
  isLeftVisible = !isLeftVisible;
  updateLayoutGrid();
  syncToggleButtonStyles();
  updateUrlParams();
}

function toggleRightSidebar() {
  isRightVisible = !isRightVisible;
  updateLayoutGrid();
  syncToggleButtonStyles();
  updateUrlParams();
}

window.updateLayoutGrid = updateLayoutGrid;
window.toggleLeftSidebar = toggleLeftSidebar;
window.toggleRightSidebar = toggleRightSidebar;
window.syncToggleButtonStyles = syncToggleButtonStyles;

function initResizers() {
  const container = document.querySelector('.app-container');
  const resizerLeft = document.getElementById('resizer-left');
  const resizerRight = document.getElementById('resizer-right');
  const iframe = document.getElementById('preview-frame');

  resizerLeft.addEventListener('mousedown', (e) => {
    e.preventDefault();
    resizerLeft.classList.add('dragging');
    if (iframe) iframe.style.pointerEvents = 'none';

    function onMouseMove(e) {
      leftWidth = Math.max(200, Math.min(500, e.clientX));
      updateLayoutGrid();
    }

    function onMouseUp() {
      resizerLeft.classList.remove('dragging');
      if (iframe) iframe.style.pointerEvents = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  resizerRight.addEventListener('mousedown', (e) => {
    e.preventDefault();
    resizerRight.classList.add('dragging');
    if (iframe) iframe.style.pointerEvents = 'none';

    function onMouseMove(e) {
      rightWidth = Math.max(300, Math.min(800, window.innerWidth - e.clientX));
      updateLayoutGrid();
    }

    function onMouseUp() {
      resizerRight.classList.remove('dragging');
      if (iframe) iframe.style.pointerEvents = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  const resizerConsole = document.getElementById('resizer-console');
  const consolePanel = document.querySelector('.console-panel');
  let consoleHeight = 256; // 64rem equivalent/default height in px

  resizerConsole.addEventListener('mousedown', (e) => {
    e.preventDefault();
    resizerConsole.classList.add('dragging');
    if (iframe) iframe.style.pointerEvents = 'none';

    function onMouseMove(e) {
      consoleHeight = Math.max(100, Math.min(600, window.innerHeight - e.clientY));
      consolePanel.style.height = `${consoleHeight}px`;
    }

    function onMouseUp() {
      resizerConsole.classList.remove('dragging');
      if (iframe) iframe.style.pointerEvents = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });
}

// Helper to escape HTML characters
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const CONTENT_BLOCK_TYPES = [
  // Core & Layout
  { id: 'text', name: 'Rich Text Paragraph', category: 'core', icon: 'fa-font text-sky-500', desc: 'Add paragraphs, custom headers, bullets, or formatted informational notes.' },
  { id: 'accordion', name: 'Accordion Dropdown', category: 'core', icon: 'fa-chevron-down text-sky-500', desc: 'Compact headers that expand to reveal descriptive details on click.' },
  { id: 'tabs', name: 'Tabbed Layout Container', category: 'core', icon: 'fa-folder text-sky-500', desc: 'Organize related information into click-switched tab sheets.' },
  { id: 'card', name: 'Interactive Flip Card', category: 'core', icon: 'fa-rotate text-sky-500', desc: 'A double-sided card. Tap to flip over and see definitions or answers.' },

  // Visual Explorers
  { id: 'hotspots', name: 'Text Hotspot Highlighters', category: 'visual', icon: 'fa-bullseye text-emerald-500', desc: 'Highlight key phrases in text with interactive rich hover tooltips.' },
  { id: 'visualHotspot', name: 'Visual Image Spotter Game', category: 'visual', icon: 'fa-eye text-emerald-500', desc: 'Assessment Game: Learners must find and click hidden mistakes or hazards directly on a background image to score.' },
  { id: 'workspaceClean', name: 'Clean Desk Inspector', category: 'visual', icon: 'fa-broom text-emerald-500', desc: 'Office desk cleanup challenge. Click pins and select correct actions.' },
  { id: 'explodedBlueprint', name: 'Blueprint Inspector Tool', category: 'interactive', icon: 'fa-compass text-fuchsia-500', desc: 'Exploration Tool: Upload schematics. Learners click visible pulsing pins to read parts details and information (No score/testing).' },
  { id: 'timelineSlider', name: 'Interactive Timeline Slider', category: 'interactive', icon: 'fa-timeline text-fuchsia-500', desc: 'Provide step-by-step milestones or SOP flows via a draggable slider track.' },
  { id: 'variableGraph', name: 'Interactive Graph Curve Simulator', category: 'interactive', icon: 'fa-chart-line text-fuchsia-500', desc: 'Math, physics, or finance simulator. Adjust variable sliders to shift curves.' },

  // Simulations & Scenarios
  { id: 'chat', name: 'Chat Conversation Sim', category: 'sim', icon: 'fa-comments text-amber-500', desc: 'Simulate a modern WhatsApp message interface with interactive response options.' },
  { id: 'emailPhishing', name: 'Email Client Simulator', category: 'sim', icon: 'fa-envelope-open-text text-amber-500', desc: 'Interactive desktop email simulation with SPF/DKIM flags and hover URLs.' },
  { id: 'dialogueBranching', name: 'Single-Meter Dialogue Tree', category: 'sim', icon: 'fa-diagram-project text-amber-500', desc: 'Branching chat scenarios with threat meter risk variables.' },
  { id: 'multiMeterScenario', name: 'Multi-Meter Decision Scenario', category: 'interactive', icon: 'fa-scale-balanced text-fuchsia-500', desc: 'Simulate support/leadership paths showing Satisfaction, Budget, and Morale meters.' },

  // Assessments & Games
  { id: 'quiz', name: 'Multiple Choice Quiz', category: 'game', icon: 'fa-circle-question text-violet-500', desc: 'Standard multiple choice quiz reporting score outcomes directly to the LMS.' },
  { id: 'passwordMeter', name: 'Password Strength Tester', category: 'game', icon: 'fa-key text-violet-500', desc: 'Evaluate passwords in real-time with visual strength bars and complexity metrics.' },
  { id: 'swipeDeck', name: 'Sorting Swipe Card Game', category: 'game', icon: 'fa-clone text-violet-500', desc: 'Tinder-style sorting. Swipe left/right to judge situational safety.' },
  { id: 'memoryMatch', name: 'Memory Card Match Game', category: 'interactive', icon: 'fa-circle-nodes text-fuchsia-500', desc: 'Flippable grid of cards. Match terms with definitions or images.' },
  { id: 'dragDropSort', name: 'Drag-and-Drop Categorizer', category: 'interactive', icon: 'fa-hand-pointer text-fuchsia-500', desc: 'Drag cards into priority buckets, categorization boxes, or pros/cons stacks.' }
];

function renderActionDock() {
  const dock = document.getElementById('editor-actions-dock');
  if (!dock) return;
  dock.innerHTML = '';
  
  CONTENT_BLOCK_TYPES.forEach(b => {
    const btn = document.createElement('button');
    btn.className = "flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 rounded text-xs font-semibold shadow-sm cursor-pointer transition-all shrink-0 hover:-translate-y-0.5";
    btn.innerHTML = `<i class="fa-solid ${b.icon}"></i> ${b.name}`;
    btn.onclick = () => addBlock(b.id);
    dock.appendChild(btn);
  });
}

// Initialize on load
window.onload = initApp;
export { initApp };

window.addWorkspaceCleanPinOption = function(bIdx, pIdx) {
  const page = courseData.pages[state.activePageIdx];
  const block = page.blocks[bIdx];
  const pin = block.pins[pIdx];
  if (!pin.options) pin.options = [];
  pin.options.push({ id: 'new_opt', label: 'New Action Option' });
  renderActivePageEditor();
};

window.removeWorkspaceCleanPinOption = function(bIdx, pIdx, oIdx) {
  const page = courseData.pages[state.activePageIdx];
  const block = page.blocks[bIdx];
  const pin = block.pins[pIdx];
  pin.options.splice(oIdx, 1);
  renderActivePageEditor();
};
