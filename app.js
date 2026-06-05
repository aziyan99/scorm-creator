import { getManifest12, getManifest2004, getPlayerHtml, getPlayerCss, getScormApiJs } from './scorm-templates.js';

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
  document.getElementById('btn-add-text').addEventListener('click', () => addBlock('text'));
  document.getElementById('btn-add-card').addEventListener('click', () => addBlock('card'));
  document.getElementById('btn-add-accordion').addEventListener('click', () => addBlock('accordion'));
  document.getElementById('btn-add-tabs').addEventListener('click', () => addBlock('tabs'));
  document.getElementById('btn-add-hotspots').addEventListener('click', () => addBlock('hotspots'));
  document.getElementById('btn-add-quiz').addEventListener('click', () => addBlock('quiz'));
  document.getElementById('btn-export-12').addEventListener('click', () => exportCourse('1.2'));
  document.getElementById('btn-export-2004').addEventListener('click', () => exportCourse('2004'));
  document.getElementById('btn-load-demo').addEventListener('click', loadDemoData);

  document.getElementById('btn-preview-popup').addEventListener('click', launchPreviewPopup);
  document.getElementById('btn-preview-fullscreen').addEventListener('click', togglePreviewFullscreen);

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
        title: '1. Spotting Phishing Signatures',
        blocks: [
          {
            type: 'text',
            content: '<h3>How to Inspect Emails</h3><p>Phishers craft emails to look exactly like those from official brands. Hover over the dotted triggers below to see details of typical phishing signatures:</p>'
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
        title: '2. Clues & Definitions',
        blocks: [
          {
            type: 'card',
            front: 'What is the main goal of a Spear Phishing attack?',
            back: 'To target specific individuals or organizations using custom personal info to harvest credentials.'
          },
          {
            type: 'accordion',
            title: 'Common Cyber Attack Vectors',
            content: '<p><strong>Smishing:</strong> Phishing carried out through SMS text messages.<br><strong>Vishing:</strong> Phishing scams using voice phone calls.<br><strong>Phishing:</strong> Bulk generic emails attempting to trap users.</p>'
          }
        ]
      },
      {
        title: '3. Inspection Checklist',
        blocks: [
          {
            type: 'tabs',
            tabs: [
              { label: 'Check Sender Address', content: '<p>Compare the display name with the actual email address in the "From" header. If the display name says "Bank CEO" but the email is CEO@gmail.com, it is spam.</p>' },
              { label: 'Inspect Hyperlinks', content: '<p>Always hover over links to verify their destination addresses. Never trust text anchors like "www.paypal.com" if the destination points somewhere else.</p>' }
            ]
          }
        ]
      },
      {
        title: '4. Knowledge Challenge',
        blocks: [
          {
            type: 'quiz',
            question: 'You receive an urgent request from "IT Support" asking you to change your password via a link in the email. What should you do?',
            options: [
              'Click the link immediately to secure your account.',
              'Ignore it because IT never runs credential checks.',
              'Verify by contacting IT directly through their official directory or phone number.',
              'Reply to the email asking if it is a real request.'
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
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"/></svg>`;
    btn.title = "Restore Preview Size";
  } else {
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
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

function initResizers() {
  const container = document.querySelector('.app-container');
  const resizerLeft = document.getElementById('resizer-left');
  const resizerRight = document.getElementById('resizer-right');
  const iframe = document.getElementById('preview-frame');

  let leftWidth = 320;
  let rightWidth = 450;

  resizerLeft.addEventListener('mousedown', (e) => {
    e.preventDefault();
    resizerLeft.classList.add('dragging');
    if (iframe) iframe.style.pointerEvents = 'none';

    function onMouseMove(e) {
      leftWidth = Math.max(200, Math.min(500, e.clientX));
      container.style.gridTemplateColumns = `${leftWidth}px 6px 1fr 6px ${rightWidth}px`;
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
      container.style.gridTemplateColumns = `${leftWidth}px 6px 1fr 6px ${rightWidth}px`;
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

// Initialize on load
window.onload = initApp;
export { initApp };
