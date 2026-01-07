import { WebinarConfig } from '@/types/webinar';

export const generateEmbedCode = (config: WebinarConfig): string => {
  const ctaBannerHtml = config.enableCta ? `
  <!-- CTA Banner -->
  <div class="cta-banner hidden" id="ctaBanner">
    <div class="cta-content">
      <div class="cta-text">
        <h3 class="cta-headline">🔥 ${config.ctaHeadline}</h3>
        <p class="cta-subheadline">${config.ctaSubheadline}</p>
      </div>
      <div class="cta-action">
        <a href="${config.ctaButtonUrl}" target="_blank" class="cta-button" onclick="trackCtaClick()">${config.ctaButtonText}</a>
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
    <a href="${config.ctaButtonUrl}" target="_blank" class="cta-button" onclick="trackCtaClick()">${config.ctaButtonText}</a>
    ${config.ctaShowUrgency ? `<span class="cta-urgency">${config.ctaUrgencyText}</span>` : ''}
  </div>` : '';

  const ctaStyles = config.enableCta ? `
    /* CTA Banner Styles */
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
    
    .cta-headline {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    .cta-subheadline {
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    
    .cta-action {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
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
    
    .cta-urgency {
      color: #fbbf24;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    /* CTA Floating Styles */
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
    
    .cta-floating-badge {
      background: var(--primary);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      display: inline-block;
      margin-bottom: 1rem;
    }
    
    .cta-floating-headline {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .cta-floating-subheadline {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
      line-height: 1.5;
    }
    
    .cta-floating .cta-button {
      display: block;
      text-align: center;
      width: 100%;
      margin-bottom: 0.75rem;
    }
    
    .cta-floating .cta-urgency {
      display: block;
      text-align: center;
      font-size: 0.8rem;
    }
    
    @media (max-width: 768px) {
      .cta-banner {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
        padding: 0.5rem 0.75rem;
        z-index: 100;
      }
      
      .cta-content {
        flex-direction: row;
        flex-wrap: wrap;
        text-align: left;
        gap: 0.5rem;
        align-items: center;
      }
      
      .cta-text {
        flex: 1;
        min-width: 0;
      }
      
      .cta-headline {
        font-size: 0.85rem;
        margin-bottom: 0;
      }
      
      .cta-subheadline {
        display: none;
      }
      
      .cta-action {
        flex-direction: row;
        width: auto;
        gap: 0.5rem;
        align-items: center;
      }
      
      .cta-button {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
        white-space: nowrap;
      }
      
      .cta-urgency {
        font-size: 0.7rem;
      }
      
      .cta-floating {
        right: 0.5rem;
        left: 0.5rem;
        width: auto;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 4.5rem);
      }
    }
  ` : '';

  const ctaScript = config.enableCta ? `
    // CTA Logic
    let ctaShown = false;
    
    function checkCta() {
      if (ctaShown) return;
      
      const { state, elapsed } = getWebinarState();
      if (state !== 'live') return;
      
      const elapsedSeconds = elapsed || 0;
      if (elapsedSeconds >= ${config.ctaShowAfterSeconds}) {
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
      const { elapsed } = getWebinarState();
      const minutesWatched = Math.floor((elapsed || 0) / 60);
      
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
    
    // Check CTA every second during live state
    setInterval(checkCta, 1000);
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.headerTitle}</title>
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
    
    html, body {
      height: 100%;
      height: -webkit-fill-available;
    }

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
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
    }
    
    @media (max-width: 768px) {
      .webinar-container {
        flex-direction: column;
      }
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
      .header {
        display: none;
      }
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .logo-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1rem;
    }
    
    .header-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .live-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(90deg, var(--primary) 0%, #c62828 100%);
      padding: 0.4rem 1rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    
    .live-dot {
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
    
    .viewer-count {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    
    .video-wrapper {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: #000;
    }
    
    .video-wrapper video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #000;
    }
    
    .unmute-notice {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8);
      padding: 1rem 2rem;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
      text-align: center;
    }
    
    .unmute-notice svg {
      width: 32px;
      height: 32px;
    }
    
    .unmute-notice:hover {
      background: rgba(0,0,0,0.9);
      transform: translate(-50%, -50%) scale(1.05);
    }
    
    .chat-section {
      width: 380px;
      min-width: 380px;
      max-width: 380px;
      flex-shrink: 0;
      background: var(--chat-bg);
      display: flex;
      flex-direction: column;
      border-left: 1px solid var(--border);
    }
    
    @media (max-width: 768px) {
      .webinar-container {
        flex-direction: column;
      }
      
      .video-section {
        height: 45vh;
        height: 45dvh;
        flex: none;
      }
      
      .chat-section {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        height: 55vh;
        height: 55dvh;
        flex: none;
        border-left: none;
        border-top: 1px solid var(--border);
        position: relative;
        z-index: 50;
      }
    }
    
    .chat-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
      font-weight: 600;
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
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
    
    .message.user {
      flex-direction: row-reverse;
    }
    
    .message-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 600;
      flex-shrink: 0;
    }
    
    .message.bot .message-avatar {
      background: var(--primary);
    }
    
    .message.user .message-avatar {
      background: #374151;
    }
    
    .message-content {
      max-width: 75%;
      padding: 0.75rem 1rem;
      border-radius: 16px;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    
    .message.bot .message-content {
      background: rgba(255,255,255,0.05);
      border-bottom-left-radius: 4px;
    }
    
    .message.user .message-content {
      background: var(--primary);
      border-bottom-right-radius: 4px;
    }
    
    .typing-indicator {
      display: flex;
      gap: 0.75rem;
      padding: 0 1rem;
    }
    
    .typing-dots {
      display: flex;
      gap: 4px;
      padding: 0.75rem 1rem;
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
    }
    
    .typing-dot {
      width: 8px;
      height: 8px;
      background: var(--text-muted);
      border-radius: 50%;
      animation: bounce 1.4s ease-in-out infinite;
    }
    
    .typing-dot:nth-child(1) { animation-delay: 0s; }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }
    
    .chat-input-area {
      padding: 1rem;
      padding-bottom: calc(1rem + env(safe-area-inset-bottom));
      border-top: 1px solid var(--border);
    }
    
    .chat-input-wrapper {
      display: flex;
      gap: 0.5rem;
    }
    
    .chat-input {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      color: var(--text);
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }
    
    .chat-input:focus {
      border-color: var(--primary);
    }
    
    .chat-input::placeholder {
      color: var(--text-muted);
    }
    
    .send-btn {
      background: var(--primary);
      border: none;
      border-radius: 12px;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .send-btn:hover {
      transform: scale(1.05);
    }
    
    .send-btn svg {
      width: 20px;
      height: 20px;
      fill: white;
    }
    
    /* Overlays */
    .overlay {
      position: fixed;
      inset: 0;
      background: var(--bg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 100;
      text-align: center;
      padding: 2rem;
    }
    
    .overlay.hidden { display: none; }
    
    .countdown-title {
      font-size: 1.5rem;
      color: var(--text-muted);
      margin-bottom: 2rem;
    }
    
    .countdown-timer {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .countdown-unit {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .countdown-value {
      font-size: 4rem;
      font-weight: 700;
      font-family: 'Space Grotesk', sans-serif;
      background: linear-gradient(180deg, #fff 0%, #999 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .countdown-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    .overlay-message {
      color: var(--text-muted);
      max-width: 400px;
      line-height: 1.6;
    }
    
    .ended-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }
    
    .ended-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    
    /* Lead Capture Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: 1rem;
    }
    
    .modal-overlay.hidden { display: none; }
    
    .modal {
      background: var(--chat-bg);
      border-radius: 20px;
      padding: 2rem;
      max-width: 400px;
      width: 100%;
      border: 1px solid var(--border);
      animation: scaleIn 0.3s ease;
    }
    
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    
    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .modal-title span { margin-right: 0.5rem; }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-input {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.875rem 1rem;
      color: var(--text);
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    
    .form-input:focus {
      border-color: var(--primary);
    }
    
    .form-input::placeholder {
      color: var(--text-muted);
    }
    
    .submit-btn {
      width: 100%;
      background: var(--primary);
      border: none;
      border-radius: 10px;
      padding: 1rem;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s;
      margin-top: 1.5rem;
    }
    
    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(229,57,53,0.3);
    }
    
    .privacy-note {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-top: 1rem;
    }
    ${ctaStyles}
  </style>
</head>
<body>
  <!-- Lead Capture Modal -->
  <div class="modal-overlay" id="leadModal">
    <div class="modal">
      <h2 class="modal-title"><span>💬</span>Join the Chat!</h2>
      <form id="leadForm">
        <div class="form-group">
          <input type="text" class="form-input" id="leadName" placeholder="Your Name" ${config.requireName ? 'required' : ''}>
        </div>
        <div class="form-group">
          <input type="email" class="form-input" id="leadEmail" placeholder="Your Email" ${config.requireEmail ? 'required' : ''}>
        </div>
        <button type="submit" class="submit-btn">
          Start Chatting
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </form>
      <p class="privacy-note">🔒 Your info is safe with us</p>
    </div>
  </div>

  <!-- Countdown Overlay -->
  <div class="overlay" id="countdownOverlay">
    <h2 class="countdown-title">Webinar Starting In...</h2>
    <div class="countdown-timer">
      <div class="countdown-unit">
        <span class="countdown-value" id="hours">00</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-value" id="minutes">00</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-value" id="seconds">00</span>
        <span class="countdown-label">Seconds</span>
      </div>
    </div>
    <p class="overlay-message">Please stay on this page. The session will begin automatically.</p>
  </div>

  <!-- Next Session Countdown Overlay (replaces "ended" message) -->
  <div class="overlay hidden" id="endedOverlay">
    <h2 class="countdown-title">Next Session Starting In...</h2>
    <div class="countdown-timer">
      <div class="countdown-unit">
        <span class="countdown-value" id="nextHours">00</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-value" id="nextMinutes">00</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-value" id="nextSeconds">00</span>
        <span class="countdown-label">Seconds</span>
      </div>
    </div>
    <p class="overlay-message">Please stay on this page. The session will begin automatically.</p>
  </div>

  <!-- Main Webinar Room -->
  <div class="webinar-container" id="webinarRoom" style="display: none;">
    <div class="video-section">
      <div class="header">
        <div class="logo-section">
          <div class="logo-circle">${config.logoText}</div>
          <span class="header-title">${config.headerTitle}</span>
        </div>
        <div class="live-badge">
          <span class="live-dot"></span>
          LIVE
        </div>
        <div class="viewer-count">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span id="viewerCount">${config.minViewers}</span> watching
        </div>
      </div>
      <div class="video-wrapper">
        <video id="webinarVideo" playsinline>
          <source src="${config.videoUrl}" type="video/mp4">
        </video>
        <div class="unmute-notice" id="unmuteNotice" onclick="unmuteVideo()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
          <span>Click to unmute</span>
        </div>
      </div>
      ${config.ctaStyle === 'banner' ? ctaBannerHtml : ''}
    </div>
    
    <div class="chat-section">
      <div class="chat-header">💬 Live Chat</div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-input-area">
        <div class="chat-input-wrapper">
          <input type="text" class="chat-input" id="chatInput" placeholder="Type a message...">
          <button class="send-btn" onclick="sendMessage()">
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  ${config.ctaStyle === 'floating' ? ctaFloatingHtml : ''}

  <script>
    const CONFIG = {
      webinarId: "${config.id}",
      webinarName: "${config.webinarName}",
      videoUrl: "${config.videoUrl}",
      durationSeconds: ${config.durationSeconds},
      startHour: ${config.startHour},
      startMinute: ${config.startMinute},
      timezone: "${config.timezone}",
      minViewers: ${config.minViewers},
      maxViewers: ${config.maxViewers},
      botName: "${config.botName}",
      botAvatar: "${config.botAvatar}",
      webhookUrl: "${config.webhookUrl}",
      typingDelayMin: ${config.typingDelayMin},
      typingDelayMax: ${config.typingDelayMax},
      errorMessage: "${config.errorMessage.replace(/"/g, '\\"')}",
      enableLeadCapture: ${config.enableLeadCapture},
      welcomeMessage: "${config.welcomeMessage.replace(/"/g, '\\"')}",
      leadWebhookUrl: "${config.leadWebhookUrl}",
      enableCta: ${config.enableCta},
      ctaShowAfterSeconds: ${config.ctaShowAfterSeconds},
      ctaButtonText: "${config.ctaButtonText.replace(/"/g, '\\"')}",
      ctaButtonUrl: "${config.ctaButtonUrl}",
      supabaseUrl: "https://ygtyteykrzrorlzbwlpl.supabase.co"
    };

    let userData = null;
    let leadId = null;
    let isTyping = false;
    
    // Check for stored lead data
    const storedLead = localStorage.getItem('webinar_lead_' + CONFIG.webinarId);
    if (storedLead) {
      const parsed = JSON.parse(storedLead);
      userData = parsed.userData;
      leadId = parsed.leadId;
      document.getElementById('leadModal').classList.add('hidden');
    } else if (!CONFIG.enableLeadCapture) {
      document.getElementById('leadModal').classList.add('hidden');
    }

    // Save lead to database
    async function saveLeadToDb(name, email) {
      try {
        const response = await fetch(CONFIG.supabaseUrl + '/functions/v1/save-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webinar_id: CONFIG.webinarId,
            name,
            email,
            user_agent: navigator.userAgent
          })
        });
        const data = await response.json();
        return data.lead_id || null;
      } catch (error) {
        console.error('Failed to save lead:', error);
        return null;
      }
    }

    // Save chat message to database
    async function saveChatToDb(userMessage, aiResponse) {
      try {
        await fetch(CONFIG.supabaseUrl + '/functions/v1/save-chat-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webinar_id: CONFIG.webinarId,
            lead_id: leadId,
            user_name: userData?.name || 'Guest',
            user_email: userData?.email || '',
            user_message: userMessage,
            ai_response: aiResponse
          })
        });
      } catch (error) {
        console.error('Failed to save chat:', error);
      }
    }

    // Lead form submission
    document.getElementById('leadForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('leadName').value.trim();
      const email = document.getElementById('leadEmail').value.trim();
      
      userData = { name, email };
      
      // Save to database
      leadId = await saveLeadToDb(name, email);
      
      localStorage.setItem('webinar_lead_' + CONFIG.webinarId, JSON.stringify({ userData, leadId }));
      
      document.getElementById('leadModal').classList.add('hidden');
      
      // Send to webhook if configured
      if (CONFIG.leadWebhookUrl) {
        fetch(CONFIG.leadWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'lead_capture',
            name,
            email,
            webinarName: CONFIG.webinarName,
            timestamp: new Date().toISOString(),
            source: 'webinar-chat'
          })
        }).catch(() => {});
      }
      
      // Show welcome message
      const welcome = CONFIG.welcomeMessage.replace('{name}', name);
      addMessage(welcome, 'bot');
    });

    // Calculate webinar state
    function getWebinarState() {
      const now = new Date();
      const options = { timeZone: CONFIG.timezone };
      const localTime = new Date(now.toLocaleString('en-US', options));

      // Today's scheduled start time in the configured timezone
      const todayStart = new Date(localTime);
      todayStart.setHours(CONFIG.startHour, CONFIG.startMinute, 0, 0);

      const todayEnd = new Date(todayStart.getTime() + CONFIG.durationSeconds * 1000);

      // If we're before today's start time, we might still be inside yesterday's session
      // (e.g. webinar starts at 23:00 and lasts 3 hours → continues past midnight)
      if (localTime < todayStart) {
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);

        const yesterdayEnd = new Date(yesterdayStart.getTime() + CONFIG.durationSeconds * 1000);

        if (localTime >= yesterdayStart && localTime < yesterdayEnd) {
          const elapsed = (localTime - yesterdayStart) / 1000;
          return { state: 'live', startTime: yesterdayStart, endTime: yesterdayEnd, elapsed };
        }

        return { state: 'countdown', startTime: todayStart, endTime: todayEnd };
      }

      if (localTime >= todayStart && localTime < todayEnd) {
        const elapsed = (localTime - todayStart) / 1000;
        return { state: 'live', startTime: todayStart, endTime: todayEnd, elapsed };
      }

      return { state: 'ended', startTime: todayStart, endTime: todayEnd };
    }

    function updateCountdown() {
      const { state, startTime } = getWebinarState();
      
      if (state !== 'countdown') {
        document.getElementById('countdownOverlay').classList.add('hidden');
        if (state === 'live') {
          startWebinar();
        } else {
          showEnded(startTime);
        }
        return;
      }
      
      const now = new Date();
      const options = { timeZone: CONFIG.timezone };
      const localTime = new Date(now.toLocaleString('en-US', options));
      const diff = startTime - localTime;
      
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    function startWebinar() {
      document.getElementById('countdownOverlay').classList.add('hidden');
      document.getElementById('webinarRoom').style.display = 'flex';
      
      const { elapsed } = getWebinarState();
      const video = document.getElementById('webinarVideo');
      
      video.currentTime = elapsed || 0;
      video.muted = true;
      video.play().catch(() => {});
      
      updateViewerCount();
      setInterval(updateViewerCount, 30000);
      
      // Check for ended state
      setInterval(() => {
        const { state, startTime } = getWebinarState();
        if (state === 'ended') {
          showEnded(startTime);
        }
      }, 1000);
    }

    function showEnded(startTime) {
      document.getElementById('webinarRoom').style.display = 'none';
      document.getElementById('endedOverlay').classList.remove('hidden');
      
      // Calculate next session time (tomorrow at the same time)
      const nextStart = new Date(startTime);
      nextStart.setDate(nextStart.getDate() + 1);
      
      // Start countdown to next session
      function updateNextCountdown() {
        const now = new Date();
        const options = { timeZone: CONFIG.timezone };
        const localTime = new Date(now.toLocaleString('en-US', options));
        const diff = nextStart - localTime;
        
        if (diff <= 0) {
          // Next session started, reload page
          location.reload();
          return;
        }
        
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        document.getElementById('nextHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('nextMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('nextSeconds').textContent = String(seconds).padStart(2, '0');
      }
      
      updateNextCountdown();
      setInterval(updateNextCountdown, 1000);
    }

    function updateViewerCount() {
      const count = Math.floor(Math.random() * (CONFIG.maxViewers - CONFIG.minViewers + 1)) + CONFIG.minViewers;
      document.getElementById('viewerCount').textContent = count;
    }

    function unmuteVideo() {
      const video = document.getElementById('webinarVideo');
      video.muted = false;
      document.getElementById('unmuteNotice').style.display = 'none';
    }

    function addMessage(content, sender, userName) {
      const container = document.getElementById('chatMessages');
      const div = document.createElement('div');
      div.className = 'message ' + sender;
      
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.textContent = sender === 'bot' ? CONFIG.botAvatar : (userName ? userName[0].toUpperCase() : 'U');
      
      const msg = document.createElement('div');
      msg.className = 'message-content';
      msg.textContent = content;
      
      div.appendChild(avatar);
      div.appendChild(msg);
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function showTyping() {
      if (isTyping) return;
      isTyping = true;
      
      const container = document.getElementById('chatMessages');
      const div = document.createElement('div');
      div.className = 'typing-indicator';
      div.id = 'typingIndicator';
      
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.style.background = 'var(--primary)';
      avatar.textContent = CONFIG.botAvatar;
      
      const dots = document.createElement('div');
      dots.className = 'typing-dots';
      dots.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
      
      div.appendChild(avatar);
      div.appendChild(dots);
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function hideTyping() {
      isTyping = false;
      const indicator = document.getElementById('typingIndicator');
      if (indicator) indicator.remove();
    }

    async function sendMessage() {
      const input = document.getElementById('chatInput');
      const message = input.value.trim();
      if (!message) return;
      
      // Check if lead capture needed
      if (CONFIG.enableLeadCapture && !userData) {
        document.getElementById('leadModal').classList.remove('hidden');
        return;
      }
      
      input.value = '';
      addMessage(message, 'user', userData?.name);
      
      // Show typing indicator
      const delay = (Math.random() * (CONFIG.typingDelayMax - CONFIG.typingDelayMin) + CONFIG.typingDelayMin) * 1000;
      showTyping();
      
      let aiResponse = CONFIG.errorMessage;
      
      try {
        const response = await fetch(CONFIG.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'chat_message',
            message,
            userName: userData?.name || 'Guest',
            userEmail: userData?.email || '',
            timestamp: new Date().toISOString()
          })
        });
        
        const data = await response.json();
        
        // Handle different response formats from N8N/webhooks
        if (typeof data === 'string') {
          aiResponse = data;
        } else if (data.output?.[0]?.content?.[0]?.text) {
          // N8N OpenAI node format
          aiResponse = data.output[0].content[0].text;
        } else if (data.output) {
          aiResponse = data.output;
        } else if (data.reply) {
          aiResponse = data.reply;
        } else if (data.response) {
          aiResponse = data.response;
        } else if (data.message) {
          aiResponse = data.message;
        } else if (data.text) {
          aiResponse = data.text;
        } else if (data.content) {
          aiResponse = data.content;
        } else {
          aiResponse = CONFIG.errorMessage;
        }
      } catch (error) {
        console.error('Webhook error:', error);
      }
      
      // Save to database
      saveChatToDb(message, aiResponse);
      
      setTimeout(() => {
        hideTyping();
        addMessage(aiResponse, 'bot');
      }, delay);
    }

    // Enter key to send
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendMessage();
    });

    // Disable right-click on video
    document.getElementById('webinarVideo').addEventListener('contextmenu', e => e.preventDefault());

    ${ctaScript}

    // Initialize
    const { state } = getWebinarState();
    if (state === 'countdown') {
      updateCountdown();
      setInterval(updateCountdown, 1000);
    } else if (state === 'live') {
      document.getElementById('countdownOverlay').classList.add('hidden');
      startWebinar();
    } else {
      const { startTime } = getWebinarState();
      document.getElementById('countdownOverlay').classList.add('hidden');
      showEnded(startTime);
    }
  </script>
</body>
</html>`;
};
