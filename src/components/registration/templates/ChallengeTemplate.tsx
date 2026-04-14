import { WebinarConfig } from '@/types/webinar';
import { PresenterCircles, RegistrationForm, useNextSession, useScheduledCountdown, useCountdown, pad } from './shared';

interface TemplateProps { config: WebinarConfig; }

const EMOJIS = ['📋', '🤖', '🔥', '💰', '🎯', '⚡', '🏆', '🚀'];

export default function ChallengeTemplate({ config }: TemplateProps) {
  const accent = config.regFormAccentColor || '#e879f9';
  const nextSession = useNextSession(config);
  const scheduledCountdown = useScheduledCountdown(config);
  const urgencyCountdown = useCountdown(config.regFormCountdownSeconds);
  const bonuses = config.regFormBonuses;
  const bullets = config.regFormBullets;
  const totalValue = config.regFormBonusTotalValue || '$891';

  return (
    <div style={{
      background: 'linear-gradient(180deg, #1a0a2e 0%, #0f051d 100%)',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: `'${config.regFormFontFamily || 'Georgia'}', serif`,
      fontSize: config.regFormBodyFontSize || '1rem',
      position: 'relative',
    }}>
      {/* Decorative orb */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '40%', background: `radial-gradient(ellipse at center, ${accent}0f 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Top Bar */}
      <div style={{ background: 'linear-gradient(90deg, #86198f, #a21caf)', padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: 700 }}>
        🎯 FREE LIVE WORKSHOP — <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>{totalValue}</span> → $0 (Limited Time)
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ display: 'inline-block', background: `${accent}20`, border: `1px solid ${accent}40`, borderRadius: 20, padding: '6px 16px', fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: accent }}>
            LIVE WORKSHOP EVENT
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: `'${config.regFormHeadlineFontFamily || 'Georgia'}', serif`,
          fontSize: config.regFormHeadlineFontSize || 'clamp(26px, 5vw, 42px)',
          fontWeight: Number(config.regFormHeadlineFontWeight) || 700,
          lineHeight: 1.2,
          textAlign: 'center',
          marginBottom: 12,
          color: config.regFormHeadlineColor || '#ffffff',
        }}>
          {config.regFormHeadline || 'Join the Free Workshop'}
        </h1>

        {config.regFormSubheadline && (
          <p style={{ textAlign: 'center', opacity: 0.6, marginBottom: 24, fontSize: '1.05em' }}>
            {config.regFormSubheadline}
          </p>
        )}

        {/* Presenters */}
        <div style={{ marginBottom: 28 }}>
          <PresenterCircles presenters={config.regFormPresenters} accentColor={accent} size={80} />
        </div>

        {/* Outcome Stack */}
        {bullets.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.5, marginBottom: 16, textAlign: 'center' }}>
              WHAT YOU'LL WALK AWAY WITH:
            </p>
            {bullets.length <= 4 && bullets.every(b => b.length > 60) ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {bullets.map((b, i) => {
                  const firstSentence = b.split(/[.!]/).shift() || b;
                  const rest = b.slice(firstSentence.length).replace(/^[.!\s]+/, '');
                  return (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}20`, borderRadius: 10, padding: 14 }}>
                      <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>{EMOJIS[i % EMOJIS.length]}</span>
                      <p style={{ fontWeight: 700, fontSize: '0.9em', marginBottom: 4 }}>{firstSentence}</p>
                      {rest && <p style={{ fontSize: '0.8em', opacity: 0.6 }}>{rest}</p>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {bullets.map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: accent, fontWeight: 800 }}>✓</span>
                    <span style={{ opacity: 0.85 }}>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Registration Card with Countdown */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}20`, borderRadius: 14, padding: '20px 18px', marginBottom: 28 }}>
          {config.regFormShowCountdown && (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Lucida Console', monospace", color: accent }}>
                {pad(urgencyCountdown.h)}:{pad(urgencyCountdown.m)}:{pad(urgencyCountdown.s)}
              </p>
            </div>
          )}
          {nextSession && !nextSession.isJit && scheduledCountdown && (
            <p style={{ textAlign: 'center', fontSize: 13, marginBottom: 12, opacity: 0.6 }}>
              📅 {nextSession.date} at {nextSession.time} ({nextSession.timezone})
            </p>
          )}
          <RegistrationForm config={config} accentColor={accent} dark />
        </div>

        {/* Bonus Stack */}
        {bonuses.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.5, marginBottom: 16, textAlign: 'center' }}>
              🎁 LIVE ATTENDEE BONUSES:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bonuses.map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}15`, borderRadius: 8, padding: '12px 16px' }}>
                  <span style={{ fontWeight: 600 }}>🎁 {b.name}</span>
                  <span style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.9em' }}>{b.value}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 14, fontSize: '1.1em', fontWeight: 700 }}>
              Total Value: <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>{totalValue}</span> → <span style={{ color: accent }}>FREE</span>
            </div>
          </div>
        )}

        {/* Footer */}
        {config.regFormDisclaimerText && (
          <p style={{ textAlign: 'center', fontSize: 10, opacity: 0.3, lineHeight: 1.5, maxWidth: 500, margin: '40px auto 0' }}>
            {config.regFormDisclaimerText}
          </p>
        )}
        {config.regFormLegalLinks.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
            {config.regFormLegalLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, opacity: 0.4, color: '#fff', textDecoration: 'underline' }}>{link.label}</a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
