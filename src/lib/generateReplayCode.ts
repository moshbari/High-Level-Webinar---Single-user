import { WebinarConfig } from '@/types/webinar';

/**
 * Generates replay-specific embed code with full video controls.
 * Based on generateEmbedCode but with time-locking removed and controls enabled.
 */
export const generateReplayCode = (config: WebinarConfig): string => {
  const ctaBannerHtml = config.enableCta ? `
  <!-- CTA Banner -->
  <div class="cta-banner hidden" id="ctaBanner">
    <div class="cta-content">
      <div class="cta-text">
        <h3 class="cta-headline">🔥 ${config.ctaHeadline}</h3>
        <p class="cta-subheadline">${config.ctaSubheadline}</p>
      </div>
      <h3 class="cta-mobile-headline">🔥 ${config.ctaHeadline}</h3>
      <div class="cta-action">
        <a href="${config.ctaButtonUrl}" target="_blank" class="cta-button" onclick="trackCtaClick()"><span class="cta-button-text-full">${config.ctaButtonText}</span><span class="cta-button-text-short">Secure Your Spot Now →</span></a>
        ${config.ctaShowUrgency ? `<span class="cta-urgency">${config.ctaUrgencyText}</span>` : ''}
      </div>
    </div>
  </div>` : '';

  const ctaFloatingHtml = config.enableCta ? `
  <!-- CTA Floating -->
  <div class="cta-floating hidden" id="ctaFloating">
    <div class="cta-floating-badge">🎯 SPECIAL OFFER</div>
    <h3 class="cta-floating-headline">${config.ctaHeadline}</h3>
    <p class="cta-floating-subheadline">${config.ctaSubheadline}</p>
    <h3 class="cta-mobile-headline">🔥 ${config.ctaHeadline}</h3>
    <a href="${config.ctaButtonUrl}" target="_blank" class="cta-button" onclick="trackCtaClick()"><span class="cta-button-text-full">${config.ctaButtonText}</span><span class="cta-button-text-short">Secure Your Spot Now →</span></a>
    ${config.ctaShowUrgency ? `<span class="cta-urgency">${config.ctaUrgencyText}</span>` : ''}
  </div>` : '';

  const ctaStyles = config.enableCta ? `
    .cta-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 380px;
      background: linear-gradient(90deg, rgba(20,20,30,0.98) 0%, rgba(30,30,45,0.98) 100%);
      border-top: 1px solid var(--border);
      padding: 1rem 2rem;
      z-index: 150;
      animation: slideUp 0.5s ease;
    }
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    .cta-banner.hidden { display: none; }
    .cta-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      gap: 2rem;
    }
    .cta-text { flex: 1; }
    .cta-headline { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; }
    .cta-subheadline { color: var(--text-muted); font-size: 0.9rem; }
    .cta-action { display: flex; align-items: center; gap: 1rem; }
    .cta-button {
      background: ${config.ctaButtonColor};
      color: white;
      padding: 0.875rem 2rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(229,57,53,0.4);
    }
    .cta-urgency { color: #fbbf24; font-weight: 600; font-size: 0.9rem; }
    .cta-mobile-headline { display: none; }
    .cta-button-text-full { display: inline; }
    .cta-button-text-short { display: none; }
    .cta-floating {
      position: fixed;
      right: 400px;
      bottom: 1rem;
      background: linear-gradient(180deg, rgba(30,30,45,0.98) 0%, rgba(20,20,30,0.98) 100%);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.5rem;
      width: 280px;
      z-index: 150;
      animation: slideUp 0.5s ease;
    }
    .cta-floating.hidden { display: none; }
    .cta-floating-badge { background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; display: inline-block; margin-bottom: 1rem; }
    .cta-floating-headline { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .cta-floating-subheadline { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.25rem; line-height: 1.5; }
    .cta-floating .cta-button { display: block; text-align: center; width: 100%; margin-bottom: 0.75rem; }
    .cta-floating .cta-urgency { display: block; text-align: center; font-size: 0.8rem; }
    @media (max-width: 768px) {
      .cta-banner { position: relative; width: 100%; background: #111111; border-top: 1px solid rgba(255, 255, 255, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 16px; z-index: 1; text-align: center; bottom: auto; left: auto; right: auto; box-shadow: none; }
      .cta-content { flex-direction: column; text-align: center; gap: 12px; align-items: stretch; }
      .cta-text { display: none; }
      .cta-headline { display: none; }
      .cta-subheadline { display: none; }
      .cta-mobile-headline { display: block; font-size: 16px; font-weight: 700; color: #ffffff; text-align: center; margin: 0 0 12px 0; line-height: 1.3; }
      .cta-button-text-full { display: none; }
      .cta-button-text-short { display: inline; }
      .cta-action { flex-direction: column; width: 100%; gap: 8px; align-items: center; }
      .cta-button { display: block; width: 100%; height: 48px; padding: 0 24px; font-size: 16px; font-weight: 700; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4); border-radius: 10px; text-align: center; line-height: 48px; }
      .cta-urgency { display: block; font-size: 12px; font-weight: 500; color: #fbbf24; text-align: center; }
      .cta-floating { position: relative; width: 100%; border-radius: 0; background: #111111; border-top: 1px solid rgba(255, 255, 255, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 16px; text-align: center; bottom: auto; left: auto; right: auto; box-shadow: none; }
      .cta-floating .cta-mobile-headline { display: block; font-size: 16px; font-weight: 700; color: #ffffff; text-align: center; margin: 0 0 12px 0; line-height: 1.3; }
      .cta-floating .cta-button { height: 48px; line-height: 48px; padding: 0 24px; }
      .cta-floating-badge { display: none; }
      .cta-floating-headline { display: none; }
      .cta-floating-subheadline { display: none; }
      .cta-floating .cta-urgency { font-size: 12px; margin-top: 8px; }
    }
  ` : '';

  const ctaScript = config.enableCta ? `
    let ctaShown = false;
    
    function checkCta() {
      if (ctaShown) return;
      const video = document.getElementById('webinarVideo');
      if (!video) return;
      const currentSeconds = video.currentTime || 0;
      if (currentSeconds >= ${config.ctaShowAfterSeconds}) {
        showCta();
        ctaShown = true;
      }
    }
    
    function showCta() {
      const style = '${config.ctaStyle}';
      if (style === 'banner') {
        document.getElementById('ctaBanner').classList.remove('hidden');
      } else {
        document.getElementById('ctaFloating').classList.remove('hidden');
      }
    }
    
    async function trackCtaClick() {
      const video = document.getElementById('webinarVideo');
      const minutesWatched = Math.floor((video?.currentTime || 0) / 60);
      try {
        await fetch(CONFIG.supabaseUrl + '/functions/v1/save-cta-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webinar_id: CONFIG.webinarId,
            lead_id: leadId,
            button_text: CONFIG.ctaButtonText,
            button_url: CONFIG.ctaButtonUrl,
            minutes_watched: minutesWatched
          })
        });
      } catch (error) {
        console.error('Failed to track CTA:', error);
      }
    }
    
    setInterval(checkCta, 1000);
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.headerTitle} - Replay</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
    :root {
      --primary: ${config.primaryColor};
      --bg: ${config.backgroundColor};
      --chat-bg: ${config.chatBackground};
      --text: #ffffff;
      --text-muted: #9ca3af;
      --border: rgba(255,255,255,0.1);
    }
    html, body { height: 100%; height: -webkit-fill-available; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 0;
      overflow: hidden;
      min-height: 100vh;
      min-height: 100dvh;
    }
    h1, h2, h3 { font-family: 'Space Grotesk', system-ui, sans-serif; }
    .webinar-container {
      display: flex;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      width: 100vw; height: 100vh; height: 100dvh;
    }
    @media (max-width: 768px) {
      .webinar-container { flex-direction: column; }
    }
    .video-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg);
      min-width: 0;
      position: relative;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    @media (max-width: 768px) {
      .header { display: none; }
    }
    .logo-section { display: flex; align-items: center; gap: 0.75rem; }
    .logo-circle {
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--primary);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1.1rem;
    }
    .header-title { font-size: 1.1rem; font-weight: 600; }
    .replay-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
      padding: 0.4rem 1rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .viewer-count { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.9rem; }
    .video-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      position: relative;
      min-height: 0;
    }
    @media (max-width: 768px) {
      .video-wrapper { flex: none; height: 40vh; min-height: 200px; }
    }
    video {
      width: 100%; height: 100%;
      object-fit: contain;
      background: #000;
    }
    .video-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1.5rem;
      background: rgba(0,0,0,0.8);
      border-top: 1px solid var(--border);
    }
    .play-pause-btn {
      background: var(--primary);
      border: none;
      border-radius: 50%;
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .play-pause-btn:hover { transform: scale(1.1); }
    .play-pause-btn svg { width: 20px; height: 20px; fill: white; }
    .volume-container { display: flex; align-items: center; gap: 0.5rem; }
    .volume-btn {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
    }
    .volume-btn svg { width: 20px; height: 20px; }
    .volume-slider {
      width: 80px;
      height: 4px;
      -webkit-appearance: none;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      cursor: pointer;
    }
    .volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px; height: 12px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
    }
    .progress-container {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .progress-bar {
      flex: 1;
      height: 6px;
      background: rgba(255,255,255,0.2);
      border-radius: 3px;
      cursor: pointer;
      position: relative;
    }
    .progress-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 3px;
      transition: width 0.1s;
    }
    .time-display { color: var(--text-muted); font-size: 0.85rem; white-space: nowrap; }
    .speed-selector {
      background: rgba(255,255,255,0.1);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: white;
      padding: 0.4rem 0.6rem;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .fullscreen-btn {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
    }
    .fullscreen-btn svg { width: 20px; height: 20px; }
    .chat-section {
      width: 380px;
      display: flex;
      flex-direction: column;
      background: var(--chat-bg);
      border-left: 1px solid var(--border);
    }
    @media (max-width: 768px) {
      .chat-section { width: 100%; flex: 1; border-left: none; border-top: 1px solid var(--border); }
    }
    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .chat-title { font-weight: 600; }
    .ai-badge { background: rgba(59, 130, 246, 0.2); color: #60a5fa; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .message {
      display: flex;
      gap: 0.75rem;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .message-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 0.9rem;
      flex-shrink: 0;
    }
    .message-avatar.bot { background: var(--primary); }
    .message-avatar.user { background: #374151; }
    .message-content { flex: 1; min-width: 0; }
    .message-name { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem; }
    .message-text { color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; word-wrap: break-word; }
    .lead-form, .chat-input-form {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border);
    }
    .lead-form h3 { font-size: 1rem; margin-bottom: 0.75rem; }
    .lead-input {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: white;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }
    .lead-input::placeholder { color: var(--text-muted); }
    .lead-submit, .chat-submit {
      width: 100%;
      background: var(--primary);
      border: none;
      border-radius: 8px;
      padding: 0.75rem;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .lead-submit:hover, .chat-submit:hover { opacity: 0.9; }
    .chat-input-form { display: none; }
    .chat-input-form.active { display: flex; gap: 0.75rem; }
    .chat-input {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: white;
      font-size: 0.9rem;
    }
    .chat-submit { width: auto; padding: 0.75rem 1.5rem; }
    .typing-indicator {
      display: flex;
      gap: 0.75rem;
      padding: 0 1.5rem 1rem;
    }
    .typing-indicator.hidden { display: none; }
    .typing-dots {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .typing-dot {
      width: 8px; height: 8px;
      background: var(--text-muted);
      border-radius: 50%;
      animation: typingBounce 1.4s infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }
    ${ctaStyles}
  </style>
</head>
<body>
  <div class="webinar-container" id="webinarRoom">
    <div class="video-section">
      <div class="header">
        <div class="logo-section">
          <div class="logo-circle">${config.logoText}</div>
          <span class="header-title">${config.headerTitle}</span>
        </div>
        <div class="replay-badge">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4"/></svg>
          REPLAY
        </div>
        <div class="viewer-count">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span id="viewerCount">0</span> views
        </div>
      </div>
      <div class="video-wrapper">
        <video id="webinarVideo" playsinline preload="metadata">
          <source src="${config.videoUrl}" type="video/mp4">
        </video>
      </div>
      <div class="video-controls">
        <button class="play-pause-btn" id="playPauseBtn" onclick="togglePlayPause()">
          <svg id="playIcon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <svg id="pauseIcon" viewBox="0 0 24 24" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        </button>
        <div class="volume-container">
          <button class="volume-btn" onclick="toggleMute()">
            <svg id="volumeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            <svg id="mutedIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          </button>
          <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="100" oninput="setVolume(this.value)">
        </div>
        <div class="progress-container">
          <span class="time-display" id="currentTime">0:00</span>
          <div class="progress-bar" id="progressBar" onclick="seekTo(event)">
            <div class="progress-fill" id="progressFill"></div>
          </div>
          <span class="time-display" id="duration">0:00</span>
        </div>
        <select class="speed-selector" id="speedSelector" onchange="setSpeed(this.value)">
          <option value="0.5">0.5x</option>
          <option value="1" selected>1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
        <button class="fullscreen-btn" onclick="toggleFullscreen()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        </button>
      </div>
      ${ctaBannerHtml}
    </div>
    <div class="chat-section">
      <div class="chat-header">
        <span class="chat-title">Chat with Us</span>
        <span class="ai-badge">🤖 AI</span>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="typing-indicator hidden" id="typingIndicator">
        <div class="message-avatar bot">${config.botAvatar}</div>
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
      <form class="lead-form" id="leadForm">
        <h3>Join the conversation</h3>
        ${config.requireName ? `<input type="text" class="lead-input" id="leadName" placeholder="Your name" required>` : ''}
        ${config.requireEmail ? `<input type="email" class="lead-input" id="leadEmail" placeholder="Your email" required>` : ''}
        <button type="submit" class="lead-submit">Start Chatting</button>
      </form>
      <form class="chat-input-form" id="chatInputForm">
        <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
        <button type="submit" class="chat-submit">Send</button>
      </form>
    </div>
    ${ctaFloatingHtml}
  </div>
  <script>
    const CONFIG = {
      webinarId: '${config.id}',
      webinarName: '${config.webinarName.replace(/'/g, "\\'")}',
      botName: '${config.botName}',
      botAvatar: '${config.botAvatar}',
      webhookUrl: '${config.webhookUrl}',
      typingDelayMin: ${config.typingDelayMin},
      typingDelayMax: ${config.typingDelayMax},
      errorMessage: '${config.errorMessage.replace(/'/g, "\\'")}',
      ctaButtonText: '${config.ctaButtonText.replace(/'/g, "\\'")}',
      ctaButtonUrl: '${config.ctaButtonUrl}',
      welcomeMessage: '${config.welcomeMessage.replace(/'/g, "\\'")}',
      leadWebhookUrl: '${config.leadWebhookUrl}',
      supabaseUrl: 'https://xidtgjtbhskltygixljs.supabase.co',
      minViewers: ${config.minViewers},
      maxViewers: ${config.maxViewers}
    };

    let userData = null;
    let leadId = null;
    let seenReplyIds = new Set();
    let replyPollingId = null;

    const video = document.getElementById('webinarVideo');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');

    // Initialize video
    video.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(video.duration);
      updateViewerCount();
    });

    video.addEventListener('timeupdate', () => {
      const progress = (video.currentTime / video.duration) * 100;
      progressFill.style.width = progress + '%';
      currentTimeEl.textContent = formatTime(video.currentTime);
    });

    video.addEventListener('play', () => {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    });

    video.addEventListener('pause', () => {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    });

    function formatTime(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      if (h > 0) {
        return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      }
      return m + ':' + String(s).padStart(2, '0');
    }

    function togglePlayPause() {
      if (video.paused) {
        video.play();
        trackJoinOnce();
      } else {
        video.pause();
      }
    }

    function toggleMute() {
      video.muted = !video.muted;
      updateVolumeIcon();
    }

    function setVolume(value) {
      video.volume = value / 100;
      if (value == 0) {
        video.muted = true;
      } else if (video.muted) {
        video.muted = false;
      }
      updateVolumeIcon();
    }

    function updateVolumeIcon() {
      const volumeIcon = document.getElementById('volumeIcon');
      const mutedIcon = document.getElementById('mutedIcon');
      const slider = document.getElementById('volumeSlider');
      if (video.muted || video.volume === 0) {
        volumeIcon.style.display = 'none';
        mutedIcon.style.display = 'block';
        slider.value = 0;
      } else {
        volumeIcon.style.display = 'block';
        mutedIcon.style.display = 'none';
        slider.value = video.volume * 100;
      }
    }

    function seekTo(e) {
      const bar = document.getElementById('progressBar');
      const rect = bar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
    }

    function setSpeed(value) {
      video.playbackRate = parseFloat(value);
    }

    function toggleFullscreen() {
      const wrapper = document.querySelector('.video-wrapper');
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        wrapper.requestFullscreen();
      }
    }

    function updateViewerCount() {
      const count = Math.floor(Math.random() * (CONFIG.maxViewers - CONFIG.minViewers + 1)) + CONFIG.minViewers;
      document.getElementById('viewerCount').textContent = count;
    }

    // Tracking
    let hasTrackedJoin = false;
    let lastProgressMilestone = 0;

    function generateSessionId() {
      return 'replay_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    const sessionId = generateSessionId();

    async function sendTrackingEvent(eventType, extra = {}) {
      const payload = {
        webinar_id: CONFIG.webinarId,
        webinar_name: CONFIG.webinarName,
        user_name: userData?.name || 'Anonymous',
        user_email: userData?.email || 'anonymous@replay.local',
        event_type: eventType,
        session_id: sessionId,
        device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        source: 'replay',
        ...extra
      };
      try {
        await fetch(CONFIG.supabaseUrl + '/functions/v1/track-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.error('Tracking error:', e);
      }
    }

    function trackJoinOnce() {
      if (hasTrackedJoin) return;
      hasTrackedJoin = true;
      sendTrackingEvent('join');
    }

    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      const pct = Math.floor((video.currentTime / video.duration) * 100);
      const milestones = [25, 50, 75, 100];
      for (const m of milestones) {
        if (pct >= m && lastProgressMilestone < m) {
          lastProgressMilestone = m;
          sendTrackingEvent('progress_' + m, {
            watch_percent: m,
            watch_minutes: Math.floor(video.currentTime / 60)
          });
        }
      }
    });

    // Lead form
    async function saveLeadToDb(name, email) {
      try {
        const resp = await fetch(CONFIG.supabaseUrl + '/functions/v1/save-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ webinar_id: CONFIG.webinarId, name, email })
        });
        const data = await resp.json();
        return data.lead_id || null;
      } catch (e) {
        console.error('Failed to save lead:', e);
        return null;
      }
    }

    document.getElementById('leadForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('leadName')?.value.trim() || 'Guest';
      const email = document.getElementById('leadEmail')?.value.trim() || '';
      userData = { name, email };
      leadId = await saveLeadToDb(name, email);
      localStorage.setItem('webinar_lead_' + CONFIG.webinarId, JSON.stringify({ userData, leadId }));
      showChatInput();
      startReplyPolling();
      if (CONFIG.leadWebhookUrl) {
        fetch(CONFIG.leadWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'lead_capture', name, email, webinarName: CONFIG.webinarName, timestamp: new Date().toISOString(), source: 'replay' })
        }).catch(() => {});
      }
      const welcome = CONFIG.welcomeMessage.replace('{name}', name);
      addMessage(welcome, 'bot');
    });

    function showChatInput() {
      document.getElementById('leadForm').style.display = 'none';
      document.getElementById('chatInputForm').classList.add('active');
    }

    function addMessage(text, type, name = null) {
      const container = document.getElementById('chatMessages');
      const div = document.createElement('div');
      div.className = 'message';
      const avatar = type === 'bot' ? CONFIG.botAvatar : (userData?.name?.charAt(0).toUpperCase() || 'U');
      const displayName = type === 'bot' ? CONFIG.botName : (name || userData?.name || 'You');
      div.innerHTML = '<div class="message-avatar ' + type + '">' + avatar + '</div><div class="message-content"><div class="message-name">' + displayName + '</div><div class="message-text">' + text + '</div></div>';
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    document.getElementById('chatInputForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const input = document.getElementById('chatInput');
      const msg = input.value.trim();
      if (!msg) return;
      input.value = '';
      addMessage(msg, 'user');
      document.getElementById('typingIndicator').classList.remove('hidden');
      sendTrackingEvent('chat_message', { chat_message: msg });
      try {
        const resp = await fetch(CONFIG.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: msg,
            userName: userData?.name || 'Guest',
            userEmail: userData?.email || '',
            webinarId: CONFIG.webinarId,
            webinarName: CONFIG.webinarName,
            leadId: leadId,
            sessionId: sessionId,
            source: 'replay'
          })
        });
        const data = await resp.json();
        const delay = (Math.random() * (CONFIG.typingDelayMax - CONFIG.typingDelayMin) + CONFIG.typingDelayMin) * 1000;
        setTimeout(() => {
          document.getElementById('typingIndicator').classList.add('hidden');
          const aiReply = data.output || data.message || data.response || data.text || CONFIG.errorMessage;
          addMessage(aiReply, 'bot');
          saveChatToDb(msg, aiReply);
        }, delay);
      } catch (err) {
        document.getElementById('typingIndicator').classList.add('hidden');
        addMessage(CONFIG.errorMessage, 'bot');
        saveChatToDb(msg, CONFIG.errorMessage);
      }
    });

    async function saveChatToDb(userMsg, aiResp) {
      try {
        await fetch(CONFIG.supabaseUrl + '/functions/v1/save-chat-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webinar_id: CONFIG.webinarId,
            lead_id: leadId,
            user_name: userData?.name || 'Guest',
            user_email: userData?.email || '',
            user_message: userMsg,
            ai_response: aiResp,
            response_type: 'ai',
            session_id: sessionId
          })
        });
      } catch (e) {
        console.error('Failed to save chat:', e);
      }
    }

    async function checkForReplies() {
      if (!sessionId) return;
      try {
        const lastSeen = localStorage.getItem('lastSeenAt_' + sessionId) || new Date(0).toISOString();
        const resp = await fetch(CONFIG.supabaseUrl + '/functions/v1/check-reply?sessionId=' + sessionId + '&lastSeenAt=' + encodeURIComponent(lastSeen));
        const data = await resp.json();
        if (data.replies && data.replies.length > 0) {
          data.replies.forEach(r => {
            if (!seenReplyIds.has(r.id)) {
              seenReplyIds.add(r.id);
              addMessage(r.ai_response, 'bot', CONFIG.botName);
            }
          });
          localStorage.setItem('lastSeenAt_' + sessionId, new Date().toISOString());
        }
      } catch (e) {
        console.error('Reply check failed:', e);
      }
    }

    function startReplyPolling() {
      if (replyPollingId) return;
      replyPollingId = setInterval(checkForReplies, 3000);
    }

    // Restore session
    const saved = localStorage.getItem('webinar_lead_' + CONFIG.webinarId);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        userData = parsed.userData;
        leadId = parsed.leadId;
        showChatInput();
        startReplyPolling();
        const welcome = CONFIG.welcomeMessage.replace('{name}', userData.name);
        addMessage(welcome, 'bot');
      } catch (e) {}
    }

    ${ctaScript}
  </script>
</body>
</html>`;
};
