import { WebinarConfig, TIMEZONES } from '@/types/webinar';
import { PresenterCircles, RegistrationForm, useNextSession, useScheduledCountdown, pad, useCountdown } from './shared';

interface TemplateProps { config: WebinarConfig; }

export default function CuriosityTemplate({ config }: TemplateProps) {
  const accent = config.regFormAccentColor || '#f7c948';
  const nextSession = useNextSession(config);
  const scheduledCountdown = useScheduledCountdown(config);
  const urgencyCountdown = useCountdown(config.regFormCountdownSeconds);

  const secrets = config.regFormSecrets.length > 0 ? config.regFormSecrets : null;
  const bullets = config.regFormBullets;
  const qualifiers = config.regFormQualifiersFor;

  // Render headline with *asterisk* text in accent color
  const renderHeadline = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <span key={i} style={{ color: accent }}>{part.slice(1, -1)}</span>;
      }
      return part;
    });
  };

  // Secondary timezone time
  const getSecondaryTime = () => {
    if (!config.regFormSecondaryTimezone || !nextSession || nextSession.isJit) return null;
    try {
      const now = new Date();
      return now.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true,
        timeZone: config.regFormSecondaryTimezone
      });
    } catch { return null; }
  };

  const tz = config.timezone || 'UTC';
  const tzObj = TIMEZONES.find(t => t.value === tz);
  const tzShort = tzObj ? tzObj.label.split('(')[1]?.replace(')', '') || tzObj.label.split(' ')[0] : tz;

  return (
    <div style={{ background: 'linear-gradient(180deg, #0b0f1a 0%, #141b2d 100%)', color: '#ffffff', minHeight: '100vh', fontFamily: `'${config.regFormFontFamily || 'Trebuchet MS'}', sans-serif`, fontSize: config.regFormBodyFontSize || '1rem' }}>
      {/* Urgency Bar */}
      {config.regFormShowUrgencyBar && (
        <div style={{ background: '#c0392b', padding: '10px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px', animation: 'pulse 2s infinite' }}>
          <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.85 } }`}</style>
          {config.regFormUrgencyBarText} — {pad(urgencyCountdown.h)}:{pad(urgencyCountdown.m)}:{pad(urgencyCountdown.s)}
        </div>
      )}

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '44px 20px' }}>
        {/* Pre-headline */}
        {config.regFormPreHeadline && (
          <p style={{ color: accent, fontSize: 13, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: 16 }}>
            {config.regFormPreHeadline}
          </p>
        )}

        {/* Main Headline */}
        <h1 style={{
          fontFamily: `'${config.regFormHeadlineFontFamily || 'Georgia'}', 'Times New Roman', serif`,
          fontSize: config.regFormHeadlineFontSize || 'clamp(26px, 5vw, 44px)',
          fontWeight: Number(config.regFormHeadlineFontWeight) || 700,
          lineHeight: 1.2,
          textAlign: 'center',
          marginBottom: 12,
          color: config.regFormHeadlineColor || '#ffffff',
        }}>
          {renderHeadline(config.regFormHeadline || 'Register for the Free Training')}
        </h1>

        {/* Post-headline */}
        {config.regFormPostHeadline && (
          <p style={{ textAlign: 'center', fontStyle: 'italic', opacity: 0.6, marginBottom: 24, fontSize: '1.05em' }}>
            {config.regFormPostHeadline}
          </p>
        )}

        {/* Hero Image */}
        {config.regFormHeroImageUrl && (
          <div style={{ position: 'relative', marginBottom: 28, borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <img src={config.regFormHeroImageUrl} alt="Training preview" style={{ width: '100%', display: 'block' }} />
            <div style={{ position: 'absolute', top: 12, left: 12, background: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block' }} /> LIVE
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                <span style={{ fontSize: 28, marginLeft: 4 }}>▶</span>
              </div>
            </div>
          </div>
        )}

        {/* Presenters */}
        <div style={{ marginBottom: 28 }}>
          <PresenterCircles presenters={config.regFormPresenters} accentColor={accent} size={80} />
        </div>

        {/* Secrets / Bullets */}
        {(secrets || bullets.length > 0) && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.5, marginBottom: 16, textAlign: 'center' }}>
              ON THIS FREE TRAINING YOU'LL DISCOVER:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {secrets ? secrets.map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}26`, borderRadius: 10, padding: '14px 16px' }}>
                  <span style={{ color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 1, display: 'block', marginBottom: 4 }}>SECRET #{i + 1}:</span>
                  <span style={{ opacity: 0.85 }}>{s}</span>
                </div>
              )) : bullets.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: accent, fontWeight: 800, fontSize: 18, lineHeight: 1 }}>✓</span>
                  <span style={{ opacity: 0.85 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Qualifiers */}
        {qualifiers.length > 0 && (
          <div style={{ background: `${accent}0d`, border: `1px solid ${accent}26`, borderRadius: 10, padding: 16, marginBottom: 28 }}>
            <p style={{ fontWeight: 700, marginBottom: 10, fontSize: '0.95em' }}>This training is perfect for you if:</p>
            {qualifiers.map((q, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, opacity: 0.85 }}>
                <span style={{ color: accent }}>→</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        )}

        {/* Registration Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}26`, borderRadius: 14, padding: '20px 18px', marginBottom: 28 }}>
          {/* Session Time Slots */}
          {nextSession && !nextSession.isJit && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1, background: `${accent}15`, border: `2px solid ${accent}`, borderRadius: 8, padding: '10px 12px', textAlign: 'center', position: 'relative' }}>
                  {config.regFormShowSpotsLeft && (
                    <span style={{ position: 'absolute', top: -8, right: 8, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>FILLING UP</span>
                  )}
                  <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.6 }}>TODAY</p>
                  <p style={{ fontWeight: 700, fontSize: '0.9em' }}>{nextSession.time} {tzShort}</p>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.6 }}>TOMORROW</p>
                  <p style={{ fontWeight: 700, fontSize: '0.9em' }}>{nextSession.time} {tzShort}</p>
                </div>
              </div>
              {scheduledCountdown && (
                <p style={{ textAlign: 'center', fontSize: 13, opacity: 0.5 }}>
                  Starts in <span style={{ color: accent, fontWeight: 700 }}>{scheduledCountdown}</span>
                </p>
              )}
            </div>
          )}
          {nextSession?.isJit && (
            <p style={{ textAlign: 'center', marginBottom: 12, fontSize: 14, fontWeight: 700 }}>
              ⚡ Starting in just <span style={{ color: accent }}>{nextSession.minutesAway} minutes!</span>
            </p>
          )}
          <RegistrationForm config={config} accentColor={accent} dark />
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 12, opacity: 0.3, marginTop: 40 }}>
          © {new Date().getFullYear()} {config.vendorName || 'Ultimate Online Mastery'}
        </p>

        {/* Disclaimer */}
        {config.regFormDisclaimerText && (
          <p style={{ textAlign: 'center', fontSize: 10, opacity: 0.3, marginTop: 16, lineHeight: 1.5, maxWidth: 500, margin: '16px auto 0' }}>
            {config.regFormDisclaimerText}
          </p>
        )}

        {/* Legal Links */}
        {config.regFormLegalLinks.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
            {config.regFormLegalLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, opacity: 0.4, color: '#fff', textDecoration: 'underline' }}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
