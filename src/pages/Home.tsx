import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import {
  Loader2, CalendarClock, Bot, MessagesSquare, ClipboardList, Code2, MousePointerClick,
  LineChart, Film, Palette, PlayCircle,
} from 'lucide-react';

const FEATURES = [
  { icon: CalendarClock, title: 'Scheduled video webinars', text: 'Upload a recorded presentation once and run it on a schedule, with a countdown timer before it starts and a replay page afterwards.' },
  { icon: Bot, title: 'AI chat assistant', text: 'Each webinar has its own assistant, trained on your notes, that answers attendee questions in the chat while the video plays.' },
  { icon: MessagesSquare, title: 'Live chat inbox', text: 'Step in yourself when it matters. Reply by typing, by voice or with saved quick replies, across all your webinars in one place.' },
  { icon: ClipboardList, title: 'Registration pages', text: 'A hosted sign-up page for every webinar. New registrations are sent straight to your GoHighLevel account by webhook.' },
  { icon: Code2, title: 'Embed in GoHighLevel', text: 'Copy one embed code into any GoHighLevel funnel or website page. The player, chat and buttons come with it.' },
  { icon: MousePointerClick, title: 'Timed call-to-action buttons', text: 'Show a button at the exact minute of the presentation where you make your offer or invite people to book a call.' },
  { icon: LineChart, title: 'Analytics', text: 'Retention curve, watch time, conversion funnel, leads and every chat conversation, per webinar and per day.' },
  { icon: Film, title: 'Clip library', text: 'Keep all your presentation videos in one library and reuse them across webinars.' },
  { icon: Palette, title: 'Your branding', text: 'Your logo, colours and name on every webinar, registration and replay page.' },
];

const STEPS = [
  { n: '01', title: 'Add your video', text: 'Upload the recording, set the schedule and write the notes your AI assistant should know.' },
  { n: '02', title: 'Connect GoHighLevel', text: 'Paste your webhook so every registration lands in your CRM, then copy the embed code into your funnel.' },
  { n: '03', title: 'Run and improve', text: 'Watch the analytics and chat history, then adjust your content and the timing of your buttons.' },
];

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Signed-in users go straight to their webinars, as before.
  if (user) return <Navigate to={ROUTES.HOME} replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <PlayCircle className="h-6 w-6 text-primary" />
            High Level Webinar
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to={ROUTES.AUTH}>Sign in</Link></Button>
            <Button asChild size="sm" className="hidden sm:inline-flex"><Link to={ROUTES.AUTH}>Create account</Link></Button>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-medium text-primary mb-4">Webinar software for GoHighLevel users</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              Automated webinars with an AI assistant in the chat
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Run your recorded presentation on a schedule, answer attendee questions automatically,
              and send every registration into GoHighLevel.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to={ROUTES.AUTH}>Create your account</Link></Button>
              <Button asChild size="lg" variant="outline"><a href="#features">See the features</a></Button>
            </div>
          </div>

          {/* Illustration of the attendee view: player + chat */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden" aria-hidden="true">
            <div className="grid grid-cols-5">
              <div className="col-span-3 bg-muted aspect-video flex flex-col items-center justify-center gap-2 relative">
                <PlayCircle className="h-12 w-12 text-primary" />
                <span className="absolute top-2 left-2 rounded bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">STARTS IN 04:59</span>
                <span className="absolute bottom-3 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Book your call</span>
              </div>
              <div className="col-span-2 border-l border-border p-3 space-y-2 text-[11px]">
                <p className="font-semibold text-xs mb-1">Chat</p>
                <p className="rounded bg-muted px-2 py-1">Will there be a replay?</p>
                <p className="rounded bg-primary/10 px-2 py-1"><span className="font-semibold">Assistant:</span> Yes, everyone who registered gets the replay link.</p>
                <p className="rounded bg-muted px-2 py-1">Does it work with my GHL funnel?</p>
                <p className="rounded bg-primary/10 px-2 py-1"><span className="font-semibold">Assistant:</span> Yes, it embeds in any funnel page.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-muted/40 border-y border-border">
          <div className="max-w-6xl mx-auto px-4 py-20">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Everything a webinar needs, in one app</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">Built for coaches, agencies and businesses that already run their marketing on GoHighLevel.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(f => (
                <div key={f.title} className="rounded-xl border border-border bg-card p-6">
                  <f.icon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold tracking-tight mb-10">How it works</h2>
          <ol className="grid md:grid-cols-3 gap-8">
            {STEPS.map(s => (
              <li key={s.n} className="border-l-2 border-primary pl-5">
                <span className="text-primary font-bold">{s.n}</span>
                <h3 className="font-semibold text-lg mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-16 rounded-xl bg-primary text-primary-foreground p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Set up your first webinar</h2>
              <p className="opacity-90">Sign in with a one-click email link, no password needed.</p>
            </div>
            <Button asChild size="lg" variant="secondary"><Link to={ROUTES.AUTH}>Get started</Link></Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-muted-foreground space-y-3">
          <p>
            High Level Webinar is software developed and operated by{' '}
            <a href="https://zpresso.org" className="underline hover:text-foreground">ZPresso LLC</a>, a limited liability company
            licensed by Sharjah Media City (Shams), Sharjah, United Arab Emirates. GoHighLevel is a trademark of its owner;
            this app is independent and not affiliated with it.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-2">
            <span>© {new Date().getFullYear()} ZPresso LLC</span>
            <a href="https://zpresso.org/privacy" className="underline hover:text-foreground">Privacy</a>
            <a href="https://zpresso.org/terms" className="underline hover:text-foreground">Terms</a>
            <a href="mailto:hello@zpresso.org" className="underline hover:text-foreground">hello@zpresso.org</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
