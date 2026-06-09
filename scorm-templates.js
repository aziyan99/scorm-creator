/**
 * SCORM XML Manifest and Course Player Templates
 */

const DEFAULT_VISUAL_HOTSPOT_IMAGE = `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
  <rect x="50" y="320" width="700" height="100" fill="%23a0522d" rx="10" />
  <rect x="70" y="420" width="40" height="30" fill="%238b4513" />
  <rect x="690" y="420" width="40" height="30" fill="%238b4513" />

  <rect x="375" y="240" width="50" height="80" fill="%23475569" />
  <ellipse cx="400" cy="320" rx="60" ry="10" fill="%23334155" />

  <rect x="250" y="80" width="300" height="180" rx="8" fill="%231e293b" />
  
  <rect x="260" y="90" width="280" height="150" fill="%2338bdf8" rx="4" />
  <text x="300" y="130" font-family="sans-serif" font-size="12" fill="%230f172a" font-weight="bold">DATABASE PELANGGAN</text>
  <text x="300" y="150" font-family="sans-serif" font-size="10" fill="%23334155">Nama: Ahmad | ID: 320102...</text>
  <text x="300" y="170" font-family="sans-serif" font-size="10" fill="%23334155">Nama: Siti  | ID: 320103...</text>
  <text x="300" y="210" font-family="sans-serif" font-size="11" fill="%23ef4444" font-weight="bold">\\u{1F513} SISTEM TERBUKA (BELUM DIKUNCI)</text>

  <rect x="300" y="330" width="200" height="15" rx="3" fill="%2364748b" />

  <rect x="500" y="220" width="45" height="40" fill="%23fef08a" transform="rotate(-5, 500, 220)" />
  <text x="502" y="238" font-family="sans-serif" font-size="8" fill="%231e293b" font-weight="bold" transform="rotate(-5, 500, 220)">PASS: admin</text>
  <text x="502" y="248" font-family="sans-serif" font-size="8" fill="%231e293b" font-weight="bold" transform="rotate(-5, 500, 220)">123456</text>

  <rect x="120" y="330" width="100" height="80" fill="%23ffffff" rx="4" transform="rotate(10, 120, 330)" stroke="%23cbd5e1" stroke-width="1" />
  <text x="130" y="355" font-family="sans-serif" font-size="8" fill="%23475569" font-weight="bold" transform="rotate(10, 120, 330)">DOKUMEN RAHASIA</text>
  <line x1="130" y1="365" x2="200" y2="365" stroke="%2394a3b8" stroke-width="2" transform="rotate(10, 120, 330)" />
  <line x1="130" y1="375" x2="180" y2="375" stroke="%2394a3b8" stroke-width="2" transform="rotate(10, 120, 330)" />
  <line x1="130" y1="385" x2="190" y2="385" stroke="%2394a3b8" stroke-width="2" transform="rotate(10, 120, 330)" />

  <rect x="560" y="340" width="30" height="12" rx="2" fill="%23ef4444" transform="rotate(-15, 560, 340)" />
  <rect x="590" y="343" width="10" height="6" fill="%23cbd5e1" transform="rotate(-15, 560, 340)" />
  <line x1="565" y1="346" x2="575" y2="346" stroke="%23ffffff" stroke-width="2" transform="rotate(-15, 560, 340)" />
</svg>
`);


// SCORM 1.2 imsmanifest.xml template
export function getManifest12(config, files) {
  const fileRefs = files.map(f => `<file href="${f}"/>`).join('\n      ');
  const orgItems = config.pages.map((page, idx) => `
      <item identifier="ITEM_${idx + 1}" identifierref="RESOURCE_MAIN">
        <title>${escapeXml(page.title)}</title>
      </item>`).join('');

  return `<?xml version="1.0" encoding="utf-8" standalone="no"?>
<manifest identifier="${escapeXml(config.id)}" version="1.0"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ORG_1">
    <organization identifier="ORG_1">
      <title>${escapeXml(config.title)}</title>
      ${orgItems}
    </organization>
  </organizations>
  <resources>
    <resource identifier="RESOURCE_MAIN" type="webcontent" adlcp:scormtype="sco" href="index.html">
      ${fileRefs}
    </resource>
  </resources>
</manifest>`;
}

// SCORM 2004 imsmanifest.xml template
export function getManifest2004(config, files) {
  const fileRefs = files.map(f => `<file href="${f}"/>`).join('\n      ');
  const orgItems = config.pages.map((page, idx) => `
      <item identifier="ITEM_${idx + 1}" identifierref="RESOURCE_MAIN">
        <title>${escapeXml(page.title)}</title>
      </item>`).join('');

  return `<?xml version="1.0" encoding="utf-8" standalone="no"?>
<manifest identifier="${escapeXml(config.id)}" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.3</schemaversion>
  </metadata>
  <organizations default="ORG_1">
    <organization identifier="ORG_1">
      <title>${escapeXml(config.title)}</title>
      ${orgItems}
    </organization>
  </organizations>
  <resources>
    <resource identifier="RESOURCE_MAIN" type="webcontent" adlcp:scormType="sco" href="index.html">
      ${fileRefs}
    </resource>
  </resources>
</manifest>`;
}

// Course Player HTML template
export function getPlayerHtml(config) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.title)}</title>
  <link rel="stylesheet" href="player.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <script src="scorm_api.js"></script>
