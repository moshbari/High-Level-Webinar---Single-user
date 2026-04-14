import { WebinarConfig } from '@/types/webinar';
import { PresenterCircles, RegistrationForm, useNextSession, useScheduledCountdown } from './shared';

interface TemplateProps { config: WebinarConfig; }

export default function ProofStackTemplate({ config }: TemplateProps) {
  const accent = config.regFormAccentColor || '#4ade80';
  const nextSession = useNextSession(config);
  const countdown = useScheduledCountdown(config);
  const results = config.regFormResults;
  const qualifiersFor = config.regFormQualifiersFor;
  const qualifiersNotFor = config.regFormQualifiersNotFor;

  // Render headline with numbers/dollar amounts in accent
  const renderHeadline = (text: string) => {
    return text.split(/(\$[\d,]+|\d[\d,]*)/g).map((part, i) =>
      /^\$?\d/.test(part) ? <span key={i} style={{ color: accent }}>{part}</span> : part
    );
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #030712 0%, #0a1628 100%)',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: `'${config.regFormFontFamily || 'Palatino Linotype'}', 'Book Antiqua', Palatino, serif`,
      fontSize: config.regFormBodyFontSize || '1rem',
    }}>
      {/* Counter Bar */}
      <div style={{ background: '#15803d', padding: '10px 16px', textAlign: 'center', fontSize: 13, fontWeight: 700 }}>
        📈 2,847 people registered this week — join them FREE
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        {/* Pre-headline */}
        {config.regFormPreHeadline && (
          <p style={{ color: accent, fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
            {config.regFormPreHeadline}
          </p>
        )}

        {/* Headline */}
        <h1 style={{
          fontFamily: `'${config.regFormHeadlineFontFamily || 'Trebuchet MS'}', sans-serif`,
          fontSize: config.regFormHeadlineFontSize || 'clamp(26px, 5vw, 42px)',
          fontWeight: Number(config.regFormHeadlineFontWeight) || 700,
          lineHeight: 1.2,
          textAlign: 'center',
          marginBottom: 12,
          color: config.regFormHeadlineColor || '#ffffff',
        }}>
          {renderHeadline(config.regFormHeadline || 'Register for the Free Training')}
        </h1>

        {config.regFormSubheadline && (
          <p style={{ textAlign: 'center', opacity: 0.6, marginBottom: 24, fontSize: '1.05em' }}>
            {config.regFormSubheadline}
          </p>
        )}

        {/* Presenters */}
        <div style={{ marginBottom: 28 }}>
          <PresenterCircles presenters={config.regFormPresenters} accentColor={accent} size={76} />
        </div>

        {/* Results Grid */}
        {results.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.4, marginBottom: 16, textAlign: 'center' }}>
              REAL RESULTS FROM REAL PEOPLE
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {results.map((r, i) => (
                <div key={i} style={{ background: `${accent}0a`, border: `1px solid ${accent}1f`, borderRadius: 10, padding: 14, textAlign: 'center' }}>
                  <p style={{ color: accent, fontSize: 22, fontWeight: 800 }}>{r.amount}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.85, marginTop: 4 }}>{r.name}</p>
                  <p style={{ fontSize: 10, opacity: 0.45, marginTop: 2 }}>{r.context} • {r.timeline}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two Columns: Qualifiers + Form */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {/* Left: Qualifiers */}
          {(qualifiersFor.length > 0 || qualifiersNotFor.length > 0) && (
            <div style={{ flex: '1 1 300px', minWidth: 280 }}>
              {qualifiersFor.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontWeight: 700, marginBottom: 10, fontSize: '0.95em' }}>✅ This is for you if:</p>
                  {qualifiersFor.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, opacity: 0.85 }}>
                      <span style={{ color: accent }}>✓</span><span>{q}</span>
                    </div>
                  ))}
                </div>
              )}
              {qualifiersNotFor.length > 0 && (
                <div>
                  <p style={{ fontWeight: 700, marginBottom: 10, fontSize: '0.95em' }}>❌ This is NOT for you if:</p>
                  {qualifiersNotFor.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, opacity: 0.85 }}>
                      <span style={{ color: '#ef4444' }}>✗</span><span>{q}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right: Form */}
          <div style={{ flex: '1 1 320px', minWidth: 280 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}20`, borderRadius: 14, padding: '20px 18px' }}>
              <p style={{ textAlign: 'center', fontWeight: 800, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, color: accent }}>
                REGISTER FREE
              </p>
              {nextSession && !nextSession.isJit && countdown && (
                <p style={{ textAlign: 'center', fontSize: 13, marginBottom: 12, opacity: 0.7 }}>
                  📅 {nextSession.date} at {nextSession.time} ({nextSession.timezone})
                </p>
              )}
              {nextSession?.isJit && (
                <p style={{ textAlign: 'center', fontSize: 13, marginBottom: 12, fontWeight: 700 }}>
                  ⚡ Starting in {nextSession.minutesAway} minutes!
                </p>
              )}
              <RegistrationForm config={config} accentColor={accent} dark />
            </div>
          </div>
        </div>

        {/* Footer */}
        {config.regFormDisclaimerText && (
          <p style={{ textAlign: 'center', fontSize: 10, opacity: 0.3, marginTop: 40, lineHeight: 1.5, maxWidth: 600, margin: '40px auto 0' }}>
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
