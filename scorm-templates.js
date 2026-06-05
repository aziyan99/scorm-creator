/**
 * SCORM XML Manifest and Course Player Templates
 */

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
        }
      });
      
      container.innerHTML = html;

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
  margin-bottom: 32px;
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
