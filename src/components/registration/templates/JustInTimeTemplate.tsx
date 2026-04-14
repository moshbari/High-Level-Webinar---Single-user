import { WebinarConfig } from '@/types/webinar';
import { PresenterCircles, RegistrationForm, useCountdown, pad } from './shared';

interface TemplateProps { config: WebinarConfig; }

export default function JustInTimeTemplate({ config }: TemplateProps) {
  const accent = config.regFormAccentColor || '#22d3ee';
  const initialSeconds = config.justInTimeEnabled
    ? config.justInTimeMinutes * 60
    : config.regFormCountdownSeconds;
  const countdown = useCountdown(initialSeconds);

  const secrets = config.regFormSecrets.length > 0 ? config.regFormSecrets : config.regFormBullets;

  // Fake viewer count
  const viewerCount = 143;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: `'${config.regFormFontFamily || 'Verdana'}', 'Geneva', sans-serif`,
      fontSize: config.regFormBodyFontSize || '1rem',
      position: 'relative',
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '40%', background: `radial-gradient(ellipse at center, ${accent}0f 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Urgency Bar */}
      {config.regFormShowUrgencyBar && (
        <div style={{ background: `linear-gradient(90deg, #0e7490, #0891b2)`, padding: '10px 16px', textAlign: 'center', fontSize: 13, fontWeight: 700 }}>
          {config.regFormUrgencyBarText}
        </div>
      )}

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '44px 20px', position: 'relative', zIndex: 1 }}>
        {/* Starting Soon Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          <style>{`@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'blink 1s infinite' }} />
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: accent }}>
            Starting Soon
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: `'${config.regFormHeadlineFontFamily || 'Verdana'}', sans-serif`,
          fontSize: config.regFormHeadlineFontSize || 'clamp(24px, 5vw, 40px)',
          fontWeight: Number(config.regFormHeadlineFontWeight) || 700,
          lineHeight: 1.2,
          textAlign: 'center',
          marginBottom: 20,
          color: config.regFormHeadlineColor || '#ffffff',
        }}>
          {config.regFormHeadline || 'Join This Free Training'}
        </h1>

        {config.regFormPostHeadline && (
          <p style={{ textAlign: 'center', opacity: 0.6, marginBottom: 24, fontSize: '0.95em' }}>
            {config.regFormPostHeadline}
          </p>
        )}

        {/* Presenters */}
        <div style={{ marginBottom: 24 }}>
          <PresenterCircles presenters={config.regFormPresenters} accentColor={accent} size={72} />
        </div>

        {/* Countdown */}
        {config.regFormShowCountdown && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.4, marginBottom: 8 }}>
              SESSION BEGINS IN
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              {[{ val: countdown.m, label: 'MIN' }, { val: countdown.s, label: 'SEC' }].map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}33`, borderRadius: 10, padding: '12px 20px', fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 800, fontFamily: 'monospace', color: accent, minWidth: 70 }}>
                    {pad(item.val)}
                  </div>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, opacity: 0.4, marginTop: 4 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viewer Count */}
        {config.regFormShowViewerCount && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ display: 'flex' }}>
              {['A', 'B', 'C', 'D'].map((letter, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'][i],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff',
                  marginLeft: i > 0 ? -8 : 0, border: '2px solid #0f172a',
                }}>
                  {letter}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 13, opacity: 0.7 }}><strong>{viewerCount}</strong> people watching now</span>
          </div>
        )}

        {/* Form Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}20`, borderRadius: 14, padding: '20px 18px', marginBottom: 24 }}>
          <p style={{ textAlign: 'center', fontWeight: 700, marginBottom: 14, fontSize: '0.95em' }}>
            Enter Your Details To Join FREE:
          </p>
          <RegistrationForm config={config} accentColor={accent} dark />
        </div>

        {/* Bullets */}
        {secrets.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            {secrets.slice(0, 3).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, opacity: 0.75 }}>
                <span style={{ color: accent, fontWeight: 800 }}>›</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Spots Left */}
        {config.regFormShowSpotsLeft && (
          <p style={{ textAlign: 'center', fontSize: 13, opacity: 0.5 }}>
            Only <strong style={{ color: accent }}>{config.regFormSpotsLeft}</strong> spots remaining
          </p>
        )}

        {/* Footer */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          {config.regFormDisclaimerText && (
            <p style={{ fontSize: 10, opacity: 0.3, lineHeight: 1.5, maxWidth: 440, margin: '0 auto 12px' }}>{config.regFormDisclaimerText}</p>
          )}
          {config.regFormLegalLinks.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              {config.regFormLegalLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, opacity: 0.4, color: '#fff', textDecoration: 'underline' }}>{link.label}</a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
