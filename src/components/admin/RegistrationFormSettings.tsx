import { WebinarConfig } from '@/types/webinar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ClipboardList, ChevronDown, Settings2, Link, Copy, Check, Send, Loader2, Layout, FileText, Palette } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { sendSampleWebhookData } from '@/pages/WebinarEditor';
import { LandingPageSettings } from './LandingPageSettings';

interface RegistrationFormSettingsProps {
  config: Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'>;
  onChange: (config: Omit<WebinarConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  webinarId?: string; // Optional webinar ID for generating hosted URL
}

export function RegistrationFormSettings({ config, onChange, webinarId }: RegistrationFormSettingsProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const { toast } = useToast();
  
  const updateField = <K extends keyof typeof config>(field: K, value: typeof config[K]) => {
    onChange({ ...config, [field]: value });
  };

  // Generate the hosted registration URL
  const urlId = config.slug || webinarId;
  const hostedUrl = urlId 
    ? `${window.location.origin}/register/${urlId}`
    : null;

  const copyHostedUrl = async () => {
    if (!hostedUrl) return;
    
    try {
      await navigator.clipboard.writeText(hostedUrl);
      setCopied(true);
      toast({
        title: "URL Copied!",
        description: "Registration page URL copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <ClipboardList className="w-5 h-5 text-primary" />
          Registration Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="enableRegistrationForm">Enable Registration Form</Label>
            <p className="text-xs text-muted-foreground">Generate embeddable registration form</p>
          </div>
          <Switch
            id="enableRegistrationForm"
            checked={config.enableRegistrationForm}
            onCheckedChange={(v) => updateField('enableRegistrationForm', v)}
          />
        </div>
        
        {config.enableRegistrationForm && (
          <>
            {/* Layout Picker */}
            <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-secondary/20">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-primary" />
                <Label className="font-medium">Page Layout</Label>
              </div>
              <RadioGroup
                value={config.regFormLayout}
                onValueChange={(v) => updateField('regFormLayout', v as 'simple' | 'landing')}
                className="grid grid-cols-2 gap-3"
              >
                <label htmlFor="layout-simple" className={`cursor-pointer flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${config.regFormLayout === 'simple' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border'}`}>
                  <RadioGroupItem value="simple" id="layout-simple" className="sr-only" />
                  <FileText className="w-6 h-6" />
                  <span className="text-sm font-medium">Simple Form</span>
                  <span className="text-xs text-muted-foreground text-center">Centered form only</span>
                </label>
                <label htmlFor="layout-landing" className={`cursor-pointer flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${config.regFormLayout === 'landing' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border'}`}>
                  <RadioGroupItem value="landing" id="layout-landing" className="sr-only" />
                  <Layout className="w-6 h-6" />
                  <span className="text-sm font-medium">Landing Page</span>
                  <span className="text-xs text-muted-foreground text-center">Full page with bullets & photos</span>
                </label>
              </RadioGroup>
            </div>

            {/* Landing Page specific settings */}
            {config.regFormLayout === 'landing' && (
              <LandingPageSettings config={config} onChange={onChange} />
            )}

            {/* Form Content */}
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="regFormHeadline">Form Headline</Label>
                <Input
                  id="regFormHeadline"
                  value={config.regFormHeadline}
                  onChange={(e) => updateField('regFormHeadline', e.target.value)}
                  placeholder="Register for the Free Training"
                  className="input-field"
                />
                <p className="text-[10px] text-muted-foreground/60">Format: **bold** · *italic* or _italic_ · __underline__</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="regFormSubheadline">Form Subheadline (optional)</Label>
                <Input
                  id="regFormSubheadline"
                  value={config.regFormSubheadline}
                  onChange={(e) => updateField('regFormSubheadline', e.target.value)}
                  placeholder="Save your spot now!"
                  className="input-field"
                />
                <p className="text-[10px] text-muted-foreground/60">Format: **bold** · *italic* or _italic_ · __underline__</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="regFormNameLabel">Name Field Label</Label>
                  <Input
                    id="regFormNameLabel"
                    value={config.regFormNameLabel}
                    onChange={(e) => updateField('regFormNameLabel', e.target.value)}
                    placeholder="Your Name"
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regFormNamePlaceholder">Name Placeholder</Label>
                  <Input
                    id="regFormNamePlaceholder"
                    value={config.regFormNamePlaceholder}
                    onChange={(e) => updateField('regFormNamePlaceholder', e.target.value)}
                    placeholder="Enter your name"
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="regFormEmailLabel">Email Field Label</Label>
                  <Input
                    id="regFormEmailLabel"
                    value={config.regFormEmailLabel}
                    onChange={(e) => updateField('regFormEmailLabel', e.target.value)}
                    placeholder="Your Email"
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regFormEmailPlaceholder">Email Placeholder</Label>
                  <Input
                    id="regFormEmailPlaceholder"
                    value={config.regFormEmailPlaceholder}
                    onChange={(e) => updateField('regFormEmailPlaceholder', e.target.value)}
                    placeholder="Enter your email"
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="regFormButtonText">Button Text</Label>
                  <Input
                    id="regFormButtonText"
                    value={config.regFormButtonText}
                    onChange={(e) => updateField('regFormButtonText', e.target.value)}
                    placeholder="Reserve My Seat →"
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regFormButtonColor">Button Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="regFormButtonColor"
                      value={config.regFormButtonColor}
                      onChange={(e) => updateField('regFormButtonColor', e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={config.regFormButtonColor}
                      onChange={(e) => updateField('regFormButtonColor', e.target.value)}
                      className="input-field flex-1"
                    />
                  </div>
                </div>
              </div>
              
              {/* Email Platform Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Email Management Platform</Label>
                <RadioGroup
                  value={config.regFormEmailPlatform}
                  onValueChange={(v) => updateField('regFormEmailPlatform', v as 'ghl' | 'systeme')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ghl" id="platform-ghl" />
                    <Label htmlFor="platform-ghl" className="cursor-pointer font-normal">GoHighLevel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="systeme" id="platform-systeme" />
                    <Label htmlFor="platform-systeme" className="cursor-pointer font-normal">Systeme.io</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* GHL Webhook - shown when GHL selected */}
              <div className={`space-y-2 transition-opacity ${config.regFormEmailPlatform !== 'ghl' ? 'opacity-40 pointer-events-none' : ''}`}>
                <Label htmlFor="regFormGhlWebhookUrl">GHL Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="regFormGhlWebhookUrl"
                    type="url"
                    value={config.regFormGhlWebhookUrl}
                    onChange={(e) => updateField('regFormGhlWebhookUrl', e.target.value)}
                    placeholder="https://services.leadconnectorhq.com/hooks/..."
                    className="input-field flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!config.regFormGhlWebhookUrl || sendingTest}
                    onClick={async () => {
                      setSendingTest(true);
                      const ok = await sendSampleWebhookData(config.regFormGhlWebhookUrl, config.webinarName, webinarId, config.productName, config.vendorName, config.slug);
                      setSendingTest(false);
                      toast({ title: ok ? 'Test Sent!' : 'Send Failed', description: ok ? 'Sample data sent to GHL webhook' : 'Could not reach webhook URL', variant: ok ? 'default' : 'destructive' });
                    }}
                    className="shrink-0"
                  >
                    {sendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">GoHighLevel webhook to receive registrations</p>
              </div>

              {/* Systeme.io Webhook - shown when Systeme selected */}
              <div className={`space-y-2 transition-opacity ${config.regFormEmailPlatform !== 'systeme' ? 'opacity-40 pointer-events-none' : ''}`}>
                <Label htmlFor="regFormSystemeWebhookUrl">Systeme.io Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="regFormSystemeWebhookUrl"
                    type="url"
                    value={config.regFormSystemeWebhookUrl}
                    onChange={(e) => updateField('regFormSystemeWebhookUrl', e.target.value)}
                    placeholder="https://systeme.io/webhook/..."
                    className="input-field flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!config.regFormSystemeWebhookUrl || sendingTest}
                    onClick={async () => {
                      setSendingTest(true);
                      const ok = await sendSampleWebhookData(config.regFormSystemeWebhookUrl, config.webinarName, webinarId, config.productName, config.vendorName, config.slug);
                      setSendingTest(false);
                      toast({ title: ok ? 'Test Sent!' : 'Send Failed', description: ok ? 'Sample data sent to Systeme.io webhook' : 'Could not reach webhook URL', variant: ok ? 'default' : 'destructive' });
                    }}
                    className="shrink-0"
                  >
                    {sendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Systeme.io webhook to receive registrations</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="regFormThankYouUrl">Thank You Page URL</Label>
                <Input
                  id="regFormThankYouUrl"
                  type="url"
                  value={config.regFormThankYouUrl}
                  onChange={(e) => updateField('regFormThankYouUrl', e.target.value)}
                  placeholder="https://yoursite.com/thank-you"
                  className="input-field"
                />
                <p className="text-xs text-muted-foreground">Redirect URL after successful registration</p>
              </div>
              
              {/* Hosted Registration Page URL */}
              {hostedUrl && (
                <div className="p-4 rounded-lg border border-border/50 bg-secondary/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-medium">Hosted Registration Page</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this link directly – no embedding needed
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={hostedUrl}
                      readOnly
                      className="input-field flex-1 text-sm font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyHostedUrl}
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <Label htmlFor="regFormShowDatetime">Show Webinar DateTime</Label>
                  <p className="text-xs text-muted-foreground">Display next session date/time on form</p>
                </div>
                <Switch
                  id="regFormShowDatetime"
                  checked={config.regFormShowDatetime}
                  onCheckedChange={(v) => updateField('regFormShowDatetime', v)}
                />
              </div>
              
              {/* Advanced Settings */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full py-2">
                  <Settings2 className="w-4 h-4" />
                  Advanced Styling
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  {/* Theme Presets */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary" />
                      <Label className="font-medium">Theme Presets</Label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => onChange({ ...config, regFormTheme: 'dark', regFormBackground: '#0a0a0f', regFormTextColor: '#ffffff', regFormButtonColor: '#e53935', regFormHeadlineColor: '#ffffff', regFormBulletColor: '#e53935', regFormSubheadlineColor: '' })}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${config.regFormTheme === 'dark' && config.regFormBackground === '#0a0a0f' ? 'border-primary ring-2 ring-primary/20' : 'border-border/50 hover:border-border'}`}
                      >
                        <div className="w-full h-6 rounded mb-1.5" style={{ background: '#0a0a0f' }}>
                          <div className="h-full flex items-center justify-center">
                            <div className="w-8 h-2 rounded" style={{ background: '#e53935' }} />
                          </div>
                        </div>
                        <span className="text-[10px] font-medium">Dark Red</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ ...config, regFormTheme: 'light', regFormBackground: '#ffffff', regFormTextColor: '#1a1a1a', regFormButtonColor: '#f97316', regFormHeadlineColor: '#1e40af', regFormBulletColor: '#1e40af', regFormSubheadlineColor: '#374151' })}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${config.regFormTheme === 'light' && config.regFormButtonColor === '#f97316' ? 'border-primary ring-2 ring-primary/20' : 'border-border/50 hover:border-border'}`}
                      >
                        <div className="w-full h-6 rounded mb-1.5" style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}>
                          <div className="h-full flex items-center justify-center">
                            <div className="w-8 h-2 rounded" style={{ background: '#f97316' }} />
                          </div>
                        </div>
                        <span className="text-[10px] font-medium">Trust Blue</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ ...config, regFormTheme: 'light', regFormBackground: '#f8fafc', regFormTextColor: '#334155', regFormButtonColor: '#22c55e', regFormHeadlineColor: '#0f172a', regFormBulletColor: '#22c55e', regFormSubheadlineColor: '#475569' })}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${config.regFormTheme === 'light' && config.regFormButtonColor === '#22c55e' ? 'border-primary ring-2 ring-primary/20' : 'border-border/50 hover:border-border'}`}
                      >
                        <div className="w-full h-6 rounded mb-1.5" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                          <div className="h-full flex items-center justify-center">
                            <div className="w-8 h-2 rounded" style={{ background: '#22c55e' }} />
                          </div>
                        </div>
                        <span className="text-[10px] font-medium">Clean Green</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regFormTheme">Form Theme</Label>
                    <Select
                      value={config.regFormTheme}
                      onValueChange={(v) => updateField('regFormTheme', v as 'dark' | 'light')}
                    >
                      <SelectTrigger className="input-field">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Dark Theme</SelectItem>
                        <SelectItem value="light">Light Theme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="regFormBackground">Form Background</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          id="regFormBackground"
                          value={config.regFormBackground}
                          onChange={(e) => updateField('regFormBackground', e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <Input
                          value={config.regFormBackground}
                          onChange={(e) => updateField('regFormBackground', e.target.value)}
                          className="input-field flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regFormTextColor">Text Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          id="regFormTextColor"
                          value={config.regFormTextColor}
                          onChange={(e) => updateField('regFormTextColor', e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <Input
                          value={config.regFormTextColor}
                          onChange={(e) => updateField('regFormTextColor', e.target.value)}
                          className="input-field flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regFormBorderRadius">Border Radius</Label>
                    <Select
                      value={config.regFormBorderRadius}
                      onValueChange={(v) => updateField('regFormBorderRadius', v as 'none' | 'slight' | 'rounded' | 'pill')}
                    >
                      <SelectTrigger className="input-field">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (0px)</SelectItem>
                        <SelectItem value="slight">Slight (6px)</SelectItem>
                        <SelectItem value="rounded">Rounded (12px)</SelectItem>
                        <SelectItem value="pill">Pill (9999px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Settings */}
                  <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-secondary/20">
                    <Label className="font-medium">Typography</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="regFormFontFamily">Body Font</Label>
                        <Select
                          value={config.regFormFontFamily}
                          onValueChange={(v) => updateField('regFormFontFamily', v)}
                        >
                          <SelectTrigger className="input-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Lato">Lato</SelectItem>
                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                            <SelectItem value="Raleway">Raleway</SelectItem>
                            <SelectItem value="Nunito">Nunito</SelectItem>
                            <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regFormHeadlineFontFamily">Headline Font</Label>
                        <Select
                          value={config.regFormHeadlineFontFamily}
                          onValueChange={(v) => updateField('regFormHeadlineFontFamily', v)}
                        >
                          <SelectTrigger className="input-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                            <SelectItem value="Raleway">Raleway</SelectItem>
                            <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                            <SelectItem value="Oswald">Oswald</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="regFormHeadlineFontSize">Headline Size</Label>
                        <Select
                          value={config.regFormHeadlineFontSize}
                          onValueChange={(v) => updateField('regFormHeadlineFontSize', v)}
                        >
                          <SelectTrigger className="input-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1.75rem">Small (1.75rem)</SelectItem>
                            <SelectItem value="2rem">Medium (2rem)</SelectItem>
                            <SelectItem value="2.5rem">Large (2.5rem)</SelectItem>
                            <SelectItem value="3rem">X-Large (3rem)</SelectItem>
                            <SelectItem value="3.5rem">XX-Large (3.5rem)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regFormBodyFontSize">Body Size</Label>
                        <Select
                          value={config.regFormBodyFontSize}
                          onValueChange={(v) => updateField('regFormBodyFontSize', v)}
                        >
                          <SelectTrigger className="input-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.875rem">Small (14px)</SelectItem>
                            <SelectItem value="1rem">Medium (16px)</SelectItem>
                            <SelectItem value="1.125rem">Large (18px)</SelectItem>
                            <SelectItem value="1.25rem">X-Large (20px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="regFormHeadlineFontWeight">Headline Weight</Label>
                        <Select
                          value={config.regFormHeadlineFontWeight}
                          onValueChange={(v) => updateField('regFormHeadlineFontWeight', v)}
                        >
                          <SelectTrigger className="input-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="400">Regular (400)</SelectItem>
                            <SelectItem value="500">Medium (500)</SelectItem>
                            <SelectItem value="600">Semi-Bold (600)</SelectItem>
                            <SelectItem value="700">Bold (700)</SelectItem>
                            <SelectItem value="800">Extra-Bold (800)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regFormHeadlineColor">Headline Color</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.regFormHeadlineColor || config.regFormTextColor}
                            onChange={(e) => updateField('regFormHeadlineColor', e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <Input
                            value={config.regFormHeadlineColor}
                            onChange={(e) => updateField('regFormHeadlineColor', e.target.value)}
                            placeholder="Same as text"
                            className="input-field flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regFormSubheadlineColor">Subheadline / Body Color</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.regFormSubheadlineColor || config.regFormTextColor}
                            onChange={(e) => updateField('regFormSubheadlineColor', e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <Input
                            value={config.regFormSubheadlineColor}
                            onChange={(e) => updateField('regFormSubheadlineColor', e.target.value)}
                            placeholder="Same as text"
                            className="input-field flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regFormBulletColor">Bullet Point Color</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.regFormBulletColor || '#1e40af'}
                            onChange={(e) => updateField('regFormBulletColor', e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <Input
                            value={config.regFormBulletColor}
                            onChange={(e) => updateField('regFormBulletColor', e.target.value)}
                            placeholder="#1e40af"
                            className="input-field flex-1"
                          />
                        </div>
                      <div className="space-y-2">
                        <Label htmlFor="regFormTimerColor">Countdown Timer Color</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={config.regFormTimerColor || '#e53935'}
                            onChange={(e) => updateField('regFormTimerColor', e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <Input
                            value={config.regFormTimerColor}
                            onChange={(e) => updateField('regFormTimerColor', e.target.value)}
                            placeholder="#e53935"
                            className="input-field flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <Label htmlFor="regFormShowPrivacy">Show Privacy Note</Label>
                      <p className="text-xs text-muted-foreground">Display privacy message below button</p>
                    </div>
                    <Switch
                      id="regFormShowPrivacy"
                      checked={config.regFormShowPrivacy}
                      onCheckedChange={(v) => updateField('regFormShowPrivacy', v)}
                    />
                  </div>
                  
                  {config.regFormShowPrivacy && (
                    <div className="space-y-2">
                      <Label htmlFor="regFormPrivacyText">Privacy Note Text</Label>
                      <Input
                        id="regFormPrivacyText"
                        value={config.regFormPrivacyText}
                        onChange={(e) => updateField('regFormPrivacyText', e.target.value)}
                        placeholder="We respect your privacy. Unsubscribe anytime."
                        className="input-field"
                      />
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
