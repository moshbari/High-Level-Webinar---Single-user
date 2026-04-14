import { WebinarConfig, TIMEZONES } from '@/types/webinar';
import { Loader2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LandingRegistrationPageProps {
  config: WebinarConfig;
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

export default function LandingRegistrationPage({ config }: LandingRegistrationPageProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isDark = config.regFormTheme === 'dark';
  const borderRadius = getBorderRadius(config.regFormBorderRadius);

  // Build next session date in the configured timezone
  const getNextSessionInTz = () => {
    const tz = config.timezone || 'UTC';
    const now = new Date();
    // Build today's date string in the webinar timezone
    const todayInTz = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    // Create a date string like "2026-04-14T11:00:00" and interpret it in the target timezone
    const hh = String(config.startHour).padStart(2, '0');
    const mm = String(config.startMinute).padStart(2, '0');
    const candidateStr = `${todayInTz}T${hh}:${mm}:00`;
    // Use Intl to figure out the UTC offset for this timezone at this moment
    const getUtcMs = (dateStr: string, timeZone: string) => {
      // Parse the components from the dateStr
      const [datePart, timePart] = dateStr.split('T');
      const [y, mo, d] = datePart.split('-').map(Number);
      const [hr, mi, sc] = timePart.split(':').map(Number);
      // Create a rough guess in UTC
      const guess = new Date(Date.UTC(y, mo - 1, d, hr, mi, sc));
      // Find what time it is in the target tz at that UTC moment
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }).formatToParts(guess);
      const get = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
      const tzAtGuess = new Date(Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') === 24 ? 0 : get('hour'), get('minute'), get('second')));
      const offsetMs = tzAtGuess.getTime() - guess.getTime();
      return guess.getTime() - offsetMs;
    };
    let targetMs = getUtcMs(candidateStr, tz);
    if (targetMs <= now.getTime()) {
      // Move to tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowInTz = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(tomorrow);
      targetMs = getUtcMs(`${tomorrowInTz}T${hh}:${mm}:00`, tz);
    }
    return new Date(targetMs);
  };

  const nextSession = useMemo(() => {
    if (config.justInTimeEnabled) {
      const now = new Date();
      const jitStart = new Date(now.getTime() + config.justInTimeMinutes * 60 * 1000);
      return {
        date: jitStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: jitStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        timezone: 'Your Time',
        isJit: true,
        minutesAway: config.justInTimeMinutes,
      };
    }
    const sessionDate = getNextSessionInTz();
    const tz = config.timezone || 'UTC';
    const tzObj = TIMEZONES.find(t => t.value === tz);
    // Format the session date in the webinar's timezone
    const dateStr = sessionDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: tz });
    const timeStr = sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz });
    const tzLabel = tzObj ? tzObj.label.split(' - ')[1]?.replace(/[()]/g, '').trim() || tzObj.label.split(' ')[0] : 'Local';
    return {
      date: dateStr,
      time: timeStr,
      timezone: tzLabel,
      isJit: false,
      minutesAway: 0,
    };
  }, [config]);

  // Countdown timer for scheduled webinars
  const [countdown, setCountdown] = useState('');
  useEffect(() => {
    if (!nextSession || nextSession.isJit) return;
    const update = () => {
      const target = getNextSessionInTz();
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setCountdown('Starting now!'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [config.startHour, config.startMinute, config.timezone, nextSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setFormError('Please enter your name'); return; }
    if (!email.trim()) { setFormError('Please enter your email'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFormError('Please enter a valid email'); return; }
    setFormError(null);

    const webhookUrl = config.regFormEmailPlatform === 'systeme'
      ? config.regFormSystemeWebhookUrl
      : config.regFormGhlWebhookUrl;

    if (!webhookUrl) { setFormError('Registration not configured.'); return; }

    setSubmitting(true);
    try {
      const nameParts = name.trim().split(' ');
      const baseUrl = window.location.origin;
      const urlId = config.slug || config.id;
      const payload: Record<string, string> = {
        name: name.trim(),
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: email.trim(),
        webinar_id: config.id,
        webinar_name: config.webinarName,
        registered_at: new Date().toISOString(),
        source: 'HighLevelWebinar',
        product_name: config.productName || '',
        vendor_name: config.vendorName || '',
        watch_link: `${baseUrl}/watch/${urlId}`,
        replay_link: `${baseUrl}/replay/${urlId}`,
      };
      if (nextSession) {
        payload.session_date = nextSession.date;
        payload.session_time = nextSession.time;
        payload.session_timezone = nextSession.timezone;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed');

      if (config.regFormThankYouUrl) {
        const thankYouUrl = new URL(config.regFormThankYouUrl);
        thankYouUrl.searchParams.set('name', name.trim());
        thankYouUrl.searchParams.set('email', email.trim());
        window.location.href = thankYouUrl.toString();
      } else {
        toast({ title: "Registration successful!", description: "You've been registered." });
        setName('');
        setEmail('');
      }
    } catch {
      setFormError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db'}`,
    borderRadius: '8px',
    color: config.regFormTextColor || '#ffffff',
  };

  const fontImports = [config.regFormFontFamily, config.regFormHeadlineFontFamily]
    .filter((f, i, a) => a.indexOf(f) === i)
    .map(f => f.replace(/ /g, '+'))
    .join('&family=');

  return (
    <div
      className="min-h-screen"
      style={{ background: config.regFormBackground || '#0a0a0f', color: config.regFormTextColor || '#ffffff', fontFamily: `'${config.regFormFontFamily}', system-ui, sans-serif`, fontSize: config.regFormBodyFontSize || '1rem' }}
    >
      <link href={`https://fonts.googleapis.com/css2?family=${fontImports}:wght@300;400;500;600;700;800&display=swap`} rel="stylesheet" />
      {/* Hero Section */}
      <div className="relative">
        {config.regFormHeroImageUrl && (
          <div className="w-full h-32 sm:h-48 md:h-64 overflow-hidden">
            <img
              src={config.regFormHeroImageUrl}
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 h-32 sm:h-48 md:h-64" style={{ background: 'linear-gradient(to bottom, transparent 40%, ' + (config.regFormBackground || '#0a0a0f') + ')' }} />
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4 text-center" style={config.regFormHeroImageUrl ? { marginTop: '-2rem', position: 'relative', zIndex: 1 } : {}}>
          {config.regFormPreHeadline && (
            <p className="text-xs sm:text-sm md:text-base font-semibold tracking-widest uppercase mb-2 sm:mb-3" style={{ color: config.regFormBulletColor || config.regFormButtonColor }}>
              {config.regFormPreHeadline}
            </p>
          )}

          <h1
            className="mb-2 sm:mb-3 leading-tight"
            style={{
              fontFamily: `'${config.regFormHeadlineFontFamily}', system-ui, sans-serif`,
              fontWeight: config.regFormHeadlineFontWeight || '700',
              fontSize: config.regFormHeadlineFontSize || '1.75rem',
              color: config.regFormHeadlineColor || '#000000',
            }}
          >
            {config.regFormHeadline || 'Register for the Free Training'}
          </h1>

          {config.regFormPostHeadline && (
            <p className="text-sm sm:text-lg md:text-xl mb-2 sm:mb-4 max-w-2xl mx-auto" style={{ color: config.regFormSubheadlineColor || config.regFormTextColor }}>{config.regFormPostHeadline}</p>
          )}

        </div>
      </div>

      {/* Two Column: Bullets + Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-6 sm:pb-12">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-8 md:gap-12 items-start">
          {/* Left: Presenters + Bullets */}
          <div className="space-y-3 sm:space-y-4">
            {/* Presenters */}
            {config.regFormPresenters.length > 0 && (
              <div className="flex gap-3 sm:gap-5 flex-wrap">
                {config.regFormPresenters.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: config.regFormButtonColor }}>
                      {p.photoUrl ? (
                        <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold leading-tight">{p.name}</p>
                      {p.title && <p className="text-[10px] sm:text-xs opacity-60">{p.title}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bullets */}
            {(config.regFormBullets.length > 0 || config.regFormBulletHeadline) && (
              <div className="space-y-2 sm:space-y-4">
                {config.regFormBulletHeadline && (
                  <h2
                    className="text-lg sm:text-xl md:text-2xl"
                    style={{
                      fontFamily: `'${config.regFormHeadlineFontFamily}', system-ui, sans-serif`,
                      fontWeight: config.regFormHeadlineFontWeight || '700',
                      color: config.regFormHeadlineColor || config.regFormTextColor,
                    }}
                  >
                    {config.regFormBulletHeadline}
                  </h2>
                )}
                <ul className="space-y-2 sm:space-y-3">
                  {config.regFormBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                      <span className="mt-0.5 shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold" style={{ background: config.regFormBulletColor || '#1e40af' }}>✓</span>
                      <span className="text-sm sm:text-base md:text-lg" style={{ color: config.regFormSubheadlineColor || config.regFormTextColor, opacity: 0.9 }}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div className="space-y-2 sm:space-y-3">
            {config.regFormSubheadline && (
              <p className="text-center text-sm sm:text-base" style={{ color: config.regFormSubheadlineColor || config.regFormTextColor, opacity: 0.8 }}>{config.regFormSubheadline}</p>
            )}
            {config.regFormShowDatetime && nextSession && !nextSession.isJit && countdown && (
              <div className="text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider" style={{ color: config.regFormTimerColor || config.regFormHeadlineColor || config.regFormTextColor, fontFamily: 'monospace' }}>
                  {countdown}
                </p>
              </div>
            )}
            {config.regFormShowDatetime && nextSession && (
              <div
                className="py-2 px-3 sm:px-5 rounded-xl text-center"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              >
                <span className="text-xs sm:text-sm font-semibold">
                  {nextSession.isJit
                    ? `⚡ Starting in just ${nextSession.minutesAway} minutes!`
                    : `📅 Next Session: ${nextSession.date} at ${nextSession.time} (${nextSession.timezone})`}
                </span>
              </div>
            )}
          <div
            className="p-3 sm:p-5 md:p-6 shadow-2xl"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius,
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">{config.regFormNameLabel || 'Your Name'}</label>
                <input
                  type="text"
                  placeholder={config.regFormNamePlaceholder || 'Enter your name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-3 text-sm outline-none transition-all focus:ring-2"
                  style={inputStyle}
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">{config.regFormEmailLabel || 'Your Email'}</label>
                <input
                  type="email"
                  placeholder={config.regFormEmailPlaceholder || 'Enter your email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-3 text-sm outline-none transition-all focus:ring-2"
                  style={inputStyle}
                  disabled={submitting}
                />
              </div>

              {formError && (
                <div className="text-red-400 text-xs sm:text-sm bg-red-500/10 p-2 rounded-lg">{formError}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 sm:py-3.5 font-semibold text-white text-sm sm:text-base transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: config.regFormButtonColor || '#e53935', borderRadius }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </span>
                ) : (
                  config.regFormButtonText || 'Reserve My Seat →'
                )}
              </button>

              {config.regFormShowPrivacy && (
                <p className="text-[10px] sm:text-xs opacity-60 text-center">
                  🔒 {config.regFormPrivacyText || 'We respect your privacy.'}
                </p>
              )}
            </form>
          </div>
          </div>
        </div>
      </div>

      {/* Disclaimer & Legal */}
      {(config.regFormDisclaimerText || config.regFormLegalLinks.length > 0) && (
        <div className="border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center space-y-3 sm:space-y-4">
            {config.regFormDisclaimerText && (
              <p className="text-[10px] sm:text-xs opacity-50 max-w-2xl mx-auto leading-relaxed">{config.regFormDisclaimerText}</p>
            )}
            {config.regFormLegalLinks.length > 0 && (
              <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
                {config.regFormLegalLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] sm:text-xs underline opacity-50 hover:opacity-80 transition-opacity"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
