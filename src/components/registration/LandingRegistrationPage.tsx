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
    const now = new Date();
    const sessionDate = new Date(now);
    sessionDate.setHours(config.startHour, config.startMinute, 0, 0);
    if (sessionDate <= now) sessionDate.setDate(sessionDate.getDate() + 1);
    const tz = TIMEZONES.find(t => t.value === config.timezone);
    const tzLabel = tz ? tz.label.split(' ')[0] : 'Local';
    return {
      date: sessionDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      timezone: tzLabel,
      isJit: false,
      minutesAway: 0,
    };
  }, [config]);

  // Countdown timer for scheduled webinars
  const [countdown, setCountdown] = useState('');
  useEffect(() => {
    if (!nextSession || nextSession.isJit) return;
    const getTargetDate = () => {
      const d = new Date();
      d.setHours(config.startHour, config.startMinute, 0, 0);
      if (d <= new Date()) d.setDate(d.getDate() + 1);
      return d;
    };
    const update = () => {
      const diff = getTargetDate().getTime() - Date.now();
      if (diff <= 0) { setCountdown('Starting now!'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [config.startHour, config.startMinute, nextSession]);

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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-3 sm:pb-6 text-center" style={config.regFormHeroImageUrl ? { marginTop: '-2rem', position: 'relative', zIndex: 1 } : {}}>
          {config.regFormPreHeadline && (
            <p className="text-xs sm:text-sm md:text-base font-semibold tracking-widest uppercase mb-2 sm:mb-3" style={{ color: config.regFormBulletColor || config.regFormButtonColor }}>
              {config.regFormPreHeadline}
            </p>
          )}

          <h1
            className="text-2xl sm:text-3xl md:text-5xl mb-2 sm:mb-3 leading-tight"
            style={{
              fontFamily: `'${config.regFormHeadlineFontFamily}', system-ui, sans-serif`,
              fontWeight: config.regFormHeadlineFontWeight || '700',
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

      {/* Presenters */}
      {config.regFormPresenters.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-4 sm:pb-8">
          <div className="flex justify-center gap-4 sm:gap-6 md:gap-10 flex-wrap">
            {config.regFormPresenters.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 sm:gap-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2" style={{ borderColor: config.regFormButtonColor }}>
                  {p.photoUrl ? (
                    <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl font-bold" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-semibold">{p.name}</p>
                  {p.title && <p className="text-[10px] sm:text-xs opacity-60">{p.title}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column: Bullets + Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="grid md:grid-cols-2 gap-5 sm:gap-8 md:gap-12 items-start">
          {/* Left: Bullets */}
          {(config.regFormBullets.length > 0 || config.regFormBulletHeadline) && (
            <div className="space-y-3 sm:space-y-5">
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

          {/* Right: Form */}
          <div className="space-y-3 sm:space-y-4">
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
                className="py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-center"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              >
                <span className="text-xs sm:text-sm md:text-base font-semibold">
                  {nextSession.isJit
                    ? `⚡ Starting in just ${nextSession.minutesAway} minutes!`
                    : `📅 Next Session: ${nextSession.date} at ${nextSession.time} (${nextSession.timezone})`}
                </span>
              </div>
            )}
          <div
            className="p-4 sm:p-6 md:p-8 shadow-2xl"
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius,
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5">{config.regFormNameLabel || 'Your Name'}</label>
                <input
                  type="text"
                  placeholder={config.regFormNamePlaceholder || 'Enter your name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base outline-none transition-all focus:ring-2"
                  style={inputStyle}
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5">{config.regFormEmailLabel || 'Your Email'}</label>
                <input
                  type="email"
                  placeholder={config.regFormEmailPlaceholder || 'Enter your email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base outline-none transition-all focus:ring-2"
                  style={inputStyle}
                  disabled={submitting}
                />
              </div>

              {formError && (
                <div className="text-red-400 text-xs sm:text-sm bg-red-500/10 p-2 sm:p-3 rounded-lg">{formError}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 sm:py-4 font-semibold text-white text-base sm:text-lg transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: config.regFormButtonColor || '#e53935', borderRadius }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
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
