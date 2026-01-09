import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { TrialWarningBar } from '@/components/auth/TrialWarningBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, LogOut, Settings, User, Beaker } from 'lucide-react';

export default function Laboratory() {
  const navigate = useNavigate();
  const { profile, role, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Trial Warning Bar */}
      <TrialWarningBar />

      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Beaker className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">Laboratory</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate('/app-settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Admin Settings
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate('/update-password')}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome, {profile?.full_name || 'User'}!</h2>
          <p className="text-muted-foreground">
            You are logged in as a <span className="font-medium capitalize">{role}</span> user.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-primary" />
                Webinar Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage your webinars, view analytics, and create new content.
              </p>
            </CardContent>
          </Card>

          {isAdmin && (
            <>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/app-settings')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    App Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configure application settings, manage users, and adjust trial periods.
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/branding')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Branding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Customize the look and feel of your application.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
