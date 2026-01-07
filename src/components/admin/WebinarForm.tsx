import { WebinarConfig, TIMEZONES, DEFAULT_WEBINAR_CONFIG } from '@/types/webinar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Video, 
  Clock, 
  Users, 
  MessageSquare, 
  UserPlus, 
  Palette,
  Info
} from 'lucide-react';

interface WebinarFormProps {
  config: Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'>;
  onChange: (config: Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function WebinarForm({ config, onChange }: WebinarFormProps) {
  const updateField = <K extends keyof typeof config>(field: K, value: typeof config[K]) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <Info className="w-5 h-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="webinarName">Webinar Name</Label>
              <Input
                id="webinarName"
                value={config.webinarName}
                onChange={(e) => updateField('webinarName', e.target.value)}
                placeholder="e.g., Ultimate Online Mastery"
                className="input-field"
              />
              <p className="text-xs text-muted-foreground">Internal name for your reference</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="headerTitle">Header Title</Label>
              <Input
                id="headerTitle"
                value={config.headerTitle}
                onChange={(e) => updateField('headerTitle', e.target.value)}
                placeholder="e.g., Exclusive Training Session"
                className="input-field"
              />
              <p className="text-xs text-muted-foreground">Displayed in the webinar header</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoText">Logo Text</Label>
            <Input
              id="logoText"
              value={config.logoText}
              onChange={(e) => updateField('logoText', e.target.value.slice(0, 2))}
              placeholder="e.g., M"
              className="input-field w-24"
              maxLength={2}
            />
            <p className="text-xs text-muted-foreground">1-2 characters shown in the logo circle</p>
          </div>
        </CardContent>
      </Card>

      {/* Video Settings */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <Video className="w-5 h-5 text-primary" />
            Video Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              type="url"
              value={config.videoUrl}
              onChange={(e) => updateField('videoUrl', e.target.value)}
              placeholder="https://example.com/webinar.mp4"
              className="input-field"
            />
            <p className="text-xs text-muted-foreground">Direct MP4 link to your webinar video</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationMinutes">Duration (minutes)</Label>
            <Input
              id="durationMinutes"
              type="number"
              value={config.durationMinutes}
              onChange={(e) => updateField('durationMinutes', parseInt(e.target.value) || 60)}
              className="input-field w-32"
              min={1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedule Settings */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <Clock className="w-5 h-5 text-primary" />
            Schedule Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startHour">Start Hour</Label>
              <Select
                value={config.startHour.toString()}
                onValueChange={(v) => updateField('startHour', parseInt(v))}
              >
                <SelectTrigger className="input-field">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startMinute">Start Minute</Label>
              <Select
                value={config.startMinute.toString()}
                onValueChange={(v) => updateField('startMinute', parseInt(v))}
              >
                <SelectTrigger className="input-field">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      :{i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={config.timezone}
                onValueChange={(v) => updateField('timezone', v)}
              >
                <SelectTrigger className="input-field">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Viewer Count */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <Users className="w-5 h-5 text-primary" />
            Viewer Count (Social Proof)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minViewers">Minimum Viewers</Label>
              <Input
                id="minViewers"
                type="number"
                value={config.minViewers}
                onChange={(e) => updateField('minViewers', parseInt(e.target.value) || 100)}
                className="input-field"
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxViewers">Maximum Viewers</Label>
              <Input
                id="maxViewers"
                type="number"
                value={config.maxViewers}
                onChange={(e) => updateField('maxViewers', parseInt(e.target.value) || 200)}
                className="input-field"
                min={1}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Viewer count will fluctuate randomly between these values</p>
        </CardContent>
      </Card>

      {/* Chatbot Settings */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <MessageSquare className="w-5 h-5 text-primary" />
            Chatbot Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="botName">Bot Name</Label>
              <Input
                id="botName"
                value={config.botName}
                onChange={(e) => updateField('botName', e.target.value)}
                placeholder="e.g., Support Team"
                className="input-field"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="botAvatar">Bot Avatar Text</Label>
              <Input
                id="botAvatar"
                value={config.botAvatar}
                onChange={(e) => updateField('botAvatar', e.target.value.slice(0, 2))}
                placeholder="e.g., AI"
                className="input-field w-24"
                maxLength={2}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              type="url"
              value={config.webhookUrl}
              onChange={(e) => updateField('webhookUrl', e.target.value)}
              placeholder="https://your-n8n.com/webhook/chatbot"
              className="input-field"
            />
            <p className="text-xs text-muted-foreground">N8N or other webhook URL for AI responses</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="typingDelayMin">Typing Delay Min (seconds)</Label>
              <Input
                id="typingDelayMin"
                type="number"
                value={config.typingDelayMin}
                onChange={(e) => updateField('typingDelayMin', parseInt(e.target.value) || 2)}
                className="input-field"
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="typingDelayMax">Typing Delay Max (seconds)</Label>
              <Input
                id="typingDelayMax"
                type="number"
                value={config.typingDelayMax}
                onChange={(e) => updateField('typingDelayMax', parseInt(e.target.value) || 5)}
                className="input-field"
                min={1}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="errorMessage">Error Message</Label>
            <Textarea
              id="errorMessage"
              value={config.errorMessage}
              onChange={(e) => updateField('errorMessage', e.target.value)}
              placeholder="Message shown when AI fails to respond"
              className="input-field min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lead Capture Settings */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <UserPlus className="w-5 h-5 text-primary" />
            Lead Capture Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableLeadCapture">Enable Lead Capture</Label>
              <p className="text-xs text-muted-foreground">Require info before chatting</p>
            </div>
            <Switch
              id="enableLeadCapture"
              checked={config.enableLeadCapture}
              onCheckedChange={(v) => updateField('enableLeadCapture', v)}
            />
          </div>
          
          {config.enableLeadCapture && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <Label htmlFor="requireName">Require Name</Label>
                  <Switch
                    id="requireName"
                    checked={config.requireName}
                    onCheckedChange={(v) => updateField('requireName', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <Label htmlFor="requireEmail">Require Email</Label>
                  <Switch
                    id="requireEmail"
                    checked={config.requireEmail}
                    onCheckedChange={(v) => updateField('requireEmail', v)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  value={config.welcomeMessage}
                  onChange={(e) => updateField('welcomeMessage', e.target.value)}
                  placeholder="Hi {name}! 👋 Ask me anything..."
                  className="input-field min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">Use {'{name}'} to insert the user's name</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadWebhookUrl">Lead Webhook URL (optional)</Label>
                <Input
                  id="leadWebhookUrl"
                  type="url"
                  value={config.leadWebhookUrl}
                  onChange={(e) => updateField('leadWebhookUrl', e.target.value)}
                  placeholder="https://your-crm.com/webhook/leads"
                  className="input-field"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Branding */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <Palette className="w-5 h-5 text-primary" />
            Colors & Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="primaryColor"
                  value={config.primaryColor}
                  onChange={(e) => updateField('primaryColor', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  value={config.primaryColor}
                  onChange={(e) => updateField('primaryColor', e.target.value)}
                  className="input-field flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="backgroundColor"
                  value={config.backgroundColor}
                  onChange={(e) => updateField('backgroundColor', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  value={config.backgroundColor}
                  onChange={(e) => updateField('backgroundColor', e.target.value)}
                  className="input-field flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chatBackground">Chat Background</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="chatBackground"
                  value={config.chatBackground}
                  onChange={(e) => updateField('chatBackground', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  value={config.chatBackground}
                  onChange={(e) => updateField('chatBackground', e.target.value)}
                  className="input-field flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
