import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, User, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { ROUTES } from '@/lib/routes';

const emailSchema = z.string().email('Please enter a valid email').max(255);

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && !authLoading) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.HOME;
      navigate(from, { replace: true });
    }
  }, [user, authLoading, location.state, navigate]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      emailSchema.parse(email.trim());
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors({ email: err.errors[0]?.message || 'Invalid email' });
      }
      return;
    }
    setMagicLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-magic-link`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            displayName: name.trim() || undefined,
            redirectTo: `${window.location.origin}${ROUTES.HOME}`,
          }),
        }
      );
      const result = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        toast.error(result.error || 'Could not send sign-in link');
      } else {
        setMagicSent(true);
        toast.success('Check your inbox for the sign-in link');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setMagicLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      emailSchema.parse(email.trim());
      if (password.length < 6) {
        setErrors({ password: 'Password must be at least 6 characters' });
        return;
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors({ email: err.errors[0]?.message || 'Invalid email' });
      }
      return;
    }
    setPasswordLoading(true);
    try {
      const { error } = await signIn(email.trim().toLowerCase(), password);
      if (error) {
        if (error.message.toLowerCase().includes('invalid login')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Welcome back!');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign in or sign up</CardTitle>
          <CardDescription>
            We'll email you a secure link — no password required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {magicSent ? (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Check your inbox</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We sent a sign-in link to <strong>{email}</strong>. Click it to sign in.
                </p>
              </div>
              <Button variant="outline" onClick={() => setMagicSent(false)} className="w-full">
                Use a different email
              </Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-muted-foreground font-normal">(new accounts)</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="pl-10"
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10"
                      autoComplete="email"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={magicLoading}>
                  {magicLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                  Email me a sign-in link
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">OR</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Sign in with password
                {showPassword ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showPassword && (
                <form onSubmit={handlePasswordLogin} className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Your password"
                        className="pl-10"
                        autoComplete="current-password"
                      />
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <Button type="submit" variant="secondary" className="w-full" disabled={passwordLoading}>
                    {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sign in
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Forgot it? Just use the sign-in link above.
                  </p>
                </form>
              )}

              <p className="text-xs text-center text-muted-foreground mt-6">
                You can set or change your password anytime from Account settings.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