</head>
<body>
  <div class="player-container">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>${escapeHtml(config.title)}</h1>
        <p class="description">${escapeHtml(config.description || '')}</p>
      </div>
      <nav class="toc">
        <ul id="toc-list"></ul>
      </nav>
      <div class="sidebar-footer">
        <div class="progress-container">
          <div class="progress-text">Course Progress: <span id="progress-val">0%</span></div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" id="progress-bar" style="width: 0%"></div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="content-viewport">
      <div class="content-scroll-wrapper">
        <div id="content-container"></div>
      </div>
      
      <!-- Bottom Navigation Controller -->
      <footer class="content-nav">
        <button id="btn-prev" class="nav-btn">← Previous</button>
        <span id="page-indicator">Page 1 of 1</span>
        <button id="btn-next" class="nav-btn nav-btn-primary">Next →</button>
      </footer>
    </main>
  </div>

  <script>
    // Embedded course data
    const courseData = ${JSON.stringify(config)};
    let currentPageIdx = 0;
    const visitedPages = new Set();
    const quizAnswers = {}; // pageIdx -> questionIdx -> selectedIdx
    const chatSelections = {}; // pageIdx -> blockIdx -> selectedChoiceIdx
    const visualHotspotsFound = {}; // pageIdx -> blockIdx -> array of found ids
    const phishingDecisions = {}; // pageIdx -> blockIdx -> decision
    const dialogueStates = {}; // pageIdx -> blockIdx -> nodeKey
    const dialogueRisks = {}; // pageIdx -> blockIdx -> suspicionScore
    const workspaceCleanCleared = {}; // pageIdx -> blockIdx -> array of found ids
    const swipeDeckIndexes = {}; // pageIdx -> blockIdx -> cardIndex
    const swipeDeckScores = {}; // pageIdx -> blockIdx -> score
    
    // States for the 6 new general components
    const timelineActiveSteps = {}; // pageIdx -> blockIdx -> stepIdx
    const dragDropAssignments = {}; // pageIdx -> blockIdx -> itemId -> categoryId
    const dragDropScores = {}; // pageIdx -> blockIdx -> score
    const multiMeterStates = {}; // pageIdx -> blockIdx -> nodeKey
    const multiMeterVals = {}; // pageIdx -> blockIdx -> { meterId -> value }
    const blueprintHotspotsClicked = {}; // pageIdx -> blockIdx -> array of hotspotId
    const graphSliderValues = {}; // pageIdx -> blockIdx -> { sliderIdx -> value }
    const memoryMatchFlipped = {}; // pageIdx -> blockIdx -> array of flipped indices
    const memoryMatchMatched = {}; // pageIdx -> blockIdx -> array of matched indices
    const memoryMatchAttempts = {}; // pageIdx -> blockIdx -> attempts count
    
    const scoreThreshold = ${config.passingScore || 80};
    
    // SCORM API Adapter Helper
    const scorm = new ScormAPIAdapter(courseData.scormVersion);

    function init() {
      scorm.initialize();
      // Restore state if LMS has suspends data (simple bookmarking)
      const bookmark = scorm.getValue("cmi.core.lesson_location") || scorm.getValue("cmi.location");
      if (bookmark !== null && bookmark !== undefined && bookmark !== "") {
        const pageIdx = parseInt(bookmark, 10);
        if (!isNaN(pageIdx) && pageIdx >= 0 && pageIdx < courseData.pages.length) {
          currentPageIdx = pageIdx;
        }
      }
      
      renderTOC();
      loadPage(currentPageIdx);
    }

    function renderTOC() {
      const list = document.getElementById('toc-list');
      list.innerHTML = '';
      courseData.pages.forEach((page, idx) => {
        const li = document.createElement('li');
        li.className = 'toc-item' + (idx === currentPageIdx ? ' active' : '') + (visitedPages.has(idx) ? ' completed' : '');
        li.innerHTML = \`
          <span class="toc-bullet"></span>
          <span class="toc-title">\${escapeHtml(page.title)}</span>
        \`;
        li.addEventListener('click', () => {
          loadPage(idx);
        });
        list.appendChild(li);
      });
    }

    function loadPage(idx) {
      if (idx < 0 || idx >= courseData.pages.length) return;
      currentPageIdx = idx;
      visitedPages.add(idx);
      
      // Update bookmark location in LMS
      if (courseData.scormVersion === '1.2') {
        scorm.setValue("cmi.core.lesson_location", String(idx));
      } else {
        scorm.setValue("cmi.location", String(idx));
      }
      
      // Render Content
      const page = courseData.pages[idx];
      const container = document.getElementById('content-container');
      container.className = 'page-content animate-fade-in';
      
      let html = \`<h2>\${escapeHtml(page.title)}</h2>\`;
      
      page.blocks.forEach((block, bIdx) => {
        if (block.type === 'text') {
          html += \`<div class="content-block text-block">\${block.content}</div>\`;
        } else if (block.type === 'card') {
          html += \`
            <div class="content-block flip-card" onclick="this.classList.toggle('flipped')">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <div class="card-prompt">Click to reveal details</div>
                  <div class="card-text">\${escapeHtml(block.front)}</div>
                </div>
                <div class="flip-card-back">
                  <div class="card-prompt">Flipped</div>
                  <div class="card-text">\${escapeHtml(block.back)}</div>
                </div>
              </div>
            </div>
          \`;
        } else if (block.type === 'accordion') {
          html += \`
            <div class="content-block accordion-item" onclick="this.classList.toggle('active')">
              <div class="accordion-header">
                <span>\${escapeHtml(block.title)}</span>
                <span class="accordion-icon">▼</span>
              </div>
              <div class="accordion-content">
                \${block.content}
              </div>
            </div>
          \`;
        } else if (block.type === 'tabs') {
          const tabHeaders = block.tabs.map((tab, tIdx) => \`
            <button class="tab-btn\${tIdx === 0 ? ' active' : ''}" onclick="switchTab(this, \${bIdx}, \${tIdx})">
              \${escapeHtml(tab.label)}
            </button>
          \`).join('');
          
          const tabContents = block.tabs.map((tab, tIdx) => \`
            <div class="tab-pane\${tIdx === 0 ? ' active' : ''}" id="tab-pane-\${bIdx}-\${tIdx}">
              \${tab.content}
            </div>
          \`).join('');

          html += \`
            <div class="content-block tabs-container" id="tabs-\${bIdx}">
              <div class="tabs-header">\${tabHeaders}</div>
              <div class="tabs-body">\${tabContents}</div>
            </div>
          \`;
        } else if (block.type === 'hotspots') {
          const layout = block.layout || 'generic';
          
          html += \`
            <div class="content-block hotspots-block-layout">
              \${(() => {
                const injectHotspots = (textVal) => {
                  if (!textVal) return '';
                  let out = escapeHtml(textVal);
                  out = out.replace(/\\n/g, '<br>');
                  (block.items || []).forEach(item => {
                    if (item.phrase && item.phrase.trim() !== '') {
                      const escapedPhrase = escapeHtml(item.phrase).replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
                      const regex = new RegExp(escapedPhrase, 'g');
                      out = out.replace(regex, \`<span class="hotspot-text">\${escapeHtml(item.phrase)}<span class="hotspot-tooltip">\${escapeHtml(item.tooltip)}</span></span>\`);
                    }
                  });
                  return out;
                };

                if (layout === 'email') {
                  const fromName = block.emailFromName || 'Sender';
                  const fromEmail = block.emailFromEmail || 'sender@domain.com';
                  const subject = block.emailSubject || 'No Subject';
                  const dateStr = block.emailDate || 'Just now';
                  
                  return \`
                    <div class="hotspot-email-client">
                      <!-- Mock Email Top Toolbar -->
                      <div class="email-toolbar">
                        <div class="toolbar-left">
                          <span class="toolbar-btn">← Back</span>
                          <span class="toolbar-btn">Archive</span>
                          <span class="toolbar-btn spam-btn">Report Spam</span>
                        </div>
                        <div class="toolbar-right">
                          <span class="email-badge">Inbox</span>
                        </div>
                      </div>
                      
                      <!-- Email Headers -->
                      <div class="email-header-section">
                        <h3 class="email-subject-line">\${injectHotspots(subject)}</h3>
                        <div class="email-sender-row">
                          <div class="sender-avatar">\${escapeHtml(fromName.charAt(0).toUpperCase())}</div>
                          <div class="sender-details">
                            <div class="sender-meta">
                              <strong class="sender-name">\${escapeHtml(fromName)}</strong>
                              <span class="sender-address">&lt;\${injectHotspots(fromEmail)}&gt;</span>
                            </div>
                            <div class="recipient-meta">To: <span class="recipient-addr">me@mycompany.com</span></div>
                          </div>
                          <div class="email-date-time">\${escapeHtml(dateStr)}</div>
                        </div>
                      </div>
                      
                      <!-- Email Body -->
                      <div class="email-body-content">
                        \${injectHotspots(block.text)}
                      </div>
                    </div>
                  \`;
                } else if (layout === 'document') {
                  const docTitle = block.docTitle || 'Document Title';
                  const docSubtitle = block.docSubtitle || 'Internal Policy';
                  return \`
                    <div class="hotspot-document-client">
                      <div class="document-header">
                        <div class="document-badge">\${escapeHtml(docSubtitle)}</div>
                        <h3 class="document-title">\${escapeHtml(docTitle)}</h3>
                      </div>
                      <div class="document-body-content">
                        \${injectHotspots(block.text)}
                      </div>
                    </div>
                  \`;
                } else {
                  return \`
                    <div class="hotspots-body-generic">\${injectHotspots(block.text)}</div>
                  \`;
                }
              })()}
            </div>
          \`;
        } else if (block.type === 'quiz') {
          const selected = quizAnswers[idx]?.[bIdx];
          const optionsHtml = block.options.map((opt, oIdx) => {
            let cls = 'quiz-option';
            if (selected !== undefined) {
              if (oIdx === block.correct) cls += ' correct';
              else if (selected === oIdx) cls += ' incorrect';
              cls += ' disabled';
            }
            return \`<div class="\${cls}" onclick="selectAnswer(\${idx}, \${bIdx}, \${oIdx})">
              <span class="option-bullet"></span>
              <span class="option-text">\${escapeHtml(opt)}</span>
            </div>\`;
          }).join('');
          
          html += \`
            <div class="content-block quiz-block" id="quiz-\${idx}-\${bIdx}">
              <div class="quiz-question">\${escapeHtml(block.question)}</div>
              <div class="quiz-options">\${optionsHtml}</div>
              <div class="quiz-feedback" style="display: \${selected !== undefined ? 'block' : 'none'}">
                \${selected === block.correct 
                  ? '<span class="feedback-correct">Correct! Well done.</span>' 
                  : '<span class="feedback-incorrect">Incorrect. Keep trying!</span>'}
              </div>
            </div>
          \`;
        } else if (block.type === 'chat') {
          const selectedChoiceIdx = chatSelections[idx]?.[bIdx];
          const messagesHtml = (block.messages || []).map(msg => {
            const isMe = msg.sender === 'me';
            const bubbleClass = isMe ? 'bubble-me' : 'bubble-them';
            
            if (msg.isAttachment) {
              const type = msg.attachmentType || 'apk';
              let iconClass = 'fa-solid fa-file-arrow-down text-red-500';
              let metaLabel = 'APK installer (14.2 MB)';
              
              if (type === 'png' || type === 'jpg' || type === 'jpeg') {
                iconClass = 'fa-solid fa-file-image text-emerald-500';
                metaLabel = 'Image File (2.4 MB)';
              } else if (type === 'pdf') {
                iconClass = 'fa-solid fa-file-pdf text-rose-500';
                metaLabel = 'PDF Document (1.8 MB)';
              } else if (type === 'xlsx') {
                iconClass = 'fa-solid fa-file-excel text-green-600';
                metaLabel = 'Excel Spreadsheet (420 KB)';
              } else if (type === 'docx') {
                iconClass = 'fa-solid fa-file-word text-blue-500';
                metaLabel = 'Word Document (1.1 MB)';
              } else if (type === 'pptx') {
                iconClass = 'fa-solid fa-file-powerpoint text-orange-500';
                metaLabel = 'PowerPoint Presentation (4.5 MB)';
              } else if (type === 'link') {
                iconClass = 'fa-solid fa-link text-indigo-500';
                metaLabel = 'Web Link / URL';
              }

              return \`
                <div class="chat-bubble-row \${isMe ? 'row-me' : 'row-them'}">
                  <div class="chat-bubble \${bubbleClass} chat-attachment-bubble">
                    <div class="attachment-icon-pill">
                      <i class="\${iconClass} text-2xl shrink-0"></i>
                      <div class="attachment-details">
                        <span class="attachment-name">\${escapeHtml(msg.text)}</span>
                        <span class="attachment-size">\${metaLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              \`;
            }
            
            return \`
              <div class="chat-bubble-row \${isMe ? 'row-me' : 'row-them'}">
                <div class="chat-bubble \${bubbleClass}">
                  \${escapeHtml(msg.text)}
                </div>
              </div>
            \`;
          }).join('');

          const choicesHtml = (block.choices || []).map((ch, cIdx) => {
            let btnClass = 'chat-choice-btn';
            if (selectedChoiceIdx !== undefined) {
              if (selectedChoiceIdx === cIdx) {
                btnClass += ch.isCorrect ? ' choice-success' : ' choice-danger';
              }
              btnClass += ' disabled';
            }
            return \`
              <button class="\${btnClass}" onclick="selectChatChoice(\${idx}, \${bIdx}, \${cIdx})">
                \${escapeHtml(ch.text)}
              </button>
            \`;
          }).join('');

          const selectedChoice = block.choices[selectedChoiceIdx];
          
          html += \`
            <div class="content-block chat-sim-block" id="chat-\${idx}-\${bIdx}">
              <div class="smartphone-container">
                <div class="phone-screen">
                  <!-- Status Bar -->
                  <div class="phone-status-bar">
                    <span>09:41</span>
                    <div class="status-icons">📶 🛜 🔋</div>
                  </div>
                  <!-- Chat Header -->
                  <div class="chat-app-header">
                    <div class="chat-back-arrow">←</div>
                    <div class="chat-avatar">\${escapeHtml((block.senderName || 'W').charAt(0))}</div>
                    <div class="chat-sender-info">
                      <div class="chat-sender-name">\${escapeHtml(block.senderName)}</div>
                      <div class="chat-sender-status">online</div>
                    </div>
                    <div class="chat-header-actions">⋮</div>
                  </div>
                  <!-- Chat Messages Area -->
                  <div class="chat-messages-viewport">
                    \${messagesHtml}
                  </div>
                </div>
              </div>
              <div class="chat-interaction-panel">
                <div class="chat-panel-title">\${escapeHtml(block.actionLabel || 'Choose Your Action:')}</div>
                <div class="chat-choices-layout">\${choicesHtml}</div>
                <div class="chat-choices-feedback" style="display: \${selectedChoiceIdx !== undefined ? 'block' : 'none'}">
                  \${selectedChoiceIdx !== undefined ? \`
                    <div class="feedback-card \${selectedChoice.isCorrect ? 'card-success' : 'card-danger'}">
                      <strong>\${selectedChoice.isCorrect ? escapeHtml(block.safeLabel || 'Safe') : escapeHtml(block.vulnerableLabel || 'Vulnerable')}</strong>
                      <p>\${escapeHtml(selectedChoice.feedback)}</p>
                    </div>
                  \` : ''}
                </div>
              </div>
            </div>
          \`;
        } else if (block.type === 'passwordMeter') {
          html += \`
            <div class="content-block pwd-meter-block" id="pwd-\${idx}-\${bIdx}">
              <h3>\${escapeHtml(block.title)}</h3>
              <p class="pwd-description">\${escapeHtml(block.description)}</p>
              
              <div class="pwd-simulator-panel">
                <div class="pwd-input-wrapper">
                  <input class="pwd-sim-input" type="text" placeholder="\${escapeHtml(block.labelInputPlaceholder || 'Type password...')}" oninput="evaluatePassword(this, \${bIdx})">
                  <span class="pwd-visibility-toggle" onclick="togglePasswordVisibility(this)">👁️</span>
                </div>
                
                <div class="pwd-strength-indicator">
                  <div class="strength-bar"><div class="strength-bar-fill" id="pwd-bar-0-\${bIdx}"></div></div>
                  <div class="strength-bar"><div class="strength-bar-fill" id="pwd-bar-1-\${bIdx}"></div></div>
                  <div class="strength-bar"><div class="strength-bar-fill" id="pwd-bar-2-\${bIdx}"></div></div>
                </div>
                
                <div class="pwd-strength-label">\${escapeHtml(block.labelStrength || 'Strength:')} <span id="pwd-label-\${bIdx}" class="strength-label-text">\${escapeHtml(block.labelEmpty || 'Empty')}</span></div>
                
                <div class="pwd-suggestions-box" id="pwd-suggest-\${bIdx}">
                  \${escapeHtml(block.labelPlaceholder || 'Type password above to begin strength evaluation.')}
                </div>
              </div>
            </div>
          \`;
        } else if (block.type === 'visualHotspot') {
          const foundSet = visualHotspotsFound[idx]?.[bIdx] || [];
          const imageUrl = block.imageUrl || \`${DEFAULT_VISUAL_HOTSPOT_IMAGE}\`;
          const totalHazards = (block.hazards || []).length;
          
          let pinsHtml = '';
          (block.hazards || []).forEach((haz, hIdx) => {
            const isFound = foundSet instanceof Set ? foundSet.has(haz.id) : Array.from(foundSet).includes(haz.id);
            pinsHtml += '<div id="' + haz.id + '-' + bIdx + '" class="hazard-pin-overlay ' + (isFound ? 'found' : '') + '" style="left: ' + haz.x + '%; top: ' + haz.y + '%;" onclick="findVisualHotspot(' + idx + ', ' + bIdx + ', &apos;' + haz.id + '&apos;)">' +
              '<div class="pin-marker-pulse"></div>' +
              '<div class="pin-marker-icon"><i class="fa-solid fa-circle-dot"></i></div>' +
              '<div class="pin-marker-number">' + (hIdx + 1) + '</div>' +
              '</div>';
          });
          
          html += \`
            <div class="content-block visual-hotspot-block" id="visual-\${idx}-\${bIdx}">
              <h3>\${escapeHtml(block.title)}</h3>
              <p class="visual-description">\${escapeHtml(block.description)}</p>
              
              <div class="visual-game-layout">
                <div class="visual-image-container-frame">
                  <div class="visual-image-wrapper">
                    <img src="\${imageUrl}" class="visual-bg-image" />
                    <!-- Absolute Interactive Pins -->
                    \${pinsHtml}
                  </div>
                </div>
                
                <!-- Game Info Panel -->
                <div class="visual-game-info">
                  <div class="visual-progress-meter">\${escapeHtml(block.progressLabel || 'Hazards Found:')} <span id="visual-progress-val-\${bIdx}">0</span>/\${totalHazards}</div>
                  
                  <div class="visual-hazards-explanation-box" id="visual-explain-\${bIdx}">
                    \${escapeHtml(block.placeholderLabel || 'Click on the areas in the image above that you suspect are insecure to start searching.')}
                  </div>
                  
                  <div class="visual-success-banner" id="visual-success-\${bIdx}" style="display: none">
                    \${escapeHtml((block.successLabel || '🎉 Excellent! You have successfully identified all {total} physical and digital security hazards in this image!').replace('{total}', totalHazards))}
                  </div>
                </div>
              </div>
            </div>
          \`;
        } else if (block.type === 'emailPhishing') {
          const actionSelected = phishingDecisions[idx]?.[bIdx];
          const hasDecided = actionSelected !== undefined;
          const isCorrect = hasDecided && actionSelected === block.correctAction;

          html += \`
            <div class="content-block email-phishing-block" id="phishing-\${idx}-\${bIdx}">
              <div class="email-client-container">
                <!-- Top action buttons bar -->
                <div class="email-action-bar">
                  <button class="email-btn email-btn-report \${hasDecided ? 'disabled' : ''}" onclick="submitPhishingDecision(\${idx}, \${bIdx}, 'phish')">
                    <i class="fa-solid fa-triangle-exclamation"></i> \${escapeHtml((block.labels && block.labels.reportBtn) || 'Report Phishing')}
                  </button>
                  <button class="email-btn email-btn-delete \${hasDecided ? 'disabled' : ''}" onclick="submitPhishingDecision(\${idx}, \${bIdx}, 'delete')">
                    <i class="fa-solid fa-trash-can"></i> \${escapeHtml((block.labels && block.labels.deleteBtn) || 'Delete')}
                  </button>
                  <button class="email-btn email-btn-safe \${hasDecided ? 'disabled' : ''}" onclick="submitPhishingDecision(\${idx}, \${bIdx}, 'safe')">
                    <i class="fa-solid fa-envelope-circle-check"></i> \${escapeHtml((block.labels && block.labels.safeBtn) || 'Mark Safe')}
                  </button>
                </div>

                <!-- Email header section -->
                <div class="email-header-pane">
                  <div class="email-subject-line">\${escapeHtml(block.subject)}</div>
                  <div class="email-meta-row">
                    <div class="email-sender-info">
                      <div class="email-sender-avatar"><i class="fa-solid fa-user-shield"></i></div>
                      <div class="email-sender-details">
                        <span class="sender-name">\${escapeHtml(block.senderName)}</span>
                        <span class="sender-email">&lt;\${escapeHtml(block.senderEmail)}&gt;</span>
                      </div>
                    </div>
                    <div class="email-date-info">\${escapeHtml(block.dateStr)}</div>
                  </div>

                  <!-- Details toggle / SPF DKIM -->
                  <div class="email-details-container">
                    <button class="details-toggle-btn" onclick="toggleEmailDetails(\${bIdx})">
                      <span id="details-arrow-\${bIdx}">▼</span> Details / Security Headers
                    </button>
                    <div class="details-collapse-panel" id="details-panel-\${bIdx}" style="display: none;">
                      <div class="details-grid">
                        <div><strong>Return-Path:</strong> \${escapeHtml(block.returnPath)}</div>
                        <div><strong>Received From:</strong> \${escapeHtml(block.receivedFrom)}</div>
                        <div><strong>SPF:</strong> <span class="badge-\${block.spfCheck.toLowerCase()}">\${block.spfCheck}</span></div>
                        <div><strong>DKIM:</strong> <span class="badge-\${block.dkimCheck.toLowerCase()}">\${block.dkimCheck}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Email body area -->
                <div class="email-body-pane">
                  \${block.emailBody}
                </div>
              </div>

              <!-- Feedback overlays -->
              <div class="phishing-feedback-box" id="phishing-feedback-\${bIdx}" style="display: \${hasDecided ? 'block' : 'none'}">
                <div class="feedback-indicator \${isCorrect ? 'correct' : 'incorrect'}">
                  \${isCorrect ? '<i class="fa-solid fa-circle-check"></i> Correct Choice' : '<i class="fa-solid fa-circle-xmark"></i> Warning'}
              </div>
              <div class="feedback-explanation">
                \${isCorrect ? escapeHtml(block.feedbackCorrect) : escapeHtml(block.feedbackIncorrect)}
              </div>
            </div>
          \`;
        } else if (block.type === 'dialogueBranching') {
          const currentNodeKey = dialogueStates[idx]?.[bIdx] || 'start';
          const node = block.nodes[currentNodeKey] || block.nodes['start'] || { attackerText: '', choices: [] };
          const riskScore = dialogueRisks[idx]?.[bIdx] || 0;
          const fbKey = idx + '_' + bIdx;
          const fbState = dialogueFeedbackState[fbKey];

          // Render choices
          let choicesHtml = '';
          if (fbState) {
            choicesHtml = \`
              <button class="dialogue-choice-btn" style="text-align: center; font-weight: bold; background-color: var(--accent-color); color: white;" onclick="advanceDialogueAfterFeedback(\${idx}, \${bIdx})">
                Continue
              </button>
            \`;
          } else if (node.choices && node.choices.length > 0 && !node.isEnd) {
            node.choices.forEach((ch, cIdx) => {
              choicesHtml += \`
                <button class="dialogue-choice-btn" onclick="clickDialogueChoice(\${idx}, \${bIdx}, '\${currentNodeKey}', \${cIdx})">
                  \${escapeHtml(ch.text)}
                </button>
              \`;
            });
          } else if (node.isEnd) {
            choicesHtml = \`
              <div class="dialogue-end-banner \${node.isWin ? 'win' : 'lose'}">
                \${node.isWin 
                  ? '🎉 <strong>Challenge Completed Successfully!</strong> You avoided the social engineering threat.' 
                  : '⚠️ <strong>Challenge Failed!</strong> The intruder successfully compromised the office safety.'}
                <button class="dialogue-reset-btn" onclick="resetDialogue(\${idx}, \${bIdx})">
                  <i class="fa-solid fa-rotate-left"></i> Restart Challenge
                </button>
              </div>
            \`;
          }

          // Avatar mapping
          let avatarIcon = 'fa-user-secret';
          if (node.avatar && node.avatar.startsWith('delivery')) {
            avatarIcon = 'fa-truck-ramp-box';
          } else if (node.avatar === 'attacker_success') {
            avatarIcon = 'fa-user-slash';
          }

          let chatStageHtml = \`
            <div class="dialogue-bubble-row row-them">
              <div class="dialogue-avatar"><i class="fa-solid \${avatarIcon}"></i></div>
              <div class="dialogue-bubble bubble-them">
                \${escapeHtml(node.attackerText)}
              </div>
            </div>
          \`;

          if (fbState) {
            chatStageHtml += \`
              <div class="dialogue-bubble-row row-me animate-fade-in" style="display: flex; gap: 12px; justify-content: flex-end; align-items: flex-start; margin-top: 12px;">
                <div class="dialogue-bubble bubble-me">
                  \${escapeHtml(fbState.choiceText)}
                </div>
                <div class="dialogue-avatar" style="background-color: var(--accent-color);"><i class="fa-solid fa-user"></i></div>
              </div>
              <div class="dialogue-feedback-row" style="display: block; margin-top: 12px;">
                \${escapeHtml(fbState.feedback)}
              </div>
            \`;
          }

          html += \`
            <div class="content-block dialogue-branching-block" id="dialogue-\${idx}-\${bIdx}">
              <h3>\${escapeHtml(block.title)}</h3>
              
              <div class="dialogue-game-container">
                <!-- Suspicion / Threat Meter -->
                <div class="dialogue-meter-header">
                  <span class="meter-label">Breach Risk Level:</span>
                  <div class="meter-track">
                    <div class="meter-fill" id="dialogue-fill-\${bIdx}" style="width: \${Math.min(100, Math.max(0, riskScore))}%"></div>
                  </div>
                  <span class="meter-value" id="dialogue-val-\${bIdx}">\${riskScore}%</span>
                </div>

                <!-- Chat stage -->
                <div class="dialogue-chat-stage">
                  \${chatStageHtml}
                </div>

                <!-- Choice picker -->
                <div class="dialogue-choices-pane" id="dialogue-choices-\${bIdx}">
                  \${choicesHtml}
                </div>
              </div>
            </div>
          \`;
        } else if (block.type === 'workspaceClean') {
          const cleanImageUrl = block.imageUrl || \`${DEFAULT_VISUAL_HOTSPOT_IMAGE}\`;
          const totalPins = (block.pins || []).length;
          const clearedPins = workspaceCleanCleared[idx]?.[bIdx] || [];
          const numCleared = clearedPins.length || 0;
          
          let pinsHtml = '';
          (block.pins || []).forEach((pin, pIdx) => {
            const isCleared = clearedPins.includes(pin.id);
            pinsHtml += '<div id="clean-pin-' + pin.id + '-' + bIdx + '" class="clean-pin-overlay ' + (isCleared ? 'cleared' : '') + '" style="left: ' + pin.x + '%; top: ' + pin.y + '%;" onclick="clickWorkspaceCleanPin(' + idx + ', ' + bIdx + ', &apos;' + pin.id + '&apos;)">' +
              '<div class="clean-pulse"></div>' +
              '<div class="clean-icon"><i class="fa-solid fa-circle-question"></i></div>' +
              '</div>';
          });

          html += \`
            <div class="content-block workspace-clean-block" id="clean-\${idx}-\${bIdx}">
              <h3>\${escapeHtml(block.title)}</h3>
              <p class="clean-description">\${escapeHtml(block.description)}</p>

              <div class="clean-game-layout">
                <div class="clean-image-container-frame">
                  <div class="clean-image-wrapper">
                    <img src="\${cleanImageUrl}" class="clean-bg-image" />
                    \${pinsHtml}
                  </div>
                </div>

                <!-- Right sidebar for actions and explanations -->
                <div class="clean-game-info">
                  <div class="clean-progress-meter">Secure / Cleaned Items: <span id="clean-progress-val-\${bIdx}">\${numCleared}</span>/\${totalPins}</div>
                  
                  <!-- Option Selector Modal Overlay -->
                  <div class="clean-action-overlay" id="clean-action-panel-\${bIdx}" style="display: none;">
                    <h4 id="clean-pin-title-\${bIdx}">Clean Sticky Note</h4>
                    <div class="clean-options-list" id="clean-options-container-\${bIdx}"></div>
                  </div>

                  <div class="clean-feedback-box" id="clean-feedback-\${bIdx}">
                    Click on any question mark pin inside the office space to inspect the threat and select the correct cleaning action.
                  </div>

                  <div class="clean-success-banner" id="clean-success-\${bIdx}" style="display: \${numCleared === totalPins ? 'block' : 'none'}">
                    🎉 <strong>Workspace Safe!</strong> You have successfully identified and secured all desk threats.
                  </div>
                </div>
              </div>
            </div>
          \`;
        } else if (block.type === 'swipeDeck') {
          const currentCardIdx = swipeDeckIndexes[idx]?.[bIdx] || 0;
          const score = swipeDeckScores[idx]?.[bIdx] || 0;
          const totalCards = (block.cards || []).length;
          
          let cardsHtml = '';
          (block.cards || []).forEach((card, cIdx) => {
            const isCurrent = cIdx === currentCardIdx;
            cardsHtml += \`
              <div class="swipe-card \${isCurrent ? 'active' : ''}" id="swipe-card-\${bIdx}-\${cIdx}" style="display: \${isCurrent ? 'flex' : 'none'}">
                <div class="swipe-card-content">
                  <i class="fa-solid fa-circle-nodes text-indigo-500 text-3xl mb-3"></i>
                  <p>\${escapeHtml(card.text)}</p>
                </div>
              </div>
            \`;
          });

          html += \`
            <div class="content-block swipe-deck-block" id="swipe-\${idx}-\${bIdx}">
              <h3>\${escapeHtml(block.title)}</h3>
              <p class="swipe-description">\${escapeHtml(block.description)}</p>

              <div class="swipe-game-container">
                <div class="swipe-deck-score">Score: <span id="swipe-score-\${bIdx}">\${score}</span>/\${totalCards}</div>

                <div class="swipe-cards-stack-wrapper">
                  \${cardsHtml}
                  
                  <div class="swipe-card-explanation-overlay" id="swipe-explain-overlay-\${bIdx}" style="display: none;">
                    <div class="explain-header" id="swipe-explain-header-\${bIdx}">Incorrect!</div>
                    <div class="explain-text" id="swipe-explain-text-\${bIdx}">Explanation here...</div>
                    <button class="swipe-next-btn" onclick="nextSwipeCard(\${idx}, \${bIdx})">Next Situation</button>
                  </div>

                  <div class="swipe-end-card" id="swipe-end-\${bIdx}" style="display: \${currentCardIdx >= totalCards ? 'flex' : 'none'}">
                    <i class="fa-solid fa-trophy text-amber-500 text-4xl mb-3"></i>
                    <h4>Game Finished!</h4>
                    <p>You scored \${score} out of \${totalCards}.</p>
                    <button class="swipe-reset-btn" onclick="resetSwipeDeck(\${idx}, \${bIdx})">
                      <i class="fa-solid fa-rotate-left"></i> Play Again
                    </button>
                  </div>
                </div>

                \${currentCardIdx < totalCards ? \`
                  <div class="swipe-actions-bar" id="swipe-buttons-\${bIdx}">
                    <button class="swipe-action-btn btn-swipe-left" onclick="swipeCardDecision(\${idx}, \${bIdx}, false)">
                      <i class="fa-solid fa-shield-halved"></i> Safe (Swipe Left)
                    </button>
                    <button class="swipe-action-btn btn-swipe-right" onclick="swipeCardDecision(\${idx}, \${bIdx}, true)">
                      <i class="fa-solid fa-triangle-exclamation"></i> Suspicious (Swipe Right)
                    </button>
                  </div>
                \` : ''}
            </div>
          \`;
        } else if (block.type === 'timelineSlider') {
          const totalSteps = (block.steps || []).length;
          const activeStepIdx = timelineActiveSteps[idx]?.[bIdx] || 0;
          const activeStep = block.steps[activeStepIdx] || { label: 'Start', content: 'Empty content' };

          let stepsButtons = '';
          (block.steps || []).forEach((step, sIdx) => {
            const isActive = sIdx === activeStepIdx;
            stepsButtons += \`
              <button class="timeline-step-dot \${isActive ? 'active' : ''}" onclick="selectTimelineStep(\${idx}, \${bIdx}, \${sIdx})">
                <span class="dot-num">\${sIdx + 1}</span>
                <span class="dot-label">\${escapeHtml(step.label)}</span>
              </button>
            \`;
          });

          html += \`
            <div class="content-block timeline-slider-block" id="timeline-\${idx}-\${bIdx}">
              <h3>\${escapeHtml(block.title)}</h3>
              <p class="timeline-description">\${escapeHtml(block.description)}</p>

              <div class="timeline-slider-container">
                <!-- Track & Dots -->
                <div class="timeline-track-wrapper">
                  <div class="timeline-progress-line" style="width: \${(activeStepIdx / Math.max(1, totalSteps - 1)) * 100}%"></div>
                  <div class="timeline-dots-row">
                    \${stepsButtons}
                  </div>
                </div>

                <!-- Active Step Pane -->
                <div class="timeline-content-card animate-fade-in" id="timeline-card-\${bIdx}">
                  <h4>\${escapeHtml(activeStep.label)}</h4>
                  <div class="timeline-body-text">
                    \${activeStep.content}
                  </div>
                </div>

                <!-- Nav Sliders -->
                <div class="timeline-nav-row">
                  <button class="timeline-nav-btn" \${activeStepIdx === 0 ? 'disabled' : ''} onclick="selectTimelineStep(\${idx}, \${bIdx}, \${activeStepIdx - 1})">
                    <i class="fa-solid fa-chevron-left"></i> Previous
                  </button>
                  <span class="timeline-progress-text">Step \${activeStepIdx + 1} of \${totalSteps}</span>
                  <button class="timeline-nav-btn" \${activeStepIdx === totalSteps - 1 ? 'disabled' : ''} onclick="selectTimelineStep(\${idx}, \${bIdx}, \${activeStepIdx + 1})">
                    Next <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          \`;
        } else if (block.type === 'dragDropSort') {
          const totalItems = (block.items || []).length;
          const assignments = dragDropAssignments[idx]?.[bIdx] || {};
          const currentScore = dragDropScores[idx]?.[bIdx] || 0;
          const isFinished = Object.keys(assignments).length === totalItems;

          // Render categories columns
          let columnsHtml = '';
          (block.categories || []).forEach(cat => {
            let columnItems = '';
            (block.items || []).forEach(item => {
              if (assignments[item.id] === cat.id) {
                const isCorrect = item.correctCategoryId === cat.id;
                columnItems += \`
                  <div class="drag-item placed \${isCorrect ? 'correct' : 'incorrect'}" id="drag-item-\${item.id}">
                    <div class="drag-item-text">\${escapeHtml(item.text)}</div>
                    <div class="drag-item-feedback">\${escapeHtml(item.explanation)}</div>
                  </div>
                \`;
              }
            });

            columnsHtml += \`
              <div class="drag-column" id="drag-col-\${cat.id}-\${bIdx}" ondragover="allowDragDrop(event)" ondrop="dropDragCard(event, \${idx}, \${bIdx}, '\${cat.id}')">
                <h4>\${escapeHtml(cat.name)}</h4>
                <div class="drag-column-body">
                  \${columnItems}
                </div>
              </div>
            \`;
          });

          // Render remaining draggable deck cards
          let deckCardsHtml = '';
          (block.items || []).forEach(item => {
            if (!assignments[item.id]) {
              deckCardsHtml += \`
                <div class="drag-card" draggable="true" id="drag-card-\${item.id}-\${bIdx}" ondragstart="startDragCard(event, '\${item.id}')">
                  <i class="fa-solid fa-grip-vertical"></i>
                  <span>\${escapeHtml(item.text)}</span>
                </div>
              \`;
            }
          });

          html += \`
            <div class="content-block drag-drop-sort-block" id="dragdrop-\${idx}-\${bIdx}">
              <h3>\${escapeHtml(block.title)}</h3>
              <p class="drag-description">\${escapeHtml(block.description)}</p>

              <div class="drag-game-container">
                <div class="drag-score-banner">
                  Score: <span id="drag-score-\${bIdx}">\${currentScore}</span>/\${totalItems}
                </div>

                <div class="drag-columns-wrapper">
                  \${columnsHtml}
                </div>

                \${!isFinished ? \`
                  <div class="drag-deck-section">
                    <h5>Draggable Items Deck</h5>
                    <div class="drag-deck-row" id="drag-deck-\${bIdx}">
                      \${deckCardsHtml}
                    </div>
                  </div>
                \` : \`
                  <div class="drag-finished-banner">
                    🎉 <strong>Sorting Finished!</strong> You scored \${currentScore} out of \${totalItems}.
                  </div>
                \`}
              </div>
            </div>
          \`;
        } else if (block.type === 'multiMeterScenario') {
          const currentNodeKey = multiMeterStates[idx]?.[bIdx] || 'start';
          const node = block.nodes[currentNodeKey] || block.nodes['start'] || { promptText: '', choices: [] };
          const metersState = multiMeterVals[idx]?.[bIdx] || {};

          // Render meters indicators
          let metersHtml = '';
          (block.meters || []).forEach(m => {
            const currentVal = metersState[m.id] !== undefined ? metersState[m.id] : m.value;
            metersHtml += \`
              <div class="scenario-meter-item">
                <div class="scenario-meter-lbl">\${escapeHtml(m.label)}</div>
                <div class="scenario-meter-track">
                  <div class="scenario-meter-fill" style="width: \${currentVal}%; background-color: \${m.color || '#3b82f6'};"></div>
                </div>
                <span class="scenario-meter-val">\${currentVal}%</span>
              </div>
            \`;
          });

          const fbKey = idx + '_' + bIdx;
          const fbState = dialogueFeedbackState[fbKey]; // Re-use dialogue feedback state

          // Render choices
          let choicesHtml = '';
          if (fbState) {
            choicesHtml = \`
              <button class="dialogue-choice-btn" style="text-align: center; font-weight: bold; background-color: var(--accent-color); color: white;" onclick="advanceMultiMeterAfterFeedback(\${idx}, \${bIdx})">
                Continue
              </button>
            \`;
          } else if (node.choices && node.choices.length > 0 && !node.isEnd) {
            node.choices.forEach((ch, cIdx) => {
              choicesHtml += \`
                <button class="dialogue-choice-btn" onclick="clickMultiMeterChoice(\${idx}, \${bIdx}, '\${currentNodeKey}', \${cIdx})">
                  \${escapeHtml(ch.text)}
                </button>
              \`;
            });
          } else if (node.isEnd) {
            choicesHtml = \`
              <div class="dialogue-end-banner \${node.isWin ? 'win' : 'lose'}">
                \${node.isWin 
                  ? '🎉 <strong>Scenario Completed Successfully!</strong> You managed all metrics effectively.' 
                  : '⚠️ <strong>Scenario Failed!</strong> One of the key variables collapsed.'}
                <button class="dialogue-reset-btn" onclick="resetMultiMeterScenario(\${idx}, \${bIdx})">
                  <i class="fa-solid fa-rotate-left"></i> Play Again
                </button>
              </div>
            \`;
          }

          let avatarIcon = 'fa-user-tie';
          if (node.avatar === 'leader_happy') {
            avatarIcon = 'fa-face-smile text-emerald-500';
          } else if (node.avatar === 'leader_worried') {
            avatarIcon = 'fa-face-frown text-amber-500';
          } else if (node.avatar === 'leader_sad') {
            avatarIcon = 'fa-face-sad-tear text-red-500';
          }

          let chatStageHtml = \`
            <div class="dialogue-bubble-row row-them">
              <div class="dialogue-avatar"><i class="fa-solid \${avatarIcon}"></i></div>
              <div class="dialogue-bubble bubble-them">
                \${escapeHtml(node.promptText)}
              </div>
            </div>
          \`;

          if (fbState) {
            chatStageHtml += \`
              <div class="dialogue-bubble-row row-me animate-fade-in" style="display: flex; gap: 12px; justify-content: flex-end; align-items: flex-start; margin-top: 12px;">
                <div class="dialogue-bubble bubble-me">
                  \${escapeHtml(fbState.choiceText)}
                </div>
                <div class="dialogue-avatar" style="background-color: var(--accent-color);"><i class="fa-solid fa-user"></i></div>
              </div>
              <div class="dialogue-feedback-row" style="display: block; margin-top: 12px;">
                \${escapeHtml(fbState.feedback)}
              </div>
            \`;
          }

          html += \`
            <div class="content-block dialogue-branching-block" id="multimeter-\${idx}-\${bIdx}">
              <h3>\${escapeHtml(block.title)}</h3>
              <p class="clean-description">\${escapeHtml(block.description)}</p>

              <div class="dialogue-game-container">
                <!-- Variables Track Grid -->
                <div class="scenario-meters-grid">
                  \${metersHtml}
                </div>

                <!-- Chat stage -->
                <div class="dialogue-chat-stage">
                  \${chatStageHtml}
                </div>

                <!-- Choice picker -->
                <div class="dialogue-choices-pane" id="multimeter-choices-\${bIdx}">
                  \${choicesHtml}
                </div>
              </div>
            </div>
          \`;
        } else if (block.type === 'explodedBlueprint') {
          const blueprintImageUrl = block.imageUrl || 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2364748b" font-family="system-ui" font-size="12">No blueprint image uploaded</text></svg>');
          const clickedList = blueprintHotspotsClicked[idx]?.[bIdx] || [];
          const totalPins = (block.hotspots || []).length;
          
          let pinsHtml = '';
          (block.hotspots || []).forEach((h, hIdx) => {
            const isClicked = clickedList.includes(h.id);
            pinsHtml += '<div id="bp-pin-' + h.id + '-' + bIdx + '" class="bp-pin-overlay ' + (isClicked ? 'clicked' : '') + '" style="left: ' + h.x + '%; top: ' + h.y + '%;" onclick="clickBlueprintHotspot(' + idx + ', ' + bIdx + ', &apos;' + h.id + '&apos;)">' +
              '<div class="bp-marker-pulse"></div>' +
              '<div class="bp-marker-icon">' + (hIdx + 1) + '</div>' +
              '</div>';
          });

          html += \`
            <div class="content-block blueprint-inspector-block" id="blueprint-\${idx}-\${bIdx}">
              <h3>\${escapeHtml(block.title)}</h3>
              <p class="clean-description">\${escapeHtml(block.description)}</p>

              <div class="blueprint-game-layout">
                <div class="blueprint-image-container-frame">
                  <div class="blueprint-image-wrapper">
                    <img src="\${blueprintImageUrl}" class="blueprint-bg-image" />
                    \${pinsHtml}
                  </div>
                </div>

                <!-- Info sidebar -->
                <div class="blueprint-info-sidebar">
                  <div class="blueprint-progress-meter">Inspected Items: <span id="blueprint-progress-val-\${bIdx}">\${clickedList.length}</span>/\${totalPins}</div>
                  
                  <div class="blueprint-feedback-box" id="blueprint-feedback-\${bIdx}">
                    Click on the numbered hotspot pins on the blueprint diagram to inspect the components and read their details.
                  </div>

                  <div class="clean-success-banner" id="blueprint-success-\${bIdx}" style="display: \${clickedList.length === totalPins ? 'block' : 'none'}">
                    🎉 <strong>Inspection Complete!</strong> You have successfully examined all key nodes on this diagram.
                  </div>
                </div>
              </div>
            </div>
          \`;
        } else if (block.type === 'variableGraph') {
          const slidersState = graphSliderValues[idx]?.[bIdx] || {};
          
          // Render variable sliders inputs
          let slidersHtml = '';
          let totalShift = 0;
          (block.sliders || []).forEach((sl, sIdx) => {
            const currentVal = Number(slidersState[sIdx] !== undefined ? slidersState[sIdx] : sl.value) || 0;
            const baseVal = Number(sl.value) || 0;
            totalShift += (currentVal - baseVal) * Number(sl.weight || 1.0);
            
            slidersHtml += \`
              <div class="graph-slider-row">
                <div class="graph-slider-label">
                  <span>\${escapeHtml(sl.label)}</span>
                  <strong id="graph-val-\${bIdx}-\${sIdx}">\${currentVal}</strong>
                </div>
                <input type="range" class="graph-slider-range" min="\${sl.min}" max="\${sl.max}" value="\${currentVal}" oninput="updateGraphSliderValue(\${idx}, \${bIdx}, \${sIdx}, this.value)">
              </div>
            \`;
          });

          // Calculate SVG curve coordinates dynamically based on slider values
          const shiftVal = Math.min(60, Math.max(-60, totalShift * 0.5));
          const demandPath = \`M \\\${80 + shiftVal} 40 Q \\\${150 + shiftVal} 130 \\\${250 + shiftVal} 210\`;
          const supplyPath = \`M \\\${250 - shiftVal} 40 Q \\\${170 - shiftVal} 130 \\\${70 - shiftVal} 210\`;

          html += \`
            <div class="content-block variable-graph-block" id="graph-\${idx}-\${bIdx}">
              <h3>\${escapeHtml(block.title)}</h3>
              <p class="clean-description">\${escapeHtml(block.description)}</p>

              <div class="graph-game-container">
                <!-- SVG Chart viewport -->
                <div class="graph-chart-viewport">
                  <svg width="100%" height="200" viewBox="0 0 320 240" class="graph-svg-canvas">
                    <!-- Grid Lines -->
                    <line x1="40" y1="20" x2="40" y2="210" stroke="#cbd5e1" stroke-width="1.5" />
                    <line x1="40" y1="210" x2="300" y2="210" stroke="#cbd5e1" stroke-width="1.5" />
                    
                    <line x1="40" y1="70" x2="300" y2="70" stroke="#f1f5f9" stroke-dasharray="3" />
                    <line x1="40" y1="130" x2="300" y2="130" stroke="#f1f5f9" stroke-dasharray="3" />
                    
                    <!-- Axes labels -->
                    <text x="300" y="230" text-anchor="end" fill="#64748b" font-size="8" font-weight="bold">\${escapeHtml(block.xAxisLabel || 'Quantity')}</text>
                    <text x="15" y="25" fill="#64748b" font-size="8" font-weight="bold" transform="rotate(-90 15 25)" text-anchor="end">\${escapeHtml(block.yAxisLabel || 'Price')}</text>
                    
                    <!-- Plots curves -->
                    <path d="\${demandPath}" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
                    <path d="\${supplyPath}" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" />
                    
                    <!-- Labels -->
                    <text x="\${250 + shiftVal}" y="200" fill="#ef4444" font-size="8" font-weight="bold">Curve A</text>
                    <text x="\${240 - shiftVal}" y="50" fill="#3b82f6" font-size="8" font-weight="bold">Curve B</text>
                  </svg>
                </div>

                <!-- Sliders Panel -->
                <div class="graph-sliders-panel">
                  \${slidersHtml}
                </div>
              </div>
            </div>
          \`;
        } else if (block.type === 'memoryMatch') {
          const flippedIndices = memoryMatchFlipped[idx]?.[bIdx] || [];
          const matchedIndices = memoryMatchMatched[idx]?.[bIdx] || [];
          const attempts = memoryMatchAttempts[idx]?.[bIdx] || 0;
          const totalPairs = (block.pairs || []).length;
          
          const deckKey = idx + '_' + bIdx + '_deck';
          if (!window[deckKey]) {
            const rawCards = [];
            (block.pairs || []).forEach((p, pIdx) => {
              rawCards.push({ id: 'p_' + pIdx + '_a', text: p.term, pairIdx: pIdx, type: 'A' });
              rawCards.push({ id: 'p_' + pIdx + '_b', text: p.definition, pairIdx: pIdx, type: 'B' });
            });
            window[deckKey] = rawCards.sort(() => 0.5 - Math.random());
          }
          
          const deck = window[deckKey];
          let gridCardsHtml = '';
          deck.forEach((card, cardIdx) => {
            const isFlipped = flippedIndices.includes(cardIdx);
            const isMatched = matchedIndices.includes(card.pairIdx);
            
            gridCardsHtml += \`
              <div class="memory-card-wrapper">
                <div class="memory-card \${isFlipped ? 'flipped' : ''} \${isMatched ? 'matched' : ''}" onclick="flipMemoryCard(\${idx}, \${bIdx}, \${cardIdx})">
                  <div class="memory-card-inner">
                    <div class="memory-card-front">
                      <i class="fa-solid fa-question text-slate-300 text-lg"></i>
                    </div>
                    <div class="memory-card-back">
                      <div class="memory-card-text">\${escapeHtml(card.text)}</div>
                    </div>
                  </div>
                </div>
              </div>
            \`;
          });

          html += \`
            <div class="content-block memory-match-block" id="memory-\${idx}-\${bIdx}">
              <h3>\${escapeHtml(block.title)}</h3>
              <p class="clean-description">\${escapeHtml(block.description)}</p>

              <div class="memory-game-container">
                <div class="memory-stats-header">
                  <span>Matched: <strong>\${matchedIndices.length}/\${totalPairs}</strong></span>
                  <span>Attempts: <strong>\${attempts}</strong></span>
                </div>

                <div class="memory-grid-canvas">
                  \${gridCardsHtml}
                </div>

                <div class="memory-success-banner animate-fade-in" id="memory-success-\${bIdx}" style="display: \${matchedIndices.length === totalPairs ? 'block' : 'none'}">
                  🎉 <strong>Excellent Memory!</strong> You completed the matching game in \${attempts} attempts.
                  <button class="memory-reset-btn" onclick="resetMemoryMatch(\${idx}, \${bIdx})">Play Again</button>
                </div>
              </div>
            </div>
          \`;
        }
      });
      
      container.innerHTML = html;

      // Re-apply states for visualHotspots
      page.blocks.forEach((block, bIdx) => {
        if (block.type === 'visualHotspot') {
          const found = visualHotspotsFound[idx]?.[bIdx];
          if (found) {
            found.forEach(hId => {
              const el = document.getElementById(hId + '-' + bIdx);
              if (el) el.classList.add('found');
            });
            const progress = document.getElementById('visual-progress-val-' + bIdx);
            if (progress) progress.textContent = found.size;
            
            const totalHazards = (block.hazards || []).length;
            if (found.size === totalHazards) {
              const banner = document.getElementById('visual-success-' + bIdx);
              if (banner) banner.style.display = 'block';
              const explain = document.getElementById('visual-explain-' + bIdx);
              if (explain) explain.style.display = 'none';
            }
          }
        }
      });

      // Update Navigation buttons
      document.getElementById('btn-prev').disabled = (currentPageIdx === 0);
      const nextBtn = document.getElementById('btn-next');
      if (currentPageIdx === courseData.pages.length - 1) {
        nextBtn.textContent = 'Finish Course';
      } else {
        nextBtn.textContent = 'Next →';
      }

      document.getElementById('page-indicator').textContent = \`Page \${currentPageIdx + 1} of \${courseData.pages.length}\`;
      
      // Update UI Progress and Sidebar selection
      updateProgress();
      renderTOC();
    }

    window.selectAnswer = function(pIdx, bIdx, oIdx) {
      if (!quizAnswers[pIdx]) quizAnswers[pIdx] = {};
      // Only allow one attempt or allow changing? Let's check if already answered
      if (quizAnswers[pIdx][bIdx] !== undefined) return;
      
      quizAnswers[pIdx][bIdx] = oIdx;
      
      // Reload page state to show feedback
      loadPage(pIdx);
      
      // Submit progress / scores
      evaluateQuizPerformance();
    }

    function evaluateQuizPerformance() {
      let totalQuestions = 0;
      let correctAnswers = 0;
      let quizFinished = true;

      courseData.pages.forEach((page, pIdx) => {
        page.blocks.forEach((block, bIdx) => {
          if (block.type === 'quiz') {
            totalQuestions++;
            const selected = quizAnswers[pIdx]?.[bIdx];
            if (selected === undefined) {
              quizFinished = false;
            } else if (selected === block.correct) {
              correctAnswers++;
            }
          }
        });
      });

      if (totalQuestions > 0) {
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Report score
        if (courseData.scormVersion === '1.2') {
          scorm.setValue("cmi.core.score.raw", String(percentage));
          scorm.setValue("cmi.core.score.min", "0");
          scorm.setValue("cmi.core.score.max", "100");
          
          if (percentage >= scoreThreshold) {
            scorm.setValue("cmi.core.lesson_status", "passed");
          } else if (quizFinished) {
            scorm.setValue("cmi.core.lesson_status", "failed");
          }
        } else {
          // SCORM 2004
          scorm.setValue("cmi.score.raw", String(percentage));
          scorm.setValue("cmi.score.min", "0");
          scorm.setValue("cmi.score.max", "100");
          scorm.setValue("cmi.score.scaled", String(percentage / 100));
          
          if (percentage >= scoreThreshold) {
            scorm.setValue("cmi.success_status", "passed");
            scorm.setValue("cmi.completion_status", "completed");
          } else if (quizFinished) {
            scorm.setValue("cmi.success_status", "failed");
          }
        }
      }
      
      scorm.commit();
    }

    function updateProgress() {
      const progressPercent = Math.round((visitedPages.size / courseData.pages.length) * 100);
      document.getElementById('progress-bar').style.width = progressPercent + '%';
      document.getElementById('progress-val').textContent = progressPercent + '%';
      
      // If completed all pages, set status to completed
      let totalQuestions = 0;
      courseData.pages.forEach(p => p.blocks.forEach(b => { if(b.type === 'quiz') totalQuestions++; }));

      // Complete course logic
      if (progressPercent === 100) {
        if (totalQuestions === 0) {
          if (courseData.scormVersion === '1.2') {
            scorm.setValue("cmi.core.lesson_status", "completed");
          } else {
            scorm.setValue("cmi.completion_status", "completed");
            scorm.setValue("cmi.success_status", "passed");
          }
          scorm.commit();
        }
      }
    }

    document.getElementById('btn-prev').addEventListener('click', () => {
      if (currentPageIdx > 0) loadPage(currentPageIdx - 1);
    });

    document.getElementById('btn-next').addEventListener('click', () => {
      if (currentPageIdx < courseData.pages.length - 1) {
        loadPage(currentPageIdx + 1);
      } else {
        // Final finish
        alert("Congratulations! You have completed the course.");
        scorm.terminate();
      }
    });

    window.switchTab = function(btn, bIdx, tIdx) {
      const container = document.getElementById('tabs-' + bIdx);
      if (!container) return;
      
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      const activePane = container.querySelector('#tab-pane-' + bIdx + '-' + tIdx);
      if (activePane) activePane.classList.add('active');
    };

    window.selectChatChoice = function(pIdx, bIdx, cIdx) {
      if (!chatSelections[pIdx]) chatSelections[pIdx] = {};
      if (chatSelections[pIdx][bIdx] !== undefined) return;
      chatSelections[pIdx][bIdx] = cIdx;
      loadPage(pIdx);
    };

    window.togglePasswordVisibility = function(el) {
      const input = el.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        el.textContent = '👁️';
      } else {
        input.type = 'password';
        el.textContent = '🔒';
      }
    };

    window.evaluatePassword = function(input, bIdx) {
      const val = input.value;
      const suggestBox = document.getElementById('pwd-suggest-' + bIdx);
      const label = document.getElementById('pwd-label-' + bIdx);
      
      const block = courseData.pages[currentPageIdx].blocks[bIdx];
      
      for(let i=0; i<3; i++) {
        const barFill = document.getElementById('pwd-bar-' + i + '-' + bIdx);
        if (barFill) {
          barFill.style.width = '0%';
          barFill.className = 'strength-bar-fill';
        }
      }
      
      if(!val) {
        if (label) {
          label.textContent = block.labelEmpty || 'Empty';
          label.className = 'strength-label-text';
        }
        if (suggestBox) suggestBox.innerHTML = block.labelPlaceholder || 'Type password above to begin strength evaluation.';
        return;
      }
      
      let score = 0;
      let reasons = [];
      
      if (val.length >= 8) {
        score++;
      } else {
        reasons.push(block.labelTooShort || 'Too short (minimum 8 characters)');
      }
      
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) {
        score++;
      } else {
        reasons.push(block.labelMixCase || 'Mix uppercase and lowercase letters');
      }
      
      if (/[0-9]/.test(val)) {
        score++;
      } else {
        reasons.push(block.labelAddNumbers || 'Add numbers (0-9)');
      }
      
      if (/[^A-Za-z0-9]/.test(val)) {
        score++;
      } else {
        reasons.push(block.labelUseSymbols || 'Use unique characters/symbols (e.g. !, @, #, $, etc.)');
      }
      
      let fillClass = 'weak';
      let scoreText = block.labelWeak || 'Weak';
      let activeBars = 1;
      
      if (score >= 4) {
        fillClass = 'strong';
        scoreText = block.labelStrong || 'Strong';
        activeBars = 3;
      } else if (score >= 2) {
        fillClass = 'medium';
        scoreText = block.labelMedium || 'Medium';
        activeBars = 2;
      }
      
      if (label) {
        label.textContent = scoreText;
        label.className = 'strength-label-text ' + fillClass;
      }
      
      for(let i=0; i<activeBars; i++) {
        const bar = document.getElementById('pwd-bar-' + i + '-' + bIdx);
        if (bar) {
          bar.style.width = '100%';
          bar.classList.add(fillClass);
        }
      }
      
      if (suggestBox) {
        if(reasons.length > 0) {
          suggestBox.innerHTML = '<span class="suggest-warn">' + (block.labelRecommendations || 'Recommendations:') + '</span><ul>' + reasons.map(r => '<li>' + r + '</li>').join('') + '</ul>';
        } else {
          suggestBox.innerHTML = '<span class="suggest-ok">' + (block.labelSuccess || 'Excellent! Your password meets the minimum security requirements (Very Strong).') + '</span>';
        }
      }
    };

    window.findVisualHotspot = function(pIdx, bIdx, hazardId) {
      if (!visualHotspotsFound[pIdx]) visualHotspotsFound[pIdx] = {};
      if (!visualHotspotsFound[pIdx][bIdx]) visualHotspotsFound[pIdx][bIdx] = new Set();
      
      const foundSet = visualHotspotsFound[pIdx][bIdx];
      if (foundSet.has(hazardId)) return;
      
      foundSet.add(hazardId);
      
      const progressVal = document.getElementById('visual-progress-val-' + bIdx);
      if (progressVal) progressVal.textContent = foundSet.size;
      
      const element = document.getElementById(hazardId + '-' + bIdx);
      if (element) {
        element.classList.add('found');
      }
      
      const block = courseData.pages[pIdx].blocks[bIdx];
      const hazard = block.hazards.find(h => h.id === hazardId);
      const explanationBox = document.getElementById('visual-explain-' + bIdx);
      
      if (hazard && explanationBox) {
        explanationBox.innerHTML = \`<div class="hazard-explanation-entry animate-fade-in">
          <strong>🔍 \${escapeHtml(block.identifiedLabel || 'Identified')}: \${escapeHtml(hazard.name)}</strong>
          <p>\${escapeHtml(hazard.description)}</p>
        </div>\`;
      }
      
      const totalHazards = (block.hazards || []).length;
      if (foundSet.size === totalHazards) {
        const successBanner = document.getElementById('visual-success-' + bIdx);
        if (successBanner) successBanner.style.display = 'block';
        if (explanationBox) explanationBox.style.display = 'none';
      }
    };

    const dialogueFeedbackState = {};

    window.submitPhishingDecision = function(pageIdx, blockIdx, action) {
      if (!phishingDecisions[pageIdx]) phishingDecisions[pageIdx] = {};
      if (phishingDecisions[pageIdx][blockIdx] !== undefined) return;
      phishingDecisions[pageIdx][blockIdx] = action;
      loadPage(pageIdx);
    };

    window.toggleEmailDetails = function(blockIdx) {
      const panel = document.getElementById('details-panel-' + blockIdx);
      const arrow = document.getElementById('details-arrow-' + blockIdx);
      if (panel) {
        if (panel.style.display === 'none') {
          panel.style.display = 'block';
          if (arrow) arrow.textContent = '▲';
        } else {
          panel.style.display = 'none';
          if (arrow) arrow.textContent = '▼';
        }
      }
    };

    window.clickDialogueChoice = function(pIdx, bIdx, currentNodeKey, choiceIdx) {
      const block = courseData.pages[pIdx].blocks[bIdx];
      const node = block.nodes[currentNodeKey];
      if (!node) return;
      const choice = node.choices[choiceIdx];
      if (!choice) return;

      // Update suspicion/risk meter
      const currentRisk = dialogueRisks[pIdx]?.[bIdx] || 0;
      const change = parseInt(choice.riskChange, 10) || 0;
      const nextRisk = Math.min(100, Math.max(0, currentRisk + change));
      if (!dialogueRisks[pIdx]) dialogueRisks[pIdx] = {};
      dialogueRisks[pIdx][bIdx] = nextRisk;

      const targetNextNode = choice.nextNode || '';
      const fbKey = pIdx + '_' + bIdx;

      if (choice.feedback && choice.feedback.trim() !== '') {
        dialogueFeedbackState[fbKey] = {
          choiceText: choice.text,
          feedback: choice.feedback,
          nextNode: targetNextNode
        };
        loadPage(pIdx);
      } else {
        if (!dialogueStates[pIdx]) dialogueStates[pIdx] = {};
        dialogueStates[pIdx][bIdx] = targetNextNode;
        loadPage(pIdx);
      }
    };

    window.advanceDialogueAfterFeedback = function(pIdx, bIdx) {
      const fbKey = pIdx + '_' + bIdx;
      const state = dialogueFeedbackState[fbKey];
      if (!state) return;
      
      const targetNextNode = state.nextNode;
      delete dialogueFeedbackState[fbKey];
      
      if (!dialogueStates[pIdx]) dialogueStates[pIdx] = {};
      dialogueStates[pIdx][bIdx] = targetNextNode;
      loadPage(pIdx);
    };

    window.resetDialogue = function(pIdx, bIdx) {
      if (!dialogueStates[pIdx]) dialogueStates[pIdx] = {};
      dialogueStates[pIdx][bIdx] = 'start';
      if (!dialogueRisks[pIdx]) dialogueRisks[pIdx] = {};
      dialogueRisks[pIdx][bIdx] = 0;
      const fbKey = pIdx + '_' + bIdx;
      delete dialogueFeedbackState[fbKey];
      loadPage(pIdx);
    };

    window.clickWorkspaceCleanPin = function(pageIdx, blockIdx, pinId) {
      const block = courseData.pages[pageIdx].blocks[blockIdx];
      const pin = block.pins.find(p => p.id === pinId);
      if (!pin) return;

      const cleared = workspaceCleanCleared[pageIdx]?.[blockIdx] || [];
      if (cleared.includes(pinId)) {
        // Show explanation again in feedback box
        const feedbackBox = document.getElementById('clean-feedback-' + blockIdx);
        if (feedbackBox) {
          feedbackBox.innerHTML = \`<strong>🔒 \${escapeHtml(pin.name)}:</strong> \${escapeHtml(pin.explanation)}\`;
        }
        return;
      }

      // Open selector overlay modal
      const panel = document.getElementById('clean-action-panel-' + blockIdx);
      const title = document.getElementById('clean-pin-title-' + blockIdx);
      const container = document.getElementById('clean-options-container-' + blockIdx);
      
      if (panel && title && container) {
        panel.style.display = 'block';
        title.textContent = pin.name;
        container.innerHTML = pin.options.map(opt => \`
          <button class="clean-option-item-btn" onclick="submitWorkspaceCleanAction(\${pageIdx}, \${blockIdx}, '\${pin.id}', '\${opt.id}')">
            \${escapeHtml(opt.label)}
          </button>
        \`).join('');
      }
    };

    window.submitWorkspaceCleanAction = function(pageIdx, blockIdx, pinId, actionId) {
      const block = courseData.pages[pageIdx].blocks[blockIdx];
      const pin = block.pins.find(p => p.id === pinId);
      if (!pin) return;

      const panel = document.getElementById('clean-action-panel-' + blockIdx);
      const feedbackBox = document.getElementById('clean-feedback-' + blockIdx);
      
      if (actionId === pin.correctAction) {
        if (!workspaceCleanCleared[pageIdx]) workspaceCleanCleared[pageIdx] = {};
        if (!workspaceCleanCleared[pageIdx][blockIdx]) workspaceCleanCleared[pageIdx][blockIdx] = [];
        if (!workspaceCleanCleared[pageIdx][blockIdx].includes(pinId)) {
          workspaceCleanCleared[pageIdx][blockIdx].push(pinId);
        }

        const cleared = workspaceCleanCleared[pageIdx][blockIdx];
        const numCleared = cleared.length;
        const totalPins = (block.pins || []).length;

        // Update indicator
        const progressVal = document.getElementById('clean-progress-val-' + blockIdx);
        if (progressVal) progressVal.textContent = numCleared;

        // Mark pin as cleared visually
        const pinEl = document.getElementById('clean-pin-' + pinId + '-' + blockIdx);
        if (pinEl) pinEl.classList.add('cleared');

        if (feedbackBox) {
          feedbackBox.innerHTML = \`<span style="color: var(--success-color); font-weight: bold;">🎉 Correct Choice!</span><br><strong>\${escapeHtml(pin.name)}:</strong> \${escapeHtml(pin.explanation)}\`;
        }

        // Hide overlay panel
        if (panel) panel.style.display = 'none';

        // Check if all are cleared
        if (numCleared === totalPins) {
          const successBanner = document.getElementById('clean-success-' + blockIdx);
          if (successBanner) successBanner.style.display = 'block';
        }
      } else {
        if (feedbackBox) {
          feedbackBox.innerHTML = \`<span style="color: var(--error-color); font-weight: bold;">❌ Incorrect Action!</span> Try a different approach for <strong>\${escapeHtml(pin.name)}</strong>.\`;
        }
      }
    };

    window.swipeCardDecision = function(pageIdx, blockIdx, userSuspicious) {
      const block = courseData.pages[pageIdx].blocks[blockIdx];
      const currentIdx = swipeDeckIndexes[pageIdx]?.[blockIdx] || 0;
      const card = block.cards[currentIdx];
      if (!card) return;

      const isCorrect = (userSuspicious === card.isSuspicious);
      if (isCorrect) {
        if (!swipeDeckScores[pageIdx]) swipeDeckScores[pageIdx] = {};
        swipeDeckScores[pageIdx][blockIdx] = (swipeDeckScores[pageIdx][blockIdx] || 0) + 1;
        
        const scoreEl = document.getElementById('swipe-score-' + blockIdx);
        if (scoreEl) scoreEl.textContent = swipeDeckScores[pageIdx][blockIdx];
      }

      const explainOverlay = document.getElementById('swipe-explain-overlay-' + blockIdx);
      const explainHeader = document.getElementById('swipe-explain-header-' + blockIdx);
      const explainText = document.getElementById('swipe-explain-text-' + blockIdx);
      
      if (explainOverlay) {
        explainOverlay.style.display = 'block';
        if (explainHeader) {
          explainHeader.textContent = isCorrect ? '✅ Correct!' : '❌ Incorrect!';
          explainHeader.className = 'explain-header ' + (isCorrect ? 'correct' : 'incorrect');
        }
        if (explainText) {
          explainText.textContent = card.explanation;
        }
      }

      const buttons = document.getElementById('swipe-buttons-' + blockIdx);
      if (buttons) buttons.style.display = 'none';
    };

    window.nextSwipeCard = function(pageIdx, blockIdx) {
      if (!swipeDeckIndexes[pageIdx]) swipeDeckIndexes[pageIdx] = {};
      const currentIdx = swipeDeckIndexes[pageIdx][blockIdx] || 0;
      swipeDeckIndexes[pageIdx][blockIdx] = currentIdx + 1;
      loadPage(pageIdx);
    };

    window.resetSwipeDeck = function(pageIdx, blockIdx) {
      if (!swipeDeckIndexes[pageIdx]) swipeDeckIndexes[pageIdx] = {};
      swipeDeckIndexes[pageIdx][blockIdx] = 0;
      if (!swipeDeckScores[pageIdx]) swipeDeckScores[pageIdx] = {};
      swipeDeckScores[pageIdx][blockIdx] = 0;
      loadPage(pageIdx);
    };

    window.selectTimelineStep = function(pIdx, bIdx, stepIdx) {
      if (!timelineActiveSteps[pIdx]) timelineActiveSteps[pIdx] = {};
      timelineActiveSteps[pIdx][bIdx] = stepIdx;
      loadPage(pIdx);
    };

    window.allowDragDrop = function(event) {
      event.preventDefault();
    };

    window.startDragCard = function(event, cardId) {
      event.dataTransfer.setData("text/plain", cardId);
    };

    window.dropDragCard = function(event, pIdx, bIdx, categoryId) {
      event.preventDefault();
      const cardId = event.dataTransfer.getData("text/plain");
      if (!cardId) return;

      const block = courseData.pages[pIdx].blocks[bIdx];
      const item = block.items.find(i => i.id === cardId);
      if (!item) return;

      if (!dragDropAssignments[pIdx]) dragDropAssignments[pIdx] = {};
      if (!dragDropAssignments[pIdx][bIdx]) dragDropAssignments[pIdx][bIdx] = {};
      dragDropAssignments[pIdx][bIdx][cardId] = categoryId;

      // Calculate score increment
      const isCorrect = (item.correctCategoryId === categoryId);
      if (isCorrect) {
        if (!dragDropScores[pIdx]) dragDropScores[pIdx] = {};
        dragDropScores[pIdx][bIdx] = (dragDropScores[pIdx][bIdx] || 0) + 1;
      }

      loadPage(pIdx);
    };

    window.clickMultiMeterChoice = function(pIdx, bIdx, currentNodeKey, choiceIdx) {
      const block = courseData.pages[pIdx].blocks[bIdx];
      const node = block.nodes[currentNodeKey];
      if (!node) return;
      const choice = node.choices[choiceIdx];
      if (!choice) return;

      // Update meters value
      if (!multiMeterVals[pIdx]) multiMeterVals[pIdx] = {};
      if (!multiMeterVals[pIdx][bIdx]) multiMeterVals[pIdx][bIdx] = {};
      const metersState = multiMeterVals[pIdx][bIdx];

      (block.meters || []).forEach(m => {
        const currentVal = metersState[m.id] !== undefined ? metersState[m.id] : m.value;
        const change = parseInt(choice.changes?.[m.id], 10) || 0;
        metersState[m.id] = Math.min(100, Math.max(0, currentVal + change));
      });

      const targetNextNode = choice.nextNode || '';
      const fbKey = pIdx + '_' + bIdx;

      if (choice.feedback && choice.feedback.trim() !== '') {
        dialogueFeedbackState[fbKey] = {
          choiceText: choice.text,
          feedback: choice.feedback,
          nextNode: targetNextNode
        };
        loadPage(pIdx);
      } else {
        if (!multiMeterStates[pIdx]) multiMeterStates[pIdx] = {};
        multiMeterStates[pIdx][bIdx] = targetNextNode;
        loadPage(pIdx);
      }
    };

    window.advanceMultiMeterAfterFeedback = function(pIdx, bIdx) {
      const fbKey = pIdx + '_' + bIdx;
      const state = dialogueFeedbackState[fbKey];
      if (!state) return;
      
      const targetNextNode = state.nextNode;
      delete dialogueFeedbackState[fbKey];
      
      if (!multiMeterStates[pIdx]) multiMeterStates[pIdx] = {};
      multiMeterStates[pIdx][bIdx] = targetNextNode;
      loadPage(pIdx);
    };

    window.resetMultiMeterScenario = function(pIdx, bIdx) {
      if (!multiMeterStates[pIdx]) multiMeterStates[pIdx] = {};
      multiMeterStates[pIdx][bIdx] = 'start';
      if (!multiMeterVals[pIdx]) multiMeterVals[pIdx] = {};
      multiMeterVals[pIdx][bIdx] = {};
      const fbKey = pIdx + '_' + bIdx;
      delete dialogueFeedbackState[fbKey];
      loadPage(pIdx);
    };

    window.clickBlueprintHotspot = function(pIdx, bIdx, hotspotId) {
      if (!blueprintHotspotsClicked[pIdx]) blueprintHotspotsClicked[pIdx] = {};
      if (!blueprintHotspotsClicked[pIdx][bIdx]) blueprintHotspotsClicked[pIdx][bIdx] = [];
      const clicked = blueprintHotspotsClicked[pIdx][bIdx];
      if (!clicked.includes(hotspotId)) {
        clicked.push(hotspotId);
      }

      // Mark pin as clicked visually
      const pinEl = document.getElementById('bp-pin-' + hotspotId + '-' + bIdx);
      if (pinEl) pinEl.classList.add('clicked');

      const block = courseData.pages[pIdx].blocks[bIdx];
      const hs = block.hotspots.find(h => h.id === hotspotId);
      const feedbackBox = document.getElementById('blueprint-feedback-' + bIdx);
      if (hs && feedbackBox) {
        feedbackBox.innerHTML = \`<div class="hazard-explanation-entry animate-fade-in">
          <strong>🔍 \${escapeHtml(hs.name)}</strong>
          <p>\${escapeHtml(hs.description)}</p>
        </div>\`;
      }

      const progressVal = document.getElementById('blueprint-progress-val-' + bIdx);
      if (progressVal) progressVal.textContent = clicked.length;

      const totalPins = (block.hotspots || []).length;
      if (clicked.length === totalPins) {
        const successBanner = document.getElementById('blueprint-success-' + bIdx);
        if (successBanner) successBanner.style.display = 'block';
        if (feedbackBox) feedbackBox.style.display = 'none';
      }
    };

    window.updateGraphSliderValue = function(pIdx, bIdx, sliderIdx, value) {
      if (!graphSliderValues[pIdx]) graphSliderValues[pIdx] = {};
      if (!graphSliderValues[pIdx][bIdx]) graphSliderValues[pIdx][bIdx] = {};
      graphSliderValues[pIdx][bIdx][sliderIdx] = parseInt(value, 10) || 0;
      
      const valEl = document.getElementById('graph-val-' + bIdx + '-' + sliderIdx);
      if (valEl) valEl.textContent = value;
      
      const block = courseData.pages[pIdx].blocks[bIdx];
      let totalShift = 0;
      (block.sliders || []).forEach((sl, sIdx) => {
        const currentVal = Number(graphSliderValues[pIdx][bIdx][sIdx] !== undefined ? graphSliderValues[pIdx][bIdx][sIdx] : sl.value) || 0;
        const baseVal = Number(sl.value) || 0;
        totalShift += (currentVal - baseVal) * Number(sl.weight || 1.0);
      });

      const shiftVal = Math.min(60, Math.max(-60, totalShift * 0.5));
      const demandPath = \`M \${80 + shiftVal} 40 Q \${150 + shiftVal} 130 \${250 + shiftVal} 210\`;
      const supplyPath = \`M \${250 - shiftVal} 40 Q \${170 - shiftVal} 130 \${70 - shiftVal} 210\`;

      const blockEl = document.getElementById('graph-' + pIdx + '-' + bIdx);
      if (blockEl) {
        const paths = blockEl.querySelectorAll('path');
        if (paths[0]) paths[0].setAttribute('d', demandPath);
        if (paths[1]) paths[1].setAttribute('d', supplyPath);
      }
    };

    let memoryMatchTimeout = null;
    window.flipMemoryCard = function(pIdx, bIdx, cardIdx) {
      if (memoryMatchTimeout) return;

      if (!memoryMatchFlipped[pIdx]) memoryMatchFlipped[pIdx] = {};
      if (!memoryMatchFlipped[pIdx][bIdx]) memoryMatchFlipped[pIdx][bIdx] = [];
      const flipped = memoryMatchFlipped[pIdx][bIdx];

      if (!memoryMatchMatched[pIdx]) memoryMatchMatched[pIdx] = {};
      if (!memoryMatchMatched[pIdx][bIdx]) memoryMatchMatched[pIdx][bIdx] = [];
      const matched = memoryMatchMatched[pIdx][bIdx];

      const deckKey = pIdx + '_' + bIdx + '_deck';
      const deck = window[deckKey];
      if (!deck) return;

      const card = deck[cardIdx];
      if (matched.includes(card.pairIdx)) return;
      if (flipped.includes(cardIdx)) return;

      flipped.push(cardIdx);
      loadPage(pIdx);

      if (flipped.length === 2) {
        if (!memoryMatchAttempts[pIdx]) memoryMatchAttempts[pIdx] = {};
        memoryMatchAttempts[pIdx][bIdx] = (memoryMatchAttempts[pIdx][bIdx] || 0) + 1;

        const cardA = deck[flipped[0]];
        const cardB = deck[flipped[1]];

        if (cardA.pairIdx === cardB.pairIdx) {
          matched.push(cardA.pairIdx);
          memoryMatchFlipped[pIdx][bIdx] = [];
          loadPage(pIdx);
        } else {
          memoryMatchTimeout = setTimeout(() => {
            memoryMatchFlipped[pIdx][bIdx] = [];
            memoryMatchTimeout = null;
            loadPage(pIdx);
          }, 1000);
        }
      }
    };

    window.resetMemoryMatch = function(pIdx, bIdx) {
      const deckKey = pIdx + '_' + bIdx + '_deck';
      delete window[deckKey];

      if (!memoryMatchFlipped[pIdx]) memoryMatchFlipped[pIdx] = {};
      memoryMatchFlipped[pIdx][bIdx] = [];
      if (!memoryMatchMatched[pIdx]) memoryMatchMatched[pIdx] = {};
      memoryMatchMatched[pIdx][bIdx] = [];
      if (!memoryMatchAttempts[pIdx]) memoryMatchAttempts[pIdx] = {};
      memoryMatchAttempts[pIdx][bIdx] = 0;
      loadPage(pIdx);
    };

    function escapeHtml(text) {
      if (!text) return '';
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    window.onload = init;
  </script>
</body>
</html>`;
}

// Course Player CSS template
export function getPlayerCss(config) {
  const theme = config.theme || {
    bgPrimary: '#12141c',
    bgSidebar: '#1a1d29',
    textColor: '#f3f4f6',
    accentColor: '#6366f1'
  };
  return `/* Sleek Course Player CSS */
:root {
  --bg-primary: ${theme.bgPrimary};
  --bg-sidebar: ${theme.bgSidebar};
  --border-color: color-mix(in srgb, ${theme.textColor} 15%, transparent);
  --text-main: ${theme.textColor};
  --text-muted: color-mix(in srgb, ${theme.textColor} 60%, transparent);
  --accent-color: ${theme.accentColor};
  --accent-hover: ${theme.accentColor};
  --accent-light: color-mix(in srgb, ${theme.accentColor} 15%, transparent);
  --success-color: #10b981;
  --error-color: #ef4444;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-main);
  line-height: 1.6;
}

.player-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar Styling */
.sidebar {
  width: 320px;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h1 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.sidebar-header .description {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.toc {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px 12px;
}

.toc-list {
  list-style: none;
}

.toc-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 6px;
  transition: all 0.2s ease;
}

.toc-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.toc-item.active {
  background-color: var(--accent-light);
  color: var(--accent-color);
}

.toc-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--border-color);
  margin-right: 12px;
  flex-shrink: 0;
}

.toc-item.active .toc-bullet {
  background-color: var(--accent-color);
}

.toc-item.completed .toc-bullet {
  background-color: var(--success-color);
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid var(--border-color);
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.progress-bar-bg {
  height: 6px;
  background-color: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.3s ease;
}

/* Main Content Area */
.content-viewport {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background-color: var(--bg-primary);
  overflow: hidden;
}

.content-scroll-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
}

#content-container {
  padding: 48px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.page-content h2 {
  font-size: 2rem;
  margin-bottom: 24px;
  font-weight: 700;
  border-left: 4px solid var(--accent-color);
  padding-left: 16px;
}

.content-block {
  margin-bottom: 32px !important;
}

.text-block {
  color: #d1d5db;
}

/* Quiz Styling */
.quiz-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}

.quiz-question {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 18px;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quiz-option {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quiz-option:hover:not(.disabled) {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: var(--accent-color);
}

.option-bullet {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.quiz-option:hover .option-bullet {
  border-color: var(--accent-color);
}

.quiz-option.correct {
  border-color: var(--success-color);
  background-color: rgba(16, 185, 129, 0.08);
}

.quiz-option.correct .option-bullet {
  border-color: var(--success-color);
  background-color: var(--success-color);
}

.quiz-option.incorrect {
  border-color: var(--error-color);
  background-color: rgba(239, 68, 68, 0.08);
}

.quiz-option.incorrect .option-bullet {
  border-color: var(--error-color);
  background-color: var(--error-color);
}

.quiz-option.disabled {
  cursor: not-allowed;
}

.quiz-feedback {
  margin-top: 16px;
  font-weight: 600;
  font-size: 0.95rem;
}

.feedback-correct {
  color: var(--success-color);
}

.feedback-incorrect {
  color: var(--error-color);
}

/* Bottom Nav Controller */
.content-nav {
  padding: 20px 48px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-sidebar);
}

.nav-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  border-color: var(--text-main);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-btn-primary {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
}

.nav-btn-primary:hover:not(:disabled) {
  background-color: var(--accent-hover);
  border-color: var(--accent-hover);
}

#page-indicator {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Card Flip Effect */
.flip-card {
  background-color: transparent;
  width: 100%;
  height: 160px;
  perspective: 1000px;
  cursor: pointer;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.5s;
  transform-style: preserve-3d;
}
.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-color);
}
.flip-card-front {
  background-color: var(--bg-sidebar);
  color: var(--text-main);
}
.flip-card-back {
  background-color: var(--accent-light);
  color: var(--text-main);
  transform: rotateY(180deg);
  border-color: var(--accent-color);
}
.card-prompt {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--accent-color);
  margin-bottom: 8px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.flip-card-back .card-prompt {
  color: var(--success-color);
}
.card-text {
  font-size: 1.1rem;
  font-weight: 600;
}

/* Accordion Collapsible */
.accordion-item {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
  background-color: var(--bg-sidebar);
  cursor: pointer;
  transition: border-color 0.2s;
}
.accordion-item:hover {
  border-color: var(--accent-color);
}
.accordion-header {
  padding: 16px 20px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}
.accordion-icon {
  font-size: 0.8rem;
  transition: transform 0.2s;
  color: var(--text-muted);
}
.accordion-item.active .accordion-icon {
  transform: rotate(180deg);
}
.accordion-content {
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease-out, padding 0.25s ease-out;
  color: var(--text-muted);
  font-size: 0.95rem;
}
.accordion-item.active .accordion-content {
  padding: 16px 20px;
  max-height: 800px;
  border-top: 1px solid var(--border-color);
}

/* Tabs Container */
.tabs-container {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--bg-sidebar);
}
.tabs-header {
  display: flex;
  background-color: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
}
.tab-btn {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.tab-btn:hover {
  color: var(--text-main);
}
.tab-btn.active {
  color: var(--accent-color);
  border-bottom-color: var(--accent-color);
  background-color: rgba(255, 255, 255, 0.02);
}
.tabs-body {
  padding: 24px;
}
.tab-pane {
  display: none;
}
.tab-pane.active {
  display: block;
  animation: fadeIn 0.3s ease;
}

/* Hotspots / Tooltip Annotations */
.hotspots-block-layout {
  border-radius: 12px;
}
.hotspots-body-generic {
  white-space: pre-wrap;
  line-height: 1.8;
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.hotspot-text {
  border-bottom: 2px dashed var(--accent-color);
  background-color: var(--accent-light);
  position: relative;
  cursor: help;
  display: inline-block;
  padding: 0 4px;
  border-radius: 4px;
  font-weight: 600;
}
.hotspot-tooltip {
  visibility: hidden;
  width: 280px;
  background-color: var(--bg-sidebar);
  color: var(--text-main);
  border: 1px solid var(--accent-color);
  border-radius: 8px;
  padding: 12px;
  position: absolute;
  z-index: 100;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
  font-size: 0.85rem;
  font-weight: normal;
  pointer-events: none;
  line-height: 1.4;
  text-align: left;
}
.hotspot-text:hover .hotspot-tooltip {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Premium Email Mockup Client */
.hotspot-email-client {
  background-color: #ffffff;
  color: #1e293b;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  text-align: left;
}
.email-toolbar {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  user-select: none;
  border-top-left-radius: 11px;
  border-top-right-radius: 11px;
}
.toolbar-left {
  display: flex;
  gap: 8px;
}
.toolbar-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 5px 12px;
  border-radius: 6px;
  color: #475569;
  font-weight: 600;
  cursor: not-allowed;
}
.toolbar-btn.spam-btn {
  background-color: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
}
.email-badge {
  background-color: var(--accent-light);
  color: var(--accent-color);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
}
.email-header-section {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background-color: #ffffff;
}
.email-subject-line {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a !important;
  margin-bottom: 14px;
  border: none !important;
  padding: 0 !important;
}
.email-sender-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sender-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: var(--accent-color);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}
.sender-details {
  flex-grow: 1;
}
.sender-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  flex-wrap: wrap;
}
.sender-name {
  color: #1e293b;
  font-weight: 700;
}
.sender-address {
  color: #64748b;
  font-family: monospace;
}
.recipient-meta {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 2px;
}
.recipient-addr {
  color: #64748b;
}
.email-date-time {
  font-size: 0.75rem;
  color: #64748b;
}
.email-body-content {
  padding: 24px;
  background-color: #ffffff;
  color: #334155;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  border-bottom-left-radius: 11px;
  border-bottom-right-radius: 11px;
}

/* Premium Document Mockup Client */
.hotspot-document-client {
  background-color: #ffffff;
  color: #1e293b;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  text-align: left;
}
.document-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background-color: #f8fafc;
  border-top-left-radius: 11px;
  border-top-right-radius: 11px;
}
.document-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: var(--accent-light);
  color: var(--accent-color);
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}
.document-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a !important;
  border: none !important;
  padding: 0 !important;
}
.document-body-content {
  padding: 24px;
  color: #334155;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  border-bottom-left-radius: 11px;
  border-bottom-right-radius: 11px;
}

/* WhatsApp Chat Simulator Styling */
.chat-sim-block {
  display: flex;
  gap: 32px;
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.smartphone-container {
  width: 320px;
  height: 520px;
  background-color: #000000;
  border-radius: 36px;
  padding: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  border: 4px solid #334155;
  flex-shrink: 0;
}
.phone-screen {
  width: 100%;
  height: 100%;
  background-color: #efeae2; /* WhatsApp background */
  border-radius: 26px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}
.phone-status-bar {
  background-color: #075e54;
  color: #ffffff;
  font-size: 0.65rem;
  padding: 4px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
.status-icons {
  display: flex;
  gap: 4px;
}
.chat-app-header {
  background-color: #075e54;
  color: #ffffff;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  user-select: none;
}
.chat-back-arrow {
  font-size: 1.1rem;
  font-weight: bold;
}
.chat-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--accent-color);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}
.chat-sender-info {
  flex-grow: 1;
}
.chat-sender-name {
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}
.chat-sender-status {
  font-size: 0.6rem;
  opacity: 0.8;
}
.chat-header-actions {
  font-size: 1rem;
}
.chat-messages-viewport {
  flex-grow: 1;
  padding: 14px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.chat-bubble-row {
  display: flex;
  width: 100%;
}
.chat-bubble-row.row-them {
  justify-content: flex-start;
}
.chat-bubble-row.row-me {
  justify-content: flex-end;
}
.chat-bubble {
  max-width: 80%;
  padding: 8px 12px;
  font-size: 0.8rem;
  line-height: 1.4;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
}
.bubble-them {
  background-color: #ffffff;
  color: #000000;
  border-radius: 0 10px 10px 10px;
}
.bubble-me {
  background-color: #dcf8c6;
  color: #000000;
  border-radius: 10px 0 10px 10px;
}
.chat-attachment-bubble {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 10px;
  width: 220px;
}
.attachment-icon-pill {
  display: flex;
  align-items: center;
  gap: 10px;
}
.attachment-icon-pill svg {
  color: #ef4444; /* red icon for warning/file */
  flex-shrink: 0;
}
.attachment-details {
  display: flex;
  flex-direction: column;
}
.attachment-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e293b;
  word-break: break-all;
}
.attachment-size {
  font-size: 0.6rem;
  color: #64748b;
}

.chat-interaction-panel {
  flex-grow: 1;
  flex-basis: 300px;
}
.chat-panel-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 16px;
}
.chat-choices-layout {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chat-choice-btn {
  background-color: rgba(255,255,255,0.03);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 14px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}
.chat-choice-btn:hover:not(.disabled) {
  border-color: var(--accent-color);
  background-color: var(--accent-light);
}
.chat-choice-btn.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.chat-choice-btn.choice-success {
  border-color: var(--success-color);
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
  opacity: 1;
}
.chat-choice-btn.choice-danger {
  border-color: var(--error-color);
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  opacity: 1;
}
.chat-choices-feedback {
  margin-top: 20px;
}
.feedback-card {
  padding: 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  line-height: 1.5;
}
.feedback-card.card-success {
  background-color: rgba(16, 185, 129, 0.08);
  border-left: 4px solid var(--success-color);
  color: #10b981;
}
.feedback-card.card-danger {
  background-color: rgba(239, 68, 68, 0.08);
  border-left: 4px solid var(--error-color);
  color: #ef4444;
}

/* Password Strength Meter Styling */
.pwd-meter-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.pwd-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}
.pwd-simulator-panel {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pwd-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.pwd-sim-input {
  width: 100%;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 12px 48px 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
}
.pwd-sim-input:focus {
  border-color: var(--accent-color);
}
.pwd-visibility-toggle {
  position: absolute;
  right: 16px;
  cursor: pointer;
  font-size: 1rem;
  user-select: none;
}
.pwd-strength-indicator {
  display: flex;
  gap: 6px;
  width: 100%;
}
.strength-bar {
  flex-grow: 1;
  height: 6px;
  background-color: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}
.strength-bar-fill {
  height: 100%;
  width: 0%;
  transition: width 0.3s ease, background-color 0.3s ease;
}
.strength-bar-fill.weak {
  background-color: var(--error-color);
}
.strength-bar-fill.medium {
  background-color: #fbbf24; /* yellow */
}
.strength-bar-fill.strong {
  background-color: var(--success-color);
}
.pwd-strength-label {
  font-size: 0.85rem;
  font-weight: 600;
}
.strength-label-text.weak {
  color: var(--error-color);
}
.strength-label-text.medium {
  color: #fbbf24;
}
.strength-label-text.strong {
  color: var(--success-color);
}
.pwd-suggestions-box {
  background-color: rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 14px;
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--text-muted);
}
.suggest-warn {
  color: #fbbf24;
  font-weight: 700;
  display: block;
  margin-bottom: 4px;
}
.suggest-ok {
  color: var(--success-color);
  font-weight: 700;
}
.pwd-suggestions-box ul {
  padding-left: 18px;
  margin-top: 4px;
}

/* Visual Hotspot Desk Game Styling */
.visual-hotspot-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.visual-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}
.visual-game-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.visual-image-container-frame {
  width: 100%;
  background-color: #f1f5f9;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}
.visual-image-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.visual-bg-image {
  width: 100%;
  height: auto;
  display: block;
}
.hazard-pin-overlay {
  position: absolute;
  width: 28px;
  height: 28px;
  cursor: pointer;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.pin-marker-pulse {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--accent-color);
  opacity: 0.4;
  animation: pin-pulse 1.8s infinite ease-in-out;
  pointer-events: none;
}
.pin-marker-icon {
  color: var(--accent-color);
  font-size: 1.5rem;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, color 0.2s ease;
}
.pin-marker-number {
  position: absolute;
  font-size: 0.65rem;
  font-weight: 800;
  color: #ffffff;
  pointer-events: none;
  z-index: 2;
  margin-top: -1px;
}
.hazard-pin-overlay:hover .pin-marker-icon {
  transform: scale(1.2);
}
.hazard-pin-overlay.found .pin-marker-icon {
  color: var(--success-color);
}
.hazard-pin-overlay.found .pin-marker-pulse {
  background-color: var(--success-color);
  animation: none;
  opacity: 0.25;
}

@keyframes pin-pulse {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
.visual-game-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.visual-progress-meter {
  font-size: 0.95rem;
  font-weight: 700;
}
.visual-progress-meter span {
  color: var(--accent-color);
}
.visual-hazards-explanation-box {
  background-color: rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 14px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-muted);
}
.hazard-explanation-entry strong {
  color: var(--success-color);
}
.visual-success-banner {
  background-color: rgba(16, 185, 129, 0.08);
  border: 1px solid var(--success-color);
  border-radius: 8px;
  padding: 16px;
  color: var(--success-color);
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: center;
}

/* Phishing Simulator Styling */
.email-phishing-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.email-client-container {
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.email-action-bar {
  background-color: var(--bg-sidebar);
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  gap: 8px;
}
.email-btn {
  background-color: var(--bg-primary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}
.email-btn:hover:not(.disabled) {
  border-color: var(--accent-color);
  color: var(--accent-color);
}
.email-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.email-btn-report { color: #f59e0b; }
.email-btn-delete { color: #ef4444; }
.email-btn-safe { color: #10b981; }

.email-header-pane {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}
.email-subject-line {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 12px;
}
.email-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}
.email-sender-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.email-sender-avatar {
  width: 32px;
  height: 32px;
  background-color: var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}
.sender-name {
  font-weight: 700;
  color: var(--text-color);
}
.sender-email {
  color: var(--text-muted);
}
.email-date-info {
  color: var(--text-muted);
}

.email-details-container {
  margin-top: 10px;
}
.details-toggle-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
}
.details-collapse-panel {
  margin-top: 8px;
  background-color: rgba(0,0,0,0.2);
  padding: 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-family: monospace;
  border: 1px solid var(--border-color);
}
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
}
.details-grid span {
  padding: 1px 4px;
  border-radius: 4px;
  font-weight: bold;
}
.badge-pass { background-color: rgba(16,185,129,0.2); color: #10b981; }
.badge-fail { background-color: rgba(239,68,68,0.2); color: #ef4444; }
.badge-none { background-color: rgba(107,114,128,0.2); color: #9ca3af; }

.email-body-pane {
  padding: 24px;
  font-size: 0.9rem;
  line-height: 1.6;
  background-color: #ffffff;
  color: #1e293b;
  min-height: 150px;
}

.phishing-feedback-box {
  margin-top: 16px;
  border-radius: 8px;
  padding: 16px;
  background-color: rgba(0,0,0,0.1);
  border: 1px solid var(--border-color);
}
.feedback-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 6px;
}
.feedback-indicator.correct { color: var(--success-color); }
.feedback-indicator.incorrect { color: #f59e0b; }
.feedback-explanation {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-muted);
}

/* Branching Dialogue Simulator Styling */
.dialogue-branching-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.dialogue-game-container {
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
}
.dialogue-meter-header {
  background-color: var(--bg-sidebar);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.meter-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}
.meter-track {
  flex-grow: 1;
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}
.meter-fill {
  height: 100%;
  background-color: #ef4444;
  width: 0%;
  transition: width 0.4s ease;
}
.meter-value {
  font-size: 0.8rem;
  font-weight: 700;
}
.dialogue-chat-stage {
  padding: 20px;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.dialogue-bubble-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.dialogue-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.1rem;
}
.dialogue-bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  line-height: 1.5;
}
.bubble-them {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-top-left-radius: 2px;
}
.bubble-me {
  background-color: var(--accent-color);
  color: #fff;
  border-top-right-radius: 2px;
}
.dialogue-feedback-row {
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid #f59e0b;
  color: #fbbf24;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  line-height: 1.4;
  margin-top: 8px;
  animation: slide-down 0.3s ease;
}
.dialogue-choices-pane {
  background-color: var(--bg-sidebar);
  padding: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dialogue-choice-btn {
  background-color: var(--bg-primary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  text-align: left;
  transition: all 0.2s ease;
}
.dialogue-choice-btn:hover {
  border-color: var(--accent-color);
  background-color: rgba(99, 102, 241, 0.05);
}
.dialogue-end-banner {
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  font-size: 0.85rem;
}
.dialogue-end-banner.win {
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--success-color);
  color: var(--success-color);
}
.dialogue-end-banner.lose {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #ef4444;
}
.dialogue-reset-btn {
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 10px;
}

/* Workspace Clean Desk Inspector Styling */
.workspace-clean-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.clean-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}
.clean-game-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.clean-image-container-frame {
  width: 100%;
  background-color: #f1f5f9;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}
.clean-image-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.clean-bg-image {
  width: 100%;
  height: auto;
  display: block;
}
.clean-pin-overlay {
  position: absolute;
  width: 28px;
  height: 28px;
  cursor: pointer;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.clean-pulse {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f59e0b;
  opacity: 0.4;
  animation: pin-pulse 1.8s infinite ease-in-out;
  pointer-events: none;
}
.clean-icon {
  color: #f59e0b;
  font-size: 1.5rem;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
.clean-pin-overlay.cleared .clean-icon {
  color: var(--success-color);
}
.clean-pin-overlay.cleared .clean-pulse {
  background-color: var(--success-color);
  animation: none;
  opacity: 0.25;
}
.clean-game-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}
.clean-progress-meter {
  font-size: 0.95rem;
  font-weight: 700;
}
.clean-progress-meter span {
  color: var(--accent-color);
}
.clean-action-overlay {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 14px;
  animation: slide-down 0.2s ease;
}
.clean-action-overlay h4 {
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 8px;
}
.clean-options-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.clean-opt-btn {
  background-color: var(--bg-primary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}
.clean-opt-btn:hover {
  border-color: var(--accent-color);
}
.clean-feedback-box {
  background-color: rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 14px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-muted);
}
.clean-success-banner {
  background-color: rgba(16, 185, 129, 0.08);
  border: 1px solid var(--success-color);
  border-radius: 8px;
  padding: 16px;
  color: var(--success-color);
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: center;
}

/* Tinder-style Threat Swipe Deck Game Styling */
.swipe-deck-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.swipe-game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
.swipe-deck-score {
  font-size: 0.9rem;
  font-weight: 700;
  align-self: flex-start;
}
.swipe-cards-stack-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.swipe-card {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.5;
}
.swipe-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.swipe-actions-bar {
  display: flex;
  gap: 12px;
  width: 100%;
}
.swipe-action-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.2s ease;
}
.swipe-action-btn:hover {
  opacity: 0.9;
}
.btn-swipe-left {
  background-color: var(--success-color);
  color: #fff;
}
.btn-swipe-right {
  background-color: #ef4444;
  color: #fff;
}
.swipe-card-explanation-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 20;
}
.explain-header {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 8px;
}
.explain-header.correct { color: var(--success-color); }
.explain-header.incorrect { color: #ef4444; }
.explain-text {
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 12px;
  color: var(--text-muted);
}
.swipe-next-btn {
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
}
.swipe-end-card {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}
.swipe-reset-btn {
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

/* General Interactive Learning Components Styling */

/* 1. Timeline Slider Block */
.timeline-slider-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.timeline-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}
.timeline-slider-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.timeline-track-wrapper {
  position: relative;
  height: 6px;
  background-color: color-mix(in srgb, var(--text-main) 10%, transparent);
  border-radius: 3px;
  margin: 30px 20px;
}
.timeline-progress-line {
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  background-color: var(--accent-color);
  border-radius: 3px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.timeline-dots-row {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}
.timeline-step-dot {
  pointer-events: auto;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--bg-sidebar);
  border: 2px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;
  color: var(--text-muted);
}
.timeline-step-dot:hover {
  border-color: var(--accent-color);
  color: var(--text-main);
  transform: scale(1.1);
}
.timeline-step-dot.active {
  border-color: var(--accent-color);
  background-color: var(--accent-color);
  color: #fff;
  box-shadow: 0 0 10px var(--accent-color);
}
.dot-num {
  font-size: 10px;
  font-weight: 700;
}
.dot-label {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: normal;
  line-height: 1.2;
  text-align: center;
  width: 80px;
  word-wrap: break-word;
  transition: color 0.2s ease;
}
.timeline-step-dot.active .dot-label {
  color: var(--accent-color);
}
.timeline-content-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.timeline-content-card h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--accent-color);
}
.timeline-body-text {
  font-size: 0.9rem;
  line-height: 1.6;
}
.timeline-nav-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.timeline-nav-btn {
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s ease;
}
.timeline-nav-btn:hover:not(:disabled) {
  opacity: 0.9;
}
.timeline-nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.timeline-progress-text {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* 2. Drag & Drop Categorizer Block */
.drag-drop-sort-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.drag-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}
.drag-game-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.drag-score-banner {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--accent-color);
  align-self: flex-start;
}
.drag-columns-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.drag-column {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
}
.drag-column h4 {
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}
.drag-column-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.drag-card {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px 16px;
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  user-select: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.drag-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  border-color: var(--accent-color);
}
.drag-card:active {
  cursor: grabbing;
}
.drag-item.placed {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.85rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  animation: slide-down 0.2s ease;
}
.drag-item.placed.correct {
  border-left: 4px solid var(--success-color);
}
.drag-item.placed.incorrect {
  border-left: 4px solid var(--error-color);
}
.drag-item-text {
  font-weight: 600;
}
.drag-item-feedback {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 4px;
}
.drag-deck-section {
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
}
.drag-deck-section h5 {
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.drag-deck-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background-color: rgba(0,0,0,0.1);
  padding: 12px;
  border-radius: 8px;
  min-height: 60px;
  align-items: center;
}
.drag-finished-banner {
  text-align: center;
  padding: 16px;
  background-color: rgba(16, 185, 129, 0.08);
  border: 1px solid var(--success-color);
  border-radius: 8px;
  color: var(--success-color);
  font-weight: 600;
}

/* 3. Multi-Meter Scenario Block */
.scenario-meters-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.scenario-meter-item {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.scenario-meter-lbl {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}
.scenario-meter-track {
  height: 6px;
  background-color: color-mix(in srgb, var(--text-main) 10%, transparent);
  border-radius: 3px;
  overflow: hidden;
}
.scenario-meter-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.scenario-meter-val {
  font-size: 0.8rem;
  font-weight: 700;
  align-self: flex-end;
}

/* 4. Exploded Blueprint Block */
.blueprint-inspector-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.blueprint-game-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}
.blueprint-image-container-frame {
  width: 100%;
  background-color: #0f172a;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  position: relative;
}
.blueprint-image-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.blueprint-bg-image {
  width: 100%;
  height: auto;
  display: block;
}
.bp-pin-overlay {
  position: absolute;
  width: 28px;
  height: 28px;
  cursor: pointer;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.bp-marker-pulse {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--accent-color);
  opacity: 0.4;
  animation: pin-pulse 1.8s infinite ease-in-out;
  pointer-events: none;
}
.bp-marker-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--bg-sidebar);
  border: 2px solid var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
  font-size: 0.8rem;
  font-weight: 700;
  position: absolute;
  transition: all 0.2s ease;
}
.bp-pin-overlay:hover .bp-marker-icon {
  transform: scale(1.1);
  box-shadow: 0 0 8px var(--accent-color);
}
.bp-pin-overlay.clicked .bp-marker-icon {
  background-color: var(--accent-color);
  color: #fff;
}
.bp-pin-overlay.clicked .bp-marker-pulse {
  animation: none;
  opacity: 0.15;
}
.blueprint-info-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}
.blueprint-progress-meter {
  font-size: 0.95rem;
  font-weight: 700;
}
.blueprint-progress-meter span {
  color: var(--accent-color);
}
.blueprint-feedback-box {
  background-color: rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 14px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-muted);
  flex-grow: 1;
}

/* 5. Variable Graph Block */
.variable-graph-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.graph-game-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  align-items: center;
}
.graph-chart-viewport {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
}
.graph-svg-canvas {
  width: 100%;
  height: auto;
  display: block;
}
.graph-sliders-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.graph-slider-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.graph-slider-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
}
.graph-slider-label strong {
  color: var(--accent-color);
}
.graph-slider-range {
  width: 100%;
  accent-color: var(--accent-color);
  cursor: pointer;
}

/* 6. Memory Match Game Block */
.memory-match-block {
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
}
.memory-game-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.memory-stats-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 700;
}
.memory-stats-header strong {
  color: var(--accent-color);
}
.memory-grid-canvas {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.memory-card-wrapper {
  aspect-ratio: 4/3;
  perspective: 1000px;
}
.memory-card {
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.memory-card.flipped, .memory-card.matched {
  transform: rotateY(180deg);
}
.memory-card.matched {
  cursor: default;
}
.memory-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}
.memory-card-front, .memory-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: border-color 0.2s ease;
}
.memory-card-front {
  background-color: var(--bg-primary);
}
.memory-card-front:hover {
  border-color: var(--accent-color);
}
.memory-card-back {
  background-color: var(--accent-light);
  transform: rotateY(180deg);
}
.memory-card.matched .memory-card-back {
  border-color: var(--success-color);
  background-color: rgba(16, 185, 129, 0.08);
}
.memory-card.matched .memory-card-text {
  color: var(--success-color);
}
.memory-card-text {
  font-size: 0.75rem;
  text-align: center;
  font-weight: 600;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.memory-success-banner {
  text-align: center;
  padding: 16px;
  background-color: rgba(16, 185, 129, 0.08);
  border: 1px solid var(--success-color);
  border-radius: 8px;
  color: var(--success-color);
  font-weight: 600;
}
.memory-reset-btn {
  display: block;
  margin: 12px auto 0;
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.memory-reset-btn:hover {
  opacity: 0.9;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .blueprint-game-layout,
  .graph-game-container {
    grid-template-columns: 1fr;
  }
  .memory-grid-canvas {
    grid-template-columns: repeat(3, 1fr);
  }
}
}
`;
}

// SCORM API wrapper file template
export function getScormApiJs() {
  return `/**
 * Simple client-side SCORM API wrapper
 */
class ScormAPIAdapter {
  constructor(version) {
    this.version = version;
    this.api = null;
  }

  // Find the SCORM API starting from current window upwards
  findAPI(win) {
    let findAttempts = 0;
    const findAttemptsLimit = 500;
    const apiName = this.version === '1.2' ? 'API' : 'API_1484_11';

    while (win[apiName] === null || win[apiName] === undefined) {
      findAttempts++;
      if (findAttempts > findAttemptsLimit) {
        return null;
      }
      if (win.parent && win.parent !== win) {
        win = win.parent;
      } else {
        break;
      }
    }
    return win[apiName] || null;
  }

  initialize() {
    this.api = this.findAPI(window);
    if (!this.api && window.opener) {
      this.api = this.findAPI(window.opener);
    }

    if (this.api) {
      if (this.version === '1.2') {
        const result = this.api.LMSInitialize("");
        return result === "true";
      } else {
        const result = this.api.Initialize("");
        return result === "true";
      }
    }
    console.warn("[SCORM] API wrapper initialized, but no LMS API discovered.");
    return false;
  }

  getValue(element) {
    if (this.api) {
      if (this.version === '1.2') {
        return this.api.LMSGetValue(element);
      } else {
        return this.api.GetValue(element);
      }
    }
    return "";
  }

  setValue(element, value) {
    if (this.api) {
      if (this.version === '1.2') {
        const result = this.api.LMSSetValue(element, value);
        return result === "true";
      } else {
        const result = this.api.SetValue(element, value);
        return result === "true";
      }
    }
    return false;
  }

  commit() {
    if (this.api) {
      if (this.version === '1.2') {
        const result = this.api.LMSCommit("");
        return result === "true";
      } else {
        const result = this.api.Commit("");
        return result === "true";
      }
    }
    return false;
  }

  terminate() {
    if (this.api) {
      if (this.version === '1.2') {
        const result = this.api.LMSFinish("");
        return result === "true";
      } else {
        const result = this.api.Terminate("");
        return result === "true";
      }
    }
    return false;
  }
}
`;
}

// Helper to escape values for manifest XML
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
