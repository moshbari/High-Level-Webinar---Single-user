import { WebinarConfig, TIMEZONES } from '@/types/webinar';
import { PresenterCircles, RegistrationForm, useNextSession } from './shared';

interface TemplateProps { config: WebinarConfig; }

export default function MinimalistTemplate({ config }: TemplateProps) {
  const nextSession = useNextSession(config);
  const bg = config.regFormBackground || '#0a0a0a';
  const textColor = config.regFormTextColor || '#ffffff';

  // Secondary timezone time
  const getSecondaryTimeStr = () => {
    if (!config.regFormSecondaryTimezone || !nextSession || nextSession.isJit) return null;
    try {
      const tz2 = config.regFormSecondaryTimezone;
      const tzObj2 = TIMEZONES.find(t => t.value === tz2);
      const label2 = tzObj2 ? tzObj2.label.split('(')[1]?.replace(')', '') || tzObj2.label.split(' ')[0] : tz2;
      // Get the session time in secondary timezone
      const now = new Date();
      const time2 = now.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true,
        timeZone: tz2,
      });
      return `${time2} ${label2}`;
    } catch { return null; }
  };

  const secondaryTime = getSecondaryTimeStr();

  return (
    <div style={{
      background: bg,
      color: textColor,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: `'${config.regFormFontFamily || 'Garamond'}', 'Georgia', serif`,
      fontSize: config.regFormBodyFontSize || '1rem',
      padding: 20,
    }}>
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
        {/* Label */}
        <p style={{ fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.25, marginBottom: 24, fontWeight: 700 }}>
          FREE TRAINING
        </p>

        {/* Headline */}
        <h1 style={{
          fontFamily: `'${config.regFormHeadlineFontFamily || 'Garamond'}', 'Georgia', serif`,
          fontSize: config.regFormHeadlineFontSize || 'clamp(28px, 5vw, 46px)',
          fontWeight: Number(config.regFormHeadlineFontWeight) || 400,
          lineHeight: 1.25,
          marginBottom: 16,
          color: config.regFormHeadlineColor || textColor,
        }}>
          {config.regFormHeadline || 'Register for the Free Training'}
        </h1>

        {config.regFormSubheadline && (
          <p style={{ opacity: 0.5, marginBottom: 24, fontSize: '1em', lineHeight: 1.6 }}>
            {config.regFormSubheadline}
          </p>
        )}

        {/* Separator */}
        <div style={{ width: 40, height: 1, background: `${textColor}33`, margin: '0 auto 24px' }} />

        {/* Presenters */}
        <div style={{ marginBottom: 28 }}>
          <PresenterCircles
            presenters={config.regFormPresenters}
            accentColor={`${textColor}66`}
            size={64}
            borderWidth={3}
          />
        </div>

        {/* Form */}
        <div style={{ maxWidth: 360, margin: '0 auto', marginBottom: 20 }}>
          <RegistrationForm
            config={config}
            dark={bg.startsWith('#0') || bg.startsWith('#1') || bg === '#000000'}
            btnTextColor="#000000"
          />
        </div>

        {/* Session Time */}
        {nextSession && (
          <p style={{ fontSize: 12, opacity: 0.35, marginTop: 16 }}>
            {nextSession.isJit
              ? `Starting in ${nextSession.minutesAway} minutes`
              : `Today at ${nextSession.time} ${nextSession.timezone}${secondaryTime ? ` / ${secondaryTime}` : ''}`
            }
          </p>
        )}

        {/* Footer */}
        {config.regFormLegalLinks.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 40 }}>
            {config.regFormLegalLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, opacity: 0.25, color: textColor, textDecoration: 'underline' }}>{link.label}</a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
