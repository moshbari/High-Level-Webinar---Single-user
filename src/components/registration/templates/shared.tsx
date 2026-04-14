import { useState, useEffect, useMemo } from 'react';
import { WebinarConfig, TIMEZONES } from '@/types/webinar';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// === Countdown Hook ===
export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { h, m, s, total: seconds };
}

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

// === Next Session Calculator ===
export function useNextSession(config: WebinarConfig) {
  return useMemo(() => {
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
    const tz = config.timezone || 'UTC';
    const now = new Date();
    const todayInTz = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    const hh = String(config.startHour).padStart(2, '0');
    const mm = String(config.startMinute).padStart(2, '0');

    const getUtcMs = (dateStr: string, timeZone: string) => {
      const [datePart, timePart] = dateStr.split('T');
      const [y, mo, d] = datePart.split('-').map(Number);
      const [hr, mi, sc] = timePart.split(':').map(Number);
      const guess = new Date(Date.UTC(y, mo - 1, d, hr, mi, sc));
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }).formatToParts(guess);
      const get = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
      const tzAtGuess = new Date(Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') === 24 ? 0 : get('hour'), get('minute'), get('second')));
      const offsetMs = tzAtGuess.getTime() - guess.getTime();
      return guess.getTime() - offsetMs;
    };

    let targetMs = getUtcMs(`${todayInTz}T${hh}:${mm}:00`, tz);
    if (targetMs <= now.getTime()) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowInTz = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(tomorrow);
      targetMs = getUtcMs(`${tomorrowInTz}T${hh}:${mm}:00`, tz);
    }
    const sessionDate = new Date(targetMs);
    const tzObj = TIMEZONES.find(t => t.value === tz);
    const dateStr = sessionDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: tz });
    const timeStr = sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz });
    const tzLabel = tzObj ? tzObj.label.split(' - ')[1]?.replace(/[()]/g, '').trim() || tzObj.label.split(' ')[0] : 'Local';
    return { date: dateStr, time: timeStr, timezone: tzLabel, isJit: false, minutesAway: 0 };
  }, [config]);
}

// === Scheduled Countdown Hook ===
export function useScheduledCountdown(config: WebinarConfig) {
  const [countdown, setCountdown] = useState('');
  useEffect(() => {
    if (config.justInTimeEnabled) return;
    const tz = config.timezone || 'UTC';
    const getTargetMs = () => {
      const now = new Date();
      const todayInTz = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
      const hh = String(config.startHour).padStart(2, '0');
      const mm = String(config.startMinute).padStart(2, '0');
      const getUtcMs = (dateStr: string, timeZone: string) => {
        const [datePart, timePart] = dateStr.split('T');
        const [y, mo, d] = datePart.split('-').map(Number);
        const [hr, mi, sc] = timePart.split(':').map(Number);
        const guess = new Date(Date.UTC(y, mo - 1, d, hr, mi, sc));
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        }).formatToParts(guess);
        const get = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
        const tzAtGuess = new Date(Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') === 24 ? 0 : get('hour'), get('minute'), get('second')));
        const offsetMs = tzAtGuess.getTime() - guess.getTime();
        return guess.getTime() - offsetMs;
      };
      let targetMs = getUtcMs(`${todayInTz}T${hh}:${mm}:00`, tz);
      if (targetMs <= now.getTime()) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowInTz = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(tomorrow);
        targetMs = getUtcMs(`${tomorrowInTz}T${hh}:${mm}:00`, tz);
      }
      return targetMs;
    };
    const update = () => {
      const diff = getTargetMs() - Date.now();
      if (diff <= 0) { setCountdown('Starting now!'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [config.startHour, config.startMinute, config.timezone, config.justInTimeEnabled]);
  return countdown;
}

// === Presenter Circles ===
interface PresenterCirclesProps {
  presenters: Array<{ name: string; title: string; photoUrl: string }>;
  accentColor: string;
  size?: number;
  borderWidth?: number;
}

export function PresenterCircles({ presenters, accentColor, size = 80, borderWidth = 3 }: PresenterCirclesProps) {
  if (!presenters.length) return null;
  const mobileSize = Math.round(size * 0.8);
  return (
    <div className="flex gap-5 flex-wrap justify-center">
      {presenters.map((p, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div
            className="rounded-full overflow-hidden shrink-0"
            style={{
              width: `clamp(${mobileSize}px, 10vw, ${size}px)`,
              height: `clamp(${mobileSize}px, 10vw, ${size}px)`,
              border: `${borderWidth}px solid ${accentColor}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {p.photoUrl ? (
              <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-black text-xl"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, color: '#0a0a0a' }}
              >
                {p.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <p className="text-sm font-bold" style={{ opacity: 0.85 }}>{p.name}</p>
          {p.title && <p className="text-xs" style={{ opacity: 0.4 }}>{p.title}</p>}
        </div>
      ))}
    </div>
  );
}

// === Registration Form ===
interface RegistrationFormProps {
  config: WebinarConfig;
  accentColor?: string;
  dark?: boolean;
  btnTextColor?: string;
}

export function RegistrationForm({ config, accentColor, dark = true, btnTextColor = '#ffffff' }: RegistrationFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const nextSession = useNextSession(config);

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

  const inputBg = dark ? 'rgba(255,255,255,0.06)' : '#f3f4f6';
  const inputBorder = dark ? 'rgba(255,255,255,0.15)' : '#d1d5db';
  const textColor = dark ? '#ffffff' : '#1a1a1a';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: textColor }}>{config.regFormNameLabel || 'Your Name'}</label>
        <input
          type="text"
          placeholder={config.regFormNamePlaceholder || 'Enter your name'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2.5 sm:py-3 text-sm outline-none transition-all focus:ring-2 rounded-lg"
          style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textColor }}
          disabled={submitting}
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: textColor }}>{config.regFormEmailLabel || 'Your Email'}</label>
        <input
          type="email"
          placeholder={config.regFormEmailPlaceholder || 'Enter your email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2.5 sm:py-3 text-sm outline-none transition-all focus:ring-2 rounded-lg"
          style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textColor }}
          disabled={submitting}
        />
      </div>
      {formError && (
        <div className="text-red-400 text-xs sm:text-sm bg-red-500/10 p-2 rounded-lg">{formError}</div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 sm:py-3.5 font-bold text-sm sm:text-base transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed rounded-lg"
        style={{ background: config.regFormButtonColor || '#e53935', color: btnTextColor }}
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
        <p className="text-[10px] sm:text-xs opacity-50 text-center">
          🔒 {config.regFormPrivacyText || 'We respect your privacy.'}
        </p>
      )}
    </form>
  );
}
