import { WebinarConfig, TIMEZONES } from '@/types/webinar';
import { useMemo } from 'react';

interface RegistrationFormPreviewProps {
  config: Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'>;
}

const getBorderRadius = (radius: string) => {
  switch (radius) {
    case 'none': return '0px';
    case 'slight': return '6px';
    case 'rounded': return '12px';
    case 'pill': return '9999px';
    default: return '12px';
  }
};

export function RegistrationFormPreview({ config }: RegistrationFormPreviewProps) {
  const nextSession = useMemo(() => {
    if (config.justInTimeEnabled) {
      return {
        isJit: true,
        minutesAway: config.justInTimeMinutes,
        date: '',
        time: '',
        timezone: '',
      };
    }

    const now = new Date();
    const sessionDate = new Date(now);
    sessionDate.setHours(config.startHour, config.startMinute, 0, 0);
    
    if (sessionDate <= now) {
      sessionDate.setDate(sessionDate.getDate() + 1);
    }
    
    const tz = TIMEZONES.find(t => t.value === config.timezone);
    const tzLabel = tz ? tz.label.split(' ')[0] : 'Local';
    
    return {
      isJit: false,
      minutesAway: 0,
      date: sessionDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      timezone: tzLabel
    };
  }, [config.justInTimeEnabled, config.justInTimeMinutes, config.startHour, config.startMinute, config.timezone]);

  const isDark = config.regFormTheme === 'dark';
  const borderRadius = getBorderRadius(config.regFormBorderRadius);
  
  const containerStyle = {
    background: config.regFormBackground,
    color: config.regFormTextColor,
    borderRadius,
  };
  
  const inputStyle = {
    background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db'}`,
    borderRadius,
    color: config.regFormTextColor,
  };

  if (config.regFormLayout === 'landing') {
    return (
      <div className="border border-border/50 rounded-xl overflow-hidden">
        <div className="bg-muted/30 px-4 py-2 border-b border-border/50">
          <span className="text-xs text-muted-foreground font-medium">Landing Page Preview</span>
        </div>
        <div className="p-4 bg-background/50">
          <div className="max-w-lg mx-auto text-center" style={{ background: config.regFormBackground, color: config.regFormTextColor, borderRadius, padding: '1.5rem', fontFamily: `'${config.regFormFontFamily}', system-ui, sans-serif`, fontSize: config.regFormBodyFontSize }}>
            {config.regFormHeroImageUrl && (
              <img src={config.regFormHeroImageUrl} alt="Hero" className="w-full h-24 object-cover rounded-lg mb-4" />
            )}
            {config.regFormPreHeadline && (
              <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: config.regFormButtonColor }}>{config.regFormPreHeadline}</p>
            )}
            <h2 className="text-lg font-bold mb-1" style={{ fontFamily: `'${config.regFormHeadlineFontFamily}', system-ui, sans-serif`, color: config.regFormHeadlineColor || config.regFormTextColor, fontWeight: config.regFormHeadlineFontWeight || '700' }}>
              {config.regFormHeadline || 'Register for the Free Training'}
            </h2>
            {config.regFormPostHeadline && <p className="text-xs opacity-80 mb-2">{config.regFormPostHeadline}</p>}
            {config.regFormSubheadline && <p className="text-xs opacity-70 mb-3">{config.regFormSubheadline}</p>}

            {config.regFormPresenters.length > 0 && (
              <div className="flex justify-center gap-3 mb-4">
                {config.regFormPresenters.map((p, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full overflow-hidden border" style={{ borderColor: config.regFormButtonColor }}>
                      {p.photoUrl ? (
                        <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>{p.name.charAt(0)}</div>
                      )}
                    </div>
                    <p className="text-[10px] font-medium">{p.name}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-left">
              {config.regFormBullets.length > 0 && (
                <div className="space-y-2">
                  {config.regFormBulletHeadline && <h3 className="text-xs font-bold">{config.regFormBulletHeadline}</h3>}
                  {config.regFormBullets.slice(0, 4).map((b, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0 mt-0.5" style={{ background: config.regFormButtonColor }}>✓</span>
                      <span className="text-[10px] opacity-90">{b}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius }}>
                <input type="text" placeholder={config.regFormNamePlaceholder} className="w-full px-2 py-1.5 outline-none text-[10px]" style={inputStyle} disabled />
                <input type="email" placeholder={config.regFormEmailPlaceholder} className="w-full px-2 py-1.5 outline-none text-[10px]" style={inputStyle} disabled />
                <button className="w-full py-1.5 font-semibold text-white text-[10px]" style={{ background: config.regFormButtonColor, borderRadius }} disabled>
                  {config.regFormButtonText}
                </button>
              </div>
            </div>

            {config.regFormDisclaimerText && (
              <p className="text-[8px] opacity-40 mt-3 leading-relaxed">{config.regFormDisclaimerText}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Simple form preview
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <div className="bg-muted/30 px-4 py-2 border-b border-border/50">
        <span className="text-xs text-muted-foreground font-medium">Registration Form Preview</span>
      </div>
      
      <div className="p-6 bg-background/50">
        <div 
          className="max-w-md mx-auto p-8 text-center"
          style={{ ...containerStyle, fontFamily: `'${config.regFormFontFamily}', system-ui, sans-serif`, fontSize: config.regFormBodyFontSize }}
        >
          <h2 
            className="text-2xl mb-2"
            style={{ fontFamily: `'${config.regFormHeadlineFontFamily}', system-ui, sans-serif`, color: config.regFormHeadlineColor || config.regFormTextColor, fontWeight: config.regFormHeadlineFontWeight || '700' }}
          >
            {config.regFormHeadline || 'Register for the Free Training'}
          </h2>
          
          {config.regFormSubheadline && (
            <p className="opacity-80 mb-4">{config.regFormSubheadline}</p>
          )}
          
          {config.regFormShowDatetime && (
            <div 
              className="mb-6 py-2 px-4 rounded-lg inline-block"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            >
              <span className="text-sm">
                {nextSession.isJit
                  ? `⚡ Starting in just ${nextSession.minutesAway} minutes!`
                  : `📅 Next Session: ${nextSession.date} at ${nextSession.time} (${nextSession.timezone})`}
              </span>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium mb-1.5">{config.regFormNameLabel}</label>
              <input
                type="text"
                placeholder={config.regFormNamePlaceholder}
                className="w-full px-4 py-3 outline-none"
                style={inputStyle}
                disabled
              />
            </div>
            
            <div className="text-left">
              <label className="block text-sm font-medium mb-1.5">{config.regFormEmailLabel}</label>
              <input
                type="email"
                placeholder={config.regFormEmailPlaceholder}
                className="w-full px-4 py-3 outline-none"
                style={inputStyle}
                disabled
              />
            </div>
            
            <button
              className="w-full py-3.5 font-semibold text-white transition-all hover:opacity-90"
              style={{ 
                background: config.regFormButtonColor,
                borderRadius,
              }}
              disabled
            >
              {config.regFormButtonText}
            </button>
            
            {config.regFormShowPrivacy && (
              <p className="text-xs opacity-60">
                🔒 {config.regFormPrivacyText}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
